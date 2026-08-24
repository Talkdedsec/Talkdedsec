import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = dirname(fileURLToPath(import.meta.url));
const DIR = "v1";

const SANS = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const THEMES = {
  light: { bg: "#FFFFFF", card: "#FDFDFD", line: "#E7E7E7", text: "#0A0A0A", muted: "#63666B", faint: "#A9ACB1", ghost: "#F1F1F2", accent: "#D62839", accent2: "#8E1B27" },
  dark: { bg: "#0D1117", card: "#101620", line: "#232A35", text: "#F2F4F7", muted: "#98A0AC", faint: "#5F6773", ghost: "#161D28", accent: "#FF4256", accent2: "#B22638" },
};

function card(theme, { w, h, kicker, title, lines, meta, big, link }) {
  const c = THEMES[theme];
  const pad = 28;
  let g = `<rect x=".75" y=".75" width="${w - 1.5}" height="${h - 1.5}" rx="8" fill="${c.card}" stroke="${c.line}" stroke-width="1.5"/>`;
  g += `<path d="M9 1 H2.5 A1.5 1.5 0 0 0 1 2.5 V${h - 2.5} A1.5 1.5 0 0 0 2.5 ${h - 1} H9 Z" fill="url(#edge)"/>`;

  if (big) {
    g += `<text x="${w - pad}" y="${h - 40}" text-anchor="end" font-family="${SANS}" font-size="${w > 500 ? 74 : 58}" font-weight="300" letter-spacing="-3" fill="${c.ghost}">${esc(big)}</text>`;
  }

  let y = pad + 13;
  if (kicker) {
    g += `<text x="${pad}" y="${y}" font-family="${MONO}" font-size="10.5" letter-spacing="2.6" fill="${c.accent}">${esc(kicker.toUpperCase())}</text>`;
    y += 33;
  }
  g += `<text x="${pad}" y="${y + 7}" font-family="${SANS}" font-size="22" font-weight="500" letter-spacing="-.35" fill="${c.text}">${esc(title)}</text>`;
  if (link) {
    g += `<text x="${w - pad}" y="${pad + 13}" text-anchor="end" font-family="${SANS}" font-size="15" fill="${c.faint}">↗</text>`;
  }
  y += 37;
  lines.forEach((ln) => {
    g += `<text x="${pad}" y="${y}" font-family="${SANS}" font-size="14.5" fill="${c.muted}">${esc(ln)}</text>`;
    y += 22;
  });
  if (meta) {
    g += `<text x="${pad}" y="${h - pad + 5}" font-family="${MONO}" font-size="10.5" letter-spacing="1.5" fill="${c.faint}">${esc(meta)}</text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}">
<defs><linearGradient id="edge" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${c.accent}"/><stop offset="1" stop-color="${c.accent2}"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="${c.bg}"/>
${g}
</svg>`;
}

function eyeGrid(cx, cy, c) {
  const cols = 34, rows = 20, gap = 9.5;
  const rx = (cols * gap) / 2, ry = (rows * gap) / 2;
  let out = "";
  for (let r = 0; r < rows; r++) {
    for (let q = 0; q < cols; q++) {
      const x = cx - rx + q * gap + gap / 2;
      const y = cy - ry + r * gap + gap / 2;
      const lens = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
      if (lens > 1) continue;
      const irisD = Math.hypot((x - cx) / 46, (y - cy) / 46);
      if (irisD < 0.42) continue;
      const inIris = irisD < 1;
      const fade = 1 - lens;
      const size = inIris ? 2.7 : 1.15 + fade * 1.5;
      const op = (inIris ? 0.92 : 0.16 + fade * 0.55).toFixed(2);
      const delay = ((x - cx + rx) / (rx * 2)) * 2.6;
      out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${size.toFixed(2)}" fill="${inIris ? c.accent : c.faint}" opacity="${op}" style="animation:scan 5.2s ${delay.toFixed(2)}s ease-in-out infinite"/>`;
    }
  }
  return out;
}

function hero(theme, s) {
  const c = THEMES[theme];
  const h = 430;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="${h}" viewBox="0 0 1280 ${h}" role="img" aria-label="Talkdedsec">
<defs>
<radialGradient id="wash" cx="0" cy="0" r="1" gradientTransform="translate(300 205) scale(760 330)">
<stop offset="0" stop-color="${c.accent}" stop-opacity="${theme === "dark" ? ".07" : ".045"}"/>
<stop offset="1" stop-color="${c.accent}" stop-opacity="0"/></radialGradient>
</defs>
<style>
  @keyframes sweep { 0% { transform: translateX(-170px); opacity: 0 } 22% { opacity: 1 } 100% { transform: translateX(580px); opacity: 0 } }
  @keyframes rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
  @keyframes scan { 0%,100% { opacity: .16 } 45% { opacity: .95 } }
  @keyframes blink { 0%,46% { opacity: 1 } 47%,100% { opacity: 0 } }
  .r { animation: rise 1s cubic-bezier(.22,1,.36,1) }
  .d1 { animation-delay: .05s } .d2 { animation-delay: .2s } .d3 { animation-delay: .36s } .d4 { animation-delay: .52s }
  .sw { animation: sweep 3.8s 1s ease-in-out infinite }
</style>
<rect width="1280" height="${h}" fill="${c.bg}"/>
<rect width="1280" height="${h}" fill="url(#wash)"/>
<g opacity=".95">${eyeGrid(1025, 215, c)}</g>
<rect x="0" y="0" width="1280" height="1" fill="${c.line}"/>
<rect x="0" y="${h - 1}" width="1280" height="1" fill="${c.line}"/>
<g class="r d1"><text x="96" y="126" font-family="${MONO}" font-size="12" letter-spacing="4.6" fill="${c.accent}">${esc(s.eyebrow)}</text></g>
<g class="r d2"><text x="93" y="228" font-family="${SANS}" font-size="94" font-weight="300" letter-spacing="-3.8" fill="${c.text}">Talkdedsec</text></g>
<rect x="96" y="254" width="560" height="2" fill="${c.accent}"/>
<clipPath id="bc"><rect x="96" y="251" width="560" height="8"/></clipPath>
<g clip-path="url(#bc)"><rect class="sw" x="96" y="251" width="150" height="8" fill="${c.text}" opacity=".5"/></g>
<g class="r d3"><text x="96" y="308" font-family="${SANS}" font-size="21" fill="${c.muted}">${esc(s.sub1)}</text></g>
<g class="r d3"><text x="96" y="338" font-family="${SANS}" font-size="21" fill="${c.muted}">${esc(s.sub2)}</text></g>
<g class="r d4">
  <text x="96" y="${h - 36}" font-family="${MONO}" font-size="12" letter-spacing="1.6" fill="${c.faint}">${esc(s.foot)}</text>
  <rect x="${(96 + s.foot.length * 8.9).toFixed(1)}" y="${h - 46}" width="8" height="13" fill="${c.accent}" style="animation:blink 1.15s step-end infinite"/>
</g>
</svg>`;
}

function metrics(theme, items) {
  const c = THEMES[theme];
  const w = 1280, h = 172;
  const colW = w / items.length;
  let g = "";
  items.forEach((it, i) => {
    const x = colW * i + colW / 2;
    if (i > 0) g += `<rect x="${(colW * i).toFixed(1)}" y="40" width="1" height="92" fill="${c.line}"/>`;
    g += `<text x="${x.toFixed(1)}" y="96" text-anchor="middle" font-family="${SANS}" font-size="52" font-weight="300" letter-spacing="-2" fill="${c.text}">${esc(it.v)}</text>`;
    g += `<text x="${x.toFixed(1)}" y="122" text-anchor="middle" font-family="${MONO}" font-size="11" letter-spacing="2.6" fill="${c.muted}">${esc(it.k.toUpperCase())}</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(items.map((i) => `${i.v} ${i.k}`).join(", "))}">
<rect width="${w}" height="${h}" fill="${c.bg}"/>
<rect x="0" y="0" width="${w}" height="1" fill="${c.line}"/>
<rect x="0" y="${h - 1}" width="${w}" height="1" fill="${c.line}"/>
${g}
</svg>`;
}

function heading(theme, text) {
  const c = THEMES[theme];
  const w = 1280, h = 56;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(text)}">
<rect width="${w}" height="${h}" fill="${c.bg}"/>
<rect x="0" y="34" width="18" height="2" fill="${c.accent}"/>
<text x="30" y="41" font-family="${MONO}" font-size="12.5" letter-spacing="3.4" fill="${c.text}">${esc(text.toUpperCase())}</text>
<rect x="${30 + text.length * 11.2}" y="35" width="${w - 30 - text.length * 11.2}" height="1" fill="${c.line}"/>
</svg>`;
}

