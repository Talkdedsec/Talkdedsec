// Audits every public repository on the account and reports what drifted.
// Checks: repository metadata, the English/Turkish README pair, commit
// hygiene, release hygiene, broken links. Findings land in one issue on this
// repository, updated in place and closed when everything passes.
// AUDIT_DRY_RUN=1 prints the report instead of touching the issue.

const USER = process.env.PROFILE_USER || "Talkdedsec";
const TOKEN = process.env.GITHUB_TOKEN;
const ISSUE_REPO = process.env.AUDIT_ISSUE_REPO || `${USER}/${USER}`;
const ISSUE_TITLE = "Repository audit";
const LEGACY_TITLES = ["Repo denetimi"];
const COMMIT_EMAIL = process.env.COMMIT_EMAIL || "talkdedsec@pm.me";
const DRY_RUN = process.env.AUDIT_DRY_RUN === "1";

const MIN_TOPICS = 5;
const COMMIT_DEPTH = 50;
const SEMVER = /^v?\d+\.\d+\.\d+$/;
// Tool footers: a co-author with a vendor's noreply address, a "Generated with [..](..)"
// line, or a "<Something>-Session:" trailer. Real co-authors and GitHub's own bots use
// personal or users.noreply.github.com addresses, so they do not match.
const TOOL_FOOTER = [
  /^Co-Authored-By:.*<noreply@(?!github\.com>|users\.noreply\.github\.com>)[^>]+>/im,
  /^.*Generated with \[[^\]]+\]\(https?:\/\/[^)]+\)/im,
  /^[A-Z][\w-]*-Session:/m,
];
const TURKISH = /[ğşıçöüĞŞİÇÖÜ]|\b(ve|ile|için|bir|olan|yok|var|tek|kurulum|çalışan|araç|dosya)\b/;
// Either a per-file digest (app.exe.sha256, .asc, .sig) or a combined list (SHA256SUMS, checksums.txt).
const CHECKSUM = /\.(sha256|sha512|txt|asc|sig)$|^(sha256|sha512)sums$/i;

const headers = {
  accept: "application/vnd.github+json",
  "user-agent": "talkdedsec-audit",
  ...(TOKEN ? { authorization: `Bearer ${TOKEN}` } : {}),
};

