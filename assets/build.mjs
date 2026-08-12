import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = dirname(fileURLToPath(import.meta.url));

const THEMES = {
  light: {
    bg: "#FFFFFF",
    panel: "#FAFAFA",
    text: "#0A0A0A",
    muted: "#6E6E6E",
    faint: "#9B9B9B",
    hair: "#E6E6E6",
    accent: "#D62839",
    dot: "#C9C9C9",
  },
  dark: {
    bg: "#0A0A0A",
    panel: "#0F0F0F",
    text: "#F4F4F4",
    muted: "#8C8C8C",
    faint: "#5E5E5E",
    hair: "#1E1E1E",
    accent: "#FF3B52",
    dot: "#3A3A3A",
  },
};

const SANS = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function eyeGrid(cx, cy, c) {
  const cols = 34;
  const rows = 20;
  const gap = 9.5;
  const rx = (cols * gap) / 2;
  const ry = (rows * gap) / 2;
  let out = "";
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let q = 0; q < cols; q++) {
      const x = cx - rx + q * gap + gap / 2;
      const y = cy - ry + r * gap + gap / 2;
      const nx = (x - cx) / rx;
      const ny = (y - cy) / ry;
      const lens = nx * nx + ny * ny;
      if (lens > 1) continue;
      const irisD = Math.hypot((x - cx) / 46, (y - cy) / 46);
      const inIris = irisD < 1;
      const inPupil = irisD < 0.42;
      if (inPupil) continue;
      const fade = 1 - lens;
      const size = inIris ? 2.5 : 1.15 + fade * 1.5;
      const op = (inIris ? 0.85 : 0.16 + fade * 0.5).toFixed(2);
      const fill = inIris ? c.accent : c.dot;
      const delay = ((x - cx + rx) / (rx * 2)) * 2.6;
      out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${size.toFixed(2)}" fill="${fill}" opacity="${op}" style="animation:scan 5.2s ${delay.toFixed(2)}s ease-in-out infinite"/>`;
      i++;
    }
  }
  return out;
}

