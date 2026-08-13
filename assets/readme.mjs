import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = "v1";

const L = {
  en: {
    file: "README.md",
    other: ["README.tr.md", "Türkçe"],
    nav: [
      ["Site", "https://talkdedsec.com/en"],
      ["Editor", "https://code.talkdedsec.com"],
      ["Styles", "https://styles.talkdedsec.com/en"],
      ["Agents", "https://agents.talkdedsec.com"],
      ["Tools", "https://talkdedsec.com/tools"],
      ["Games", "https://talkdedsec.com/games"],
      ["Writeups", "https://talkdedsec.com/writeups"],
      ["Projects", "PROJECTS.md"],
    ],
    intro: [
      "I run a small studio. Everything here is my own work: a Windows code editor, a design-system library, a catalogue of browser tools and games, an archive of AI agent definitions, a FiveM script store, and the licensing and deployment layer that keeps them running.",
      "Most of it ships as a product, not a demo. That means installers, update channels, licence checks and a support inbox. Nothing collects telemetry and nothing is funded by a sponsor.",
    ],
    ossFallback: "Nothing public yet. Repositories are opened one at a time.",
    index: "Full project index →",
    contact: [
      ["talkdedsec@proton.me", "mailto:talkdedsec@proton.me"],
      ["Contact", "https://talkdedsec.com/contact"],
      ["Editor releases", "https://github.com/talkdedseccode"],
      ["Blog", "https://talkdedsec.com/blog"],
      ["Writeups", "https://talkdedsec.com/writeups"],
    ],
  },
  tr: {
    file: "README.tr.md",
    other: ["README.md", "English"],
    nav: [
      ["Site", "https://talkdedsec.com"],
      ["Editör", "https://code.talkdedsec.com"],
      ["Styles", "https://styles.talkdedsec.com"],
      ["Agents", "https://agents.talkdedsec.com"],
      ["Araçlar", "https://talkdedsec.com/tools"],
      ["Oyunlar", "https://talkdedsec.com/games"],
      ["Writeup", "https://talkdedsec.com/writeups"],
      ["Projeler", "PROJECTS.md"],
    ],
    intro: [
      "Küçük bir stüdyo işletiyorum. Buradaki her şey kendi işim: bir Windows kod editörü, bir tasarım sistemi kütüphanesi, tarayıcıda çalışan araç ve oyun kataloğu, bir AI ajan tanımları arşivi, bir FiveM script mağazası ve bunları ayakta tutan lisans ile dağıtım katmanı.",
      "Çoğu demo olarak değil ürün olarak çıkıyor. Yani kurulum paketi, güncelleme kanalı, lisans kontrolü ve destek kutusu var. Hiçbiri telemetri toplamıyor, hiçbirinin arkasında sponsor yok.",
    ],
    ossFallback: "Henüz public depo yok. Depolar tek tek açılıyor.",
    index: "Tüm proje dizini →",
    contact: [
      ["talkdedsec@proton.me", "mailto:talkdedsec@proton.me"],
      ["İletişim", "https://talkdedsec.com/contact"],
      ["Editör sürümleri", "https://github.com/talkdedseccode"],
      ["Blog", "https://talkdedsec.com/blog"],
      ["Writeup", "https://talkdedsec.com/writeups"],
    ],
  },
};

const SITES = [
  ["site-main", "https://talkdedsec.com/en"],
  ["site-code", "https://code.talkdedsec.com"],
  ["site-styles", "https://styles.talkdedsec.com/en"],
  ["site-agents", "https://agents.talkdedsec.com"],
  ["site-projects", "https://projects.talkdedsec.com"],
  ["site-store", "https://store.talkdedsec.com"],
  ["site-ornek", "https://ornek.talkdedsec.com"],
  ["site-flypen", "https://flypen.com.tr"],
];
const CATALOGUE = [
  ["cat-tools", "https://talkdedsec.com/tools"],
  ["cat-games", "https://talkdedsec.com/games"],
];
const LIBRARIES = [
  ["lib-systems", "https://styles.talkdedsec.com/en"],
  ["lib-components", "https://styles.talkdedsec.com/en"],
  ["lib-skills", "https://agents.talkdedsec.com"],
];
const PILLARS = ["pil-desktop", "pil-web", "pil-systems", "pil-interactive"];

const STACK = [
  ["TypeScript", "JavaScript", "Rust", "C#", "Go", "Python", "Lua", "PowerShell", "SQL"],
  ["Next.js", "React", "Node.js", "Tauri", "Prisma", "PostgreSQL", "Redis"],
  ["Linux", "nginx", "PM2", "systemd", "GitHub Actions", "Playwright", "Sentry", "Tebex"],
];

function pic(name, width, href) {
  const img = `<picture><source media="(prefers-color-scheme: dark)" srcset="assets/${DIR}/${name}-dark.svg"><img width="${width}" src="assets/${DIR}/${name}-light.svg" alt=""></picture>`;
  return href ? `<a href="${href}">${img}</a>` : img;
}

const grid = (items, width) =>
  `<p align="center">\n${items.map((i) => "  " + (Array.isArray(i) ? pic(i[0], width, i[1]) : pic(i, width))).join("\n")}\n</p>`;

function build(lang) {
  const t = L[lang];
  const full = (n) => pic(n, "100%");

  return `${full("hero")}

<p align="center">
${t.nav.map(([n, h]) => `  <a href="${h}">${n}</a>`).join("\n  &nbsp;·&nbsp;\n")}
  &nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="${t.other[0]}"><b>${t.other[1]}</b></a>
</p>

${full("rule")}

<img align="left" width="190" src="assets/logo.png" alt="Talkdedsec">

${t.intro.join("\n\n")}

<br clear="left">

${grid(PILLARS, "24.3%")}

${full("metrics")}

${full("h-sites")}

${grid(SITES, "49%")}

${full("h-catalogue")}

${grid(CATALOGUE, "49%")}

${full("h-libraries")}

${grid(LIBRARIES, "32.3%")}

${full("h-oss")}

<!-- OSS:START -->
${t.ossFallback}
<!-- OSS:END -->

<p align="right"><a href="PROJECTS.md"><b>${t.index}</b></a></p>

${full("h-stack")}

<p align="center">
${STACK.map((row) => "  " + row.map((x) => `<code>${x}</code>`).join(" ")).join("<br>\n")}
</p>

${full("rule")}

<p align="center">
${t.contact.map(([n, h]) => `  <a href="${h}">${n}</a>`).join("\n  &nbsp;·&nbsp;\n")}
</p>

<p align="center">
  <img src="assets/logo.png" width="120" alt="">
</p>
`;
}

for (const lang of Object.keys(L)) writeFileSync(join(ROOT, L[lang].file), build(lang));
console.log("readmes built");