async function api(path, init = {}) {
  const res = await fetch(`https://api.github.com${path}`, { ...init, headers: { ...headers, ...init.headers } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${path} → ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

async function raw(repo, path) {
  const res = await fetch(`https://raw.githubusercontent.com/${repo}/HEAD/${path}`, {
    headers: { "user-agent": "talkdedsec-audit" },
  });
  return res.ok ? res.text() : null;
}

// --- checks ----------------------------------------------------------------

function metadata(r, latest, findings) {
  const say = (m) => findings.push(m);
  const d = (r.description || "").trim();

  if (!d) say("description is empty");
  else {
    if (TURKISH.test(d)) say("description is Turkish; search and the profile table expect English");
    const head = d.slice(0, r.name.length + 4).toLowerCase();
    if (head.startsWith(r.name.toLowerCase()) || head.startsWith(`talkdedsec-${r.name.replace(/^tlk-/, "")}`)) {
      say("description starts by repeating the repository name");
    }
  }

  const isProfile = r.name.toLowerCase() === USER.toLowerCase();
  if (!isProfile && (r.topics || []).length < MIN_TOPICS) {
    say(`${(r.topics || []).length} topics, at least ${MIN_TOPICS} expected`);
  }
  // A homepage needs something to point at: a Pages site or a release to download.
  if (!r.homepage && (r.has_pages || latest)) say("homepage is empty");
  if (r.has_wiki) say("wiki is enabled but unused");
  if (r.has_projects) say("projects tab is enabled but unused");
}

function readmes(paths, findings) {
  if (!paths.has("README.md")) findings.push("README.md is missing");
  if (!paths.has("README.tr.md")) findings.push("README.tr.md is missing; every repository carries a Turkish README");
}

async function commits(r, findings) {
  const list = await api(`/repos/${r.full_name}/commits?per_page=${COMMIT_DEPTH}`);
  if (!list) return;

  const emails = new Set();
  let footers = 0;
  for (const c of list) {
    const author = c.commit.author;
    const mine = c.author?.login === USER || author?.name === USER;
    if (mine && author?.email && author.email !== COMMIT_EMAIL) emails.add(author.email);
    if (TOOL_FOOTER.some((re) => re.test(c.commit.message))) footers++;
  }

  if (emails.size) findings.push(`commits authored as ${[...emails].join(", ")} instead of ${COMMIT_EMAIL}`);
  if (footers) findings.push(`${footers} commit message(s) carry a tool co-author or generated-with footer`);
}

function releases(latest, findings) {
  if (!latest) return; // a repository without releases is not a finding

  if (!SEMVER.test(latest.tag_name)) findings.push(`release tag is not semver: ${latest.tag_name}`);
  if (!(latest.body || "").trim()) findings.push(`${latest.tag_name} has empty release notes`);

  const assets = latest.assets || [];
  if (assets.length === 0) {
    findings.push(`${latest.tag_name} carries no assets, so a download cannot be verified`);
  } else if (!assets.some((a) => CHECKSUM.test(a.name))) {
    findings.push(`${latest.tag_name} assets include no checksum`);
  }
}

function extractLinks(md) {
  const out = new Set();
  // URLs may contain one level of balanced parentheses (Wikipedia, Wikimedia)
  for (const m of md.matchAll(/\]\(((?:[^()\s]|\([^()\s]*\))+)(?:\s+"[^"]*")?\)/g)) out.add(m[1]);
  for (const m of md.matchAll(/(?:href|src|srcset)="([^"]+)"/g)) out.add(m[1].split(/\s|,/)[0]);
  return [...out].filter((l) => l && !l.startsWith("#") && !l.startsWith("mailto:") && !l.startsWith("data:"));
}

async function reachable(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        headers: { "user-agent": "Mozilla/5.0 talkdedsec-audit" },
        signal: AbortSignal.timeout(12000),
      });
      if (res.ok) return true;
      if (res.status === 405) continue;
      // The server is there but turns away automated clients (npm, some CDNs):
      // not evidence of a broken link.
      if ([401, 403, 429].includes(res.status)) return true;
      return false;
    } catch {
      // fall through to the next method, then report
    }
  }
  return false;
}

async function links(r, paths, findings) {
  const external = new Set();

  for (const file of ["README.md", "README.tr.md"]) {
    const md = await raw(r.full_name, file);
    if (!md) continue;
    for (const link of extractLinks(md)) {
      if (/^https?:\/\//.test(link)) {
        if (!/img\.shields\.io|badge\.svg/.test(link)) external.add(link);
        continue;
      }
      const clean = link.split("#")[0].replace(/^\.\//, "");
      if (!clean) continue;
      if (!paths.has(clean)) findings.push(`${file} → local file missing: ${link}`);
    }
  }

  for (const url of external) {
    if (!(await reachable(url))) findings.push(`unreachable link: ${url}`);
  }
}

// --- run -------------------------------------------------------------------

const repos = (await api(`/users/${USER}/repos?per_page=100&sort=pushed`)).filter(
  (r) => !r.private && !r.fork && !r.archived,
);

const report = [];
for (const r of repos) {
  const findings = [];
  const tree = await api(`/repos/${r.full_name}/git/trees/${r.default_branch}?recursive=1`);
  const paths = new Set((tree?.tree || []).map((n) => n.path));
  const latest = await api(`/repos/${r.full_name}/releases/latest`);
  metadata(r, latest, findings);
  readmes(paths, findings);
  await commits(r, findings);
  releases(latest, findings);
  await links(r, paths, findings);
  if (findings.length) report.push({ repo: r.name, url: r.html_url, findings });
  console.log(`${r.name}: ${findings.length || "clean"}`);
}

const stamp = new Date().toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short", timeZone: "UTC" });
const total = report.reduce((n, r) => n + r.findings.length, 0);

const body = report.length
  ? [
      `${repos.length} public repositories scanned, **${total} finding(s)**.`,
      "",
      ...report.flatMap((r) => [
        `### [${r.repo}](${r.url})`,
        ...r.findings.map((f) => `- ${f}`),
        "",
      ]),
      "---",
      `<sub>${stamp} UTC · \`scripts/audit.mjs\` · run it by hand from Actions → audit → Run workflow</sub>`,
    ].join("\n")
  : [
      `${repos.length} public repositories scanned, nothing found.`,
      "",
      "Metadata, READMEs, commit hygiene, release hygiene and links are all clean.",
      "",
      "---",
      `<sub>${stamp} UTC · \`scripts/audit.mjs\`</sub>`,
    ].join("\n");

if (DRY_RUN) {
  console.log(`\n${body}`);
} else {
  let existing = null;
  for (const title of [ISSUE_TITLE, ...LEGACY_TITLES]) {
    const search = await api(
      `/search/issues?q=${encodeURIComponent(`repo:${ISSUE_REPO} is:issue in:title "${title}"`)}`,
    );
    existing = (search?.items || []).find((i) => i.title === title);
    if (existing) break;
  }

  if (existing) {
    await api(`/repos/${ISSUE_REPO}/issues/${existing.number}`, {
      method: "PATCH",
      body: JSON.stringify({ title: ISSUE_TITLE, body, state: report.length ? "open" : "closed" }),
    });
    console.log(`issue #${existing.number} updated (${report.length ? "open" : "closed"})`);
  } else if (report.length) {
    const made = await api(`/repos/${ISSUE_REPO}/issues`, {
      method: "POST",
      body: JSON.stringify({ title: ISSUE_TITLE, body }),
    });
    console.log(`issue #${made.number} opened`);
  } else {
    console.log("nothing found, no issue opened");
  }
}