function hero(t, s) {
  const c = THEMES[t];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="400" viewBox="0 0 1280 400" role="img" aria-label="Talkdedsec — independent software studio">
<style>
  @keyframes draw { 0% { transform: translateX(-140px); opacity: 0 } 25% { opacity: 1 } 100% { transform: translateX(520px); opacity: 0 } }
  @keyframes rise { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
  @keyframes scan { 0%,100% { opacity: .18 } 45% { opacity: .95 } }
  @keyframes blink { 0%,46% { opacity: 1 } 47%,100% { opacity: 0 } }
  .r { animation: rise .9s cubic-bezier(.22,1,.36,1) }
  .d1 { animation-delay: .05s } .d2 { animation-delay: .18s } .d3 { animation-delay: .32s } .d4 { animation-delay: .46s }
  .bar { animation: draw 3.6s 1s ease-in-out infinite }
</style>
<rect width="1280" height="400" fill="${c.bg}"/>
<g opacity=".9">${eyeGrid(1010, 200, c)}</g>
<rect x="0" y="0" width="1280" height="1" fill="${c.hair}"/>
<rect x="0" y="399" width="1280" height="1" fill="${c.hair}"/>
<g class="r d1"><text x="96" y="120" font-family="${MONO}" font-size="12.5" letter-spacing="4.2" fill="${c.accent}">${esc(s.eyebrow)}</text></g>
<g class="r d2"><text x="93" y="216" font-family="${SANS}" font-size="90" font-weight="300" letter-spacing="-3.4" fill="${c.text}">Talkdedsec</text></g>
<rect x="96" y="240" width="520" height="2" fill="${c.accent}"/>
<clipPath id="barclip"><rect x="96" y="238" width="520" height="6"/></clipPath>
<g clip-path="url(#barclip)"><rect class="bar" x="96" y="238" width="140" height="6" fill="${c.text}" opacity=".55"/></g>
<g class="r d3"><text x="96" y="292" font-family="${SANS}" font-size="21" font-weight="400" fill="${c.muted}">${esc(s.sub1)}</text></g>
<g class="r d3"><text x="96" y="322" font-family="${SANS}" font-size="21" font-weight="400" fill="${c.muted}">${esc(s.sub2)}</text></g>
<g class="r d4">
  <text x="96" y="366" font-family="${MONO}" font-size="12.5" letter-spacing="1.6" fill="${c.faint}">talkdedsec.com</text>
  <text x="252" y="366" font-family="${MONO}" font-size="12.5" letter-spacing="1.6" fill="${c.faint}">·</text>
  <text x="272" y="366" font-family="${MONO}" font-size="12.5" letter-spacing="1.6" fill="${c.faint}">code.talkdedsec.com</text>
  <text x="462" y="366" font-family="${MONO}" font-size="12.5" letter-spacing="1.6" fill="${c.faint}">·</text>
  <text x="482" y="366" font-family="${MONO}" font-size="12.5" letter-spacing="1.6" fill="${c.faint}">styles.talkdedsec.com</text>
  <rect x="682" y="356" width="8" height="13" fill="${c.accent}" style="animation:blink 1.15s step-end infinite"/>
</g>
</svg>`;
}

function metrics(t, items) {
  const c = THEMES[t];
  const w = 1280;
  const colW = w / items.length;
  let g = "";
  items.forEach((it, i) => {
    const x = colW * i + colW / 2;
    if (i > 0) g += `<rect x="${(colW * i).toFixed(1)}" y="34" width="1" height="88" fill="${c.hair}"/>`;
    g += `<text x="${x.toFixed(1)}" y="86" text-anchor="middle" font-family="${SANS}" font-size="46" font-weight="300" letter-spacing="-1.6" fill="${c.text}">${esc(it.v)}</text>`;
    g += `<text x="${x.toFixed(1)}" y="112" text-anchor="middle" font-family="${MONO}" font-size="11.5" letter-spacing="2.6" fill="${c.muted}">${esc(it.k.toUpperCase())}</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="156" viewBox="0 0 ${w} 156" role="img" aria-label="${esc(items.map((i) => `${i.v} ${i.k}`).join(", "))}">
<rect width="${w}" height="156" fill="${c.bg}"/>
<rect x="0" y="0" width="${w}" height="1" fill="${c.hair}"/>
<rect x="0" y="155" width="${w}" height="1" fill="${c.hair}"/>
${g}
</svg>`;
}

function pillars(t, items) {
  const c = THEMES[t];
  const w = 1280;
  const colW = w / items.length;
  let g = "";
  items.forEach((it, i) => {
    const x = colW * i + 40;
    if (i > 0) g += `<rect x="${(colW * i).toFixed(1)}" y="28" width="1" height="200" fill="${c.hair}"/>`;
    g += `<text x="${x}" y="64" font-family="${MONO}" font-size="11.5" letter-spacing="2.4" fill="${c.accent}">${String(i + 1).padStart(2, "0")}</text>`;
    g += `<text x="${x}" y="108" font-family="${SANS}" font-size="25" font-weight="400" letter-spacing="-.4" fill="${c.text}">${esc(it.t)}</text>`;
    it.lines.forEach((ln, j) => {
      g += `<text x="${x}" y="${146 + j * 25}" font-family="${SANS}" font-size="15" fill="${c.muted}">${esc(ln)}</text>`;
    });
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="256" viewBox="0 0 ${w} 256" role="img" aria-label="${esc(items.map((i) => i.t).join(", "))}">
<rect width="${w}" height="256" fill="${c.bg}"/>
<rect x="0" y="0" width="${w}" height="1" fill="${c.hair}"/>
<rect x="0" y="255" width="${w}" height="1" fill="${c.hair}"/>
${g}
</svg>`;
}

function rule() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="1" viewBox="0 0 1280 1" role="presentation"><rect width="1280" height="1" fill="#808080" opacity=".22"/></svg>`;
}

const L = {
  en: {
    suffix: "",
    eyebrow: "INDEPENDENT SOFTWARE STUDIO",
    sub1: "Security and productivity tools, desktop apps, web platforms.",
    sub2: "No sponsors. No telemetry. No tracking.",
    metrics: [
      { v: "274", k: "developer tools" },
      { v: "212", k: "browser games" },
      { v: "202", k: "ui components" },
      { v: "26", k: "design systems" },
      { v: "308", k: "design references" },
    ],
    pillars: [
      { t: "Desktop", lines: ["Windows apps and local utilities.", "Installers, updates, no telemetry.", "Rust · C# · Tauri · WPF"] },
      { t: "Web", lines: ["Product sites and storefronts.", "Bilingual, server-rendered.", "Next.js · Prisma · PostgreSQL"] },
      { t: "Systems", lines: ["Licensing, releases, deploys.", "Runs on my own servers.", "Node · Linux · nginx · PM2"] },
      { t: "Interactive", lines: ["Browser games and design systems.", "Client-side, nothing sent out.", "TypeScript · Canvas · WebGL"] },
    ],
  },
  tr: {
    suffix: "-tr",
    eyebrow: "BAĞIMSIZ YAZILIM STÜDYOSU",
    sub1: "Güvenlik ve üretkenlik araçları, masaüstü uygulamaları, web platformları.",
    sub2: "Sponsor yok. Telemetri yok. Takip yok.",
    metrics: [
      { v: "274", k: "geliştirici aracı" },
      { v: "212", k: "tarayıcı oyunu" },
      { v: "202", k: "arayüz bileşeni" },
      { v: "26", k: "tasarım sistemi" },
      { v: "308", k: "tasarım referansı" },
    ],
    pillars: [
      { t: "Masaüstü", lines: ["Windows uygulamaları, yerel araçlar.", "Kurulum, güncelleme, telemetri yok.", "Rust · C# · Tauri · WPF"] },
      { t: "Web", lines: ["Ürün siteleri ve mağazalar.", "İki dilli, sunucuda render.", "Next.js · Prisma · PostgreSQL"] },
      { t: "Sistem", lines: ["Lisans, sürüm, dağıtım.", "Kendi sunucularımda çalışır.", "Node · Linux · nginx · PM2"] },
      { t: "Etkileşim", lines: ["Tarayıcı oyunları, tasarım sistemleri.", "İstemci tarafı, veri dışarı gitmez.", "TypeScript · Canvas · WebGL"] },
    ],
  },
};

for (const s of Object.values(L)) {
  for (const t of ["light", "dark"]) {
    writeFileSync(join(OUT, `hero${s.suffix}-${t}.svg`), hero(t, s));
    writeFileSync(join(OUT, `metrics${s.suffix}-${t}.svg`), metrics(t, s.metrics));
    writeFileSync(join(OUT, `pillars${s.suffix}-${t}.svg`), pillars(t, s.pillars));
  }
}
writeFileSync(join(OUT, "rule.svg"), rule());
console.log("assets built");
