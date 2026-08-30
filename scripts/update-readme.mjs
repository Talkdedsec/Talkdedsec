import { existsSync, readFileSync, writeFileSync } from "node:fs";

const USER = process.env.PROFILE_USER || "Talkdedsec";
const TOKEN = process.env.GITHUB_TOKEN;
const START = "<!-- OSS:START -->";
const END = "<!-- OSS:END -->";

const OVERRIDES = (() => {
  try {
    return JSON.parse(readFileSync("assets/repos.json", "utf8"));
  } catch {
    return {};
  }
})();

const TEXT = {
  "README.md": {
    lang: "en",
    locale: "en-GB",
    head: ["Repository", "What it is", "Stack", "Updated"],
    empty: "Nothing public yet. Repositories are opened one at a time.",
    stars: "stars",
    synced: (d) => `Synced ${d} · public repositories only`,
  },
  "README.tr.md": {
    lang: "tr",
    locale: "tr-TR",
    head: ["Depo", "Nedir", "Teknoloji", "Güncelleme"],
    empty: "Henüz public depo yok. Depolar tek tek açılıyor.",
    stars: "yıldız",
    synced: (d) => `${d} tarihinde eşitlendi · yalnızca açık depolar`,
  },
};

TEXT["PROJECTS.md"] = TEXT["README.md"];
TEXT["PROJECTS.tr.md"] = TEXT["README.tr.md"];

async function api(path) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      accept: "application/vnd.github+json",
      "user-agent": "talkdedsec-profile",
      ...(TOKEN ? { authorization: `Bearer ${TOKEN}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`${path} → ${res.status} ${await res.text()}`);
  return res.json();
}

const repos = (await api(`/users/${USER}/repos?per_page=100&sort=pushed`))
  .filter((r) => !r.private && !r.fork && !r.archived && r.name.toLowerCase() !== USER.toLowerCase())
  .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ").trim();

function block(file) {
  const t = TEXT[file];
  const date = new Date().toLocaleDateString(t.locale, { day: "2-digit", month: "short", year: "numeric" });
  if (!repos.length) return `${t.empty}\n\n<sub>${t.synced(date)}</sub>`;

  const rows = repos.slice(0, 12).map((r) => {
    const ov = OVERRIDES[r.name] ?? {};
    const parts = ov.stack ?? [r.language, ...(r.topics || []).slice(0, 2)];
    const stack = parts.filter(Boolean).map((x) => `\`${x}\``).join(" ");
    const about = ov[t.lang] ?? r.description;
    const stars = r.stargazers_count ? ` · ${r.stargazers_count} ★` : "";
    const upd = new Date(r.pushed_at).toLocaleDateString(t.locale, { day: "2-digit", month: "short", year: "numeric" });
    return `| **[${cell(r.name)}](${r.html_url})**${stars} | ${cell(about) || "—"} | ${stack || "—"} | ${upd} |`;
  });

  return [
    `| ${t.head.join(" | ")} |`,
    "|:--|:--|:--|:--|",
    ...rows,
    "",
    `<sub>${t.synced(date)}</sub>`,
  ].join("\n");
}

let changed = false;
for (const file of Object.keys(TEXT)) {
  if (!existsSync(file)) continue;
  const src = readFileSync(file, "utf8");
  const a = src.indexOf(START);
  const b = src.indexOf(END);
  if (a === -1 || b === -1) throw new Error(`markers missing in ${file}`);
  const next = `${src.slice(0, a + START.length)}\n${block(file)}\n${src.slice(b)}`;
  if (next !== src) {
    writeFileSync(file, next);
    changed = true;
  }
}

console.log(changed ? `updated (${repos.length} public repos)` : "no change");
