// Audits every public repository on the account and reports what drifted.
// Checks: repository metadata, commit hygiene, release hygiene, broken links.
// Findings land in one issue on this repository, updated in place and closed
// when everything passes.

const USER = process.env.PROFILE_USER || "Talkdedsec";
const TOKEN = process.env.GITHUB_TOKEN;
const ISSUE_REPO = process.env.AUDIT_ISSUE_REPO || `${USER}/${USER}`;
const ISSUE_TITLE = "Repo denetimi";

const MIN_TOPICS = 5;
const COMMIT_DEPTH = 50;
const SEMVER = /^v?\d+\.\d+\.\d+$/;
const AI_FOOTER = /(Claude-Session|Co-Authored-By:\s*Claude|Generated with \[?Claude)/i;
const PERSONAL_EMAIL = /@(proton\.me|pm\.me|gmail\.com|outlook\.com|hotmail\.com|yandex\.com)$/i;
const TURKISH = /[ğşıçöüĞŞİÇÖÜ]|\b(ve|ile|için|bir|olan|yok|var|tek|kurulum|çalışan|araç|dosya)\b/;
const CHECKSUM = /\.(sha256|sha512|txt|asc|sig)$/i;

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

function metadata(r, findings) {
  const say = (m) => findings.push(m);
  const d = (r.description || "").trim();

  if (!d) say("description boş");
  else {
    if (TURKISH.test(d)) say("description Türkçe — arama ve profil tablosu İngilizce bekliyor");
    const head = d.slice(0, r.name.length + 4).toLowerCase();
    if (head.startsWith(r.name.toLowerCase()) || head.startsWith(`talkdedsec-${r.name.replace(/^tlk-/, "")}`)) {
      say("description repo adını tekrarlayarak başlıyor");
    }
  }

  const isProfile = r.name.toLowerCase() === USER.toLowerCase();
  if (!isProfile && (r.topics || []).length < MIN_TOPICS) {
    say(`topic sayısı ${(r.topics || []).length}, en az ${MIN_TOPICS} olmalı`);
  }
  if (!r.homepage) say("homepage boş");
  if (r.has_wiki) say("wiki açık ama kullanılmıyor");
  if (r.has_projects) say("projects sekmesi açık ama kullanılmıyor");
}

async function commits(r, findings) {
  const list = await api(`/repos/${r.full_name}/commits?per_page=${COMMIT_DEPTH}`);
  if (!list) return;

  const emails = new Set();
  let footers = 0;
  for (const c of list) {
    for (const who of [c.commit.author, c.commit.committer]) {
      const mail = who?.email ?? "";
      if (PERSONAL_EMAIL.test(mail)) emails.add(mail);
    }
    if (AI_FOOTER.test(c.commit.message)) footers++;
  }

  if (emails.size) findings.push(`commit yazarında kişisel e-posta: ${[...emails].join(", ")}`);
  if (footers) findings.push(`${footers} commit mesajında AI oturum footer'ı var`);
}

async function releases(r, findings) {
  const latest = await api(`/repos/${r.full_name}/releases/latest`);
  if (!latest) return; // a repository without releases is not a finding

  if (!SEMVER.test(latest.tag_name)) findings.push(`release etiketi semver değil: ${latest.tag_name}`);
  if (!(latest.body || "").trim()) findings.push(`${latest.tag_name} release notu boş`);

  const assets = latest.assets || [];
  if (assets.length === 0) {
    findings.push(`${latest.tag_name} hiç asset taşımıyor — indiren doğrulayamıyor`);
  } else if (!assets.some((a) => CHECKSUM.test(a.name))) {
    findings.push(`${latest.tag_name} asset'lerinde checksum yok`);
  }
}

function extractLinks(md) {
  const out = new Set();
  for (const m of md.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) out.add(m[1]);
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
      if (res.status === 405 || res.status === 403) continue;
      return false;
    } catch {
      // fall through to the next method, then report
    }
  }
  return false;
}

async function links(r, findings) {
  const tree = await api(`/repos/${r.full_name}/git/trees/${r.default_branch}?recursive=1`);
  const paths = new Set((tree?.tree || []).map((n) => n.path));
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
      if (!paths.has(clean)) findings.push(`${file} → yerel dosya yok: ${link}`);
    }
  }

  for (const url of external) {
    if (!(await reachable(url))) findings.push(`erişilemeyen link: ${url}`);
  }
}

// --- run -------------------------------------------------------------------

const repos = (await api(`/users/${USER}/repos?per_page=100&sort=pushed`)).filter(
  (r) => !r.private && !r.fork && !r.archived,
);

const report = [];
for (const r of repos) {
  const findings = [];
  metadata(r, findings);
  await commits(r, findings);
  await releases(r, findings);
  await links(r, findings);
  if (findings.length) report.push({ repo: r.name, url: r.html_url, findings });
  console.log(`${r.name}: ${findings.length || "temiz"}`);
}

const stamp = new Date().toLocaleString("tr-TR", { dateStyle: "long", timeStyle: "short" });
const total = report.reduce((n, r) => n + r.findings.length, 0);

const body = report.length
  ? [
      `${repos.length} public depo tarandı, **${total} bulgu** var.`,
      "",
      ...report.flatMap((r) => [
        `### [${r.repo}](${r.url})`,
        ...r.findings.map((f) => `- ${f}`),
        "",
      ]),
      "---",
      `<sub>${stamp} · \`scripts/audit.mjs\` · elle çalıştırmak için Actions → denetim → Run workflow</sub>`,
    ].join("\n")
  : [
      `${repos.length} public depo tarandı, bulgu yok.`,
      "",
      "Künye, commit hijyeni, release hijyeni ve link taraması dördü de temiz.",
      "",
      "---",
      `<sub>${stamp} · \`scripts/audit.mjs\`</sub>`,
    ].join("\n");

const search = await api(
  `/search/issues?q=${encodeURIComponent(`repo:${ISSUE_REPO} is:issue in:title "${ISSUE_TITLE}"`)}`,
);
const existing = (search?.items || []).find((i) => i.title === ISSUE_TITLE);

if (existing) {
  await api(`/repos/${ISSUE_REPO}/issues/${existing.number}`, {
    method: "PATCH",
    body: JSON.stringify({ body, state: report.length ? "open" : "closed" }),
  });
  console.log(`issue #${existing.number} güncellendi (${report.length ? "açık" : "kapatıldı"})`);
} else if (report.length) {
  const made = await api(`/repos/${ISSUE_REPO}/issues`, {
    method: "POST",
    body: JSON.stringify({ title: ISSUE_TITLE, body }),
  });
  console.log(`issue #${made.number} açıldı`);
} else {
  console.log("bulgu yok, issue açılmadı");
}