function rule(theme) {
  const c = THEMES[theme];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="1" viewBox="0 0 1280 1" role="presentation"><rect width="1280" height="1" fill="${c.line}"/></svg>`;
}

const HERO = {
  eyebrow: "INDEPENDENT SOFTWARE STUDIO",
  sub1: "Security and productivity tools, a code editor, design systems",
  sub2: "and web platforms. No sponsors, no analytics, no tracking.",
  foot: "talkdedsec.com",
};

const METRICS = [
  { v: "274", k: "dev tools" },
  { v: "212", k: "games" },
  { v: "202", k: "components" },
  { v: "26", k: "design systems" },
  { v: "308", k: "references" },
];

const W2 = 636, W3 = 418;

const CARDS = {
  "site-main": { w: W2, h: 176, link: 1, kicker: "studio", title: "talkdedsec.com", lines: ["Tools, games, portfolio, notes and CTF writeups.", "Turkish and English."], meta: "NEXT.JS" },
  "site-code": { w: W2, h: 176, link: 1, kicker: "product", title: "code.talkdedsec.com", lines: ["Talkdedsec Editor. A Windows editor on an open-source", "core, telemetry layer removed at the source."], meta: "TYPESCRIPT · NODE" },
  "site-styles": { w: W2, h: 176, link: 1, kicker: "library", title: "styles.talkdedsec.com", lines: ["Design systems compiled into DESIGN.md, Tailwind v4,", "CSS variables and design tokens."], meta: "TYPESCRIPT · REACT" },
  "site-agents": { w: W2, h: 176, link: 1, kicker: "archive", title: "agents.talkdedsec.com", lines: ["Agent definitions, Claude Code skills, system prompts,", "MCP guides and multi-agent workflows."], meta: "NEXT.JS" },
  "site-projects": { w: W2, h: 176, link: 1, kicker: "portfolio", title: "projects.talkdedsec.com", lines: ["Portfolio in a desktop-OS interface: security tools,", "FiveM scripts, CLI and desktop apps."], meta: "TYPESCRIPT" },
  "site-store": { w: W2, h: 176, link: 1, kicker: "commerce", title: "store.talkdedsec.com", lines: ["FiveM scripts. Server-authoritative, resmon-friendly,", "delivered through Tebex."], meta: "TEBEX HEADLESS" },
  "site-ornek": { w: W2, h: 176, link: 1, kicker: "demos", title: "ornek.talkdedsec.com", lines: ["Live demos of the site templates I sell."], meta: "NEXT.JS" },
  "site-flypen": { w: W2, h: 176, link: 1, kicker: "platform", title: "flypen.com.tr", lines: ["Production platform I build and operate.", "Deploys, monitoring, uptime."], meta: "NEXT.JS · PM2" },

  "cat-tools": { w: W2, h: 200, link: 1, big: "274", kicker: "browser", title: "Developer tools", lines: ["Hashing, base64, JWT, regex, subnet maths, encoding,", "text processing and data formats. Runs entirely in the", "browser — nothing uploaded, nothing logged."], meta: "TALKDEDSEC.COM/TOOLS" },
  "cat-games": { w: W2, h: 200, link: 1, big: "212", kicker: "browser", title: "Games", lines: ["Puzzle, strategy, reflex, memory and word games,", "plus larger terminal and sandbox titles.", "All client-side, no accounts."], meta: "TALKDEDSEC.COM/GAMES" },

  "lib-systems": { w: W3, h: 190, link: 1, big: "26", kicker: "styles", title: "Design systems", lines: ["One TypeScript source,", "four compiled outputs.", "130 themes on top."], meta: "STYLES.TALKDEDSEC.COM" },
  "lib-components": { w: W3, h: 190, link: 1, big: "202", kicker: "styles", title: "Components", lines: ["Production React parts", "with 308 curated design", "references behind them."], meta: "STYLES.TALKDEDSEC.COM" },
  "lib-skills": { w: W3, h: 190, link: 1, big: "54", kicker: "agents", title: "Claude Code skills", lines: ["Tested agent definitions,", "prompts and MCP guides.", "Copy, install, run."], meta: "AGENTS.TALKDEDSEC.COM" },

  "feat-sentinel": { w: W3, h: 224, link: 1, kicker: "security", title: "tlk-sentinel", lines: ["Reads your logs, spots the", "attack, bans the source and", "shows you what happened.", "60 tests, zero runtime deps."], meta: "TYPESCRIPT · NODE · LINUX" },
  "feat-visual": { w: W3, h: 224, link: 1, kicker: "windows", title: "Talkdedsec Visual", lines: ["Whole-screen colour engine", "written to the display gamma", "ramp. One exe, no driver,", "no admin rights."], meta: "RUST · SLINT · WIN32" },
  "feat-wymcmd": { w: W3, h: 224, link: 1, kicker: "forensics", title: "Why My CMD Opened", lines: ["A console flashed and", "vanished. This says what", "started it, hours later,", "with nothing resident."], meta: "C# · .NET 10 · ETW" },

  "pil-desktop": { w: 300, h: 214, kicker: "01", title: "Desktop", lines: ["Windows apps and local", "utilities. Installers,", "updates, no telemetry."], meta: "RUST · C# · TAURI" },
  "pil-web": { w: 300, h: 214, kicker: "02", title: "Web", lines: ["Product sites and", "storefronts. Bilingual,", "server-rendered."], meta: "NEXT.JS · PRISMA" },
  "pil-systems": { w: 300, h: 214, kicker: "03", title: "Systems", lines: ["Licensing, releases and", "deploys. Runs on my", "own servers."], meta: "NODE · LINUX · NGINX" },
  "pil-interactive": { w: 300, h: 214, kicker: "04", title: "Interactive", lines: ["Browser games and", "design systems. Client-", "side, nothing sent out."], meta: "TYPESCRIPT · CANVAS" },
};

const HEADINGS = { "h-featured": "Featured", "h-sites": "Sites", "h-catalogue": "Catalogue", "h-libraries": "Libraries", "h-oss": "Open source", "h-stack": "Stack" };

const dir = join(OUT, DIR);
mkdirSync(dir, { recursive: true });
for (const theme of ["light", "dark"]) {
  writeFileSync(join(dir, `hero-${theme}.svg`), hero(theme, HERO));
  writeFileSync(join(dir, `metrics-${theme}.svg`), metrics(theme, METRICS));
  writeFileSync(join(dir, `rule-${theme}.svg`), rule(theme));
  for (const [name, spec] of Object.entries(CARDS)) writeFileSync(join(dir, `${name}-${theme}.svg`), card(theme, spec));
  for (const [name, text] of Object.entries(HEADINGS)) writeFileSync(join(dir, `${name}-${theme}.svg`), heading(theme, text));
}
console.log("cards built");
