<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/hero-tr-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/hero-tr-light.svg">
  <img src="assets/hero-tr-light.svg" width="100%" alt="Talkdedsec — bağımsız yazılım stüdyosu">
</picture>

<p align="center">
  <a href="https://talkdedsec.com">Site</a>
  &nbsp;·&nbsp;
  <a href="https://code.talkdedsec.com">Editör</a>
  &nbsp;·&nbsp;
  <a href="https://styles.talkdedsec.com">Styles</a>
  &nbsp;·&nbsp;
  <a href="https://agents.talkdedsec.com">Agents</a>
  &nbsp;·&nbsp;
  <a href="https://talkdedsec.com/tools">Araçlar</a>
  &nbsp;·&nbsp;
  <a href="https://talkdedsec.com/games">Oyunlar</a>
  &nbsp;·&nbsp;
  <a href="https://talkdedsec.com/writeups">Writeup</a>
  &nbsp;·&nbsp;
  <a href="PROJECTS.md">Projeler</a>
  &nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="README.md"><b>English</b></a>
</p>

<img src="assets/rule.svg" width="100%" alt="">

<table>
<tr>
<td width="30%" align="center" valign="middle">
  <img src="assets/logo.png" width="230" alt="Talkdedsec">
</td>
<td width="70%" valign="middle">

### Talkdedsec

Küçük bir stüdyo işletiyorum. Bu hesaptaki her şey kendi işim: bir Windows kod editörü, bir tasarım sistemi kütüphanesi, tarayıcıda çalışan araç ve oyun kataloğu, bir AI ajan arşivi, bir FiveM script mağazası ve bunları ayakta tutan lisans ile dağıtım katmanı.

Çoğu demo olarak değil ürün olarak çıkıyor. Yani kurulum paketi, güncelleme kanalı, lisans kontrolü ve destek kutusu var. Hiçbiri telemetri toplamıyor, hiçbirinin arkasında sponsor yok.

</td>
</tr>
</table>

<img src="assets/rule.svg" width="100%" alt="">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/pillars-tr-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/pillars-tr-light.svg">
  <img src="assets/pillars-tr-light.svg" width="100%" alt="Masaüstü, Web, Sistem, Etkileşim">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/metrics-tr-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/metrics-tr-light.svg">
  <img src="assets/metrics-tr-light.svg" width="100%" alt="274 geliştirici aracı, 212 tarayıcı oyunu, 202 arayüz bileşeni, 26 tasarım sistemi, 308 tasarım referansı">
</picture>

<img src="assets/rule.svg" width="100%" alt="">

## Siteler

| | Nedir |
|:--|:--|
| **[talkdedsec.com](https://talkdedsec.com)** | Stüdyo sitesi. Araçlar, oyunlar, portföy, notlar ve CTF writeup'ları. Türkçe ve İngilizce. |
| **[code.talkdedsec.com](https://code.talkdedsec.com)** | Talkdedsec Editör. Açık kaynak bir çekirdek üzerine kurulu, telemetri katmanı kaynaktan sökülmüş Windows editörü. |
| **[styles.talkdedsec.com](https://styles.talkdedsec.com)** | Tek bir TypeScript kaynağından DESIGN.md, Tailwind v4, CSS değişkeni ve design token'a derlenen 26 tasarım sistemi. 202 bileşen, 130 tema, 308 referans. |
| **[agents.talkdedsec.com](https://agents.talkdedsec.com)** | AI ajan tanımları, 54 Claude Code skill'i, sistem promptları, MCP sunucu rehberleri ve çok-ajanlı workflow şablonları. |
| **[projects.talkdedsec.com](https://projects.talkdedsec.com)** | Masaüstü işletim sistemi arayüzünde portföy: güvenlik araçları, FiveM scriptleri, CLI ve masaüstü uygulamaları. |
| **[store.talkdedsec.com](https://store.talkdedsec.com)** | FiveM scriptleri. Server-authoritative, resmon dostu, Tebex üzerinden anında teslim. |
| **[ornek.talkdedsec.com](https://ornek.talkdedsec.com)** | Sattığım site şablonlarının canlı demoları. |
| **[flypen.com.tr](https://flypen.com.tr)** | Geliştirip işlettiğim üretim platformu. |

<img src="assets/rule.svg" width="100%" alt="">

## Tarayıcı kataloğu

<table>
<tr>
<td width="50%" valign="top">

### [274 geliştirici aracı](https://talkdedsec.com/tools)

Hash, base64, JWT, regex, subnet hesabı, kodlama, metin işleme, veri biçimleri. Hepsi tarayıcıda çalışır. Hiçbir veri sunucuya gitmez, hiçbir şey loglanmaz.

</td>
<td width="50%" valign="top">

### [212 oyun](https://talkdedsec.com/games)

Bulmaca, strateji, refleks, hafıza ve kelime oyunları; ayrıca daha büyük terminal ve sandbox yapımları. Tamamı istemci tarafında, hesap gerekmez.

</td>
</tr>
</table>

<img src="assets/rule.svg" width="100%" alt="">

## Masaüstü uygulamaları

| | Açıklama | Teknoloji |
|:--|:--|:--|
| **Talkdedsec Editör** | Windows kod editörü. Kendi sürüm kanalı, temaları, dokümanı ve destek akışı var. | TypeScript / Node |
| **Talkdedsec Visual** | Windows için gerçek zamanlı ekran renk motoru. 5×5 renk matrisi üzerinden parlaklık, kontrast, doygunluk, ton ve gece görüşü. Çalışma zamanı bağımlılığı yok. | Rust / Slint |
| **TLK Player** | Yedi temalı yerel müzik widget'ı, bire bir ses zinciri. | Rust / Tauri |
| **Talkdedsec Browser** | Windows tarayıcısı; WebView2 ve Chromium (CEF) olmak üzere iki sürüm. | C# / WPF |
| **DedSec Control Center** | Lisans modeli olan Windows tweak ve temizlik paketi. | C# / .NET |
| **TLK Cleaner** | Disk, önbellek ve artık dosya temizliği. | C# |

<img src="assets/rule.svg" width="100%" alt="">

## Açık kaynak

<!-- OSS:START -->
Henüz public depo yok. Depolar tek tek açılıyor.

<sub>13 Ağu 2026 tarihinde eşitlendi · yalnızca açık depolar</sub>
<!-- OSS:END -->

<p align="right"><a href="PROJECTS.md"><b>Tüm proje dizini →</b></a></p>

<img src="assets/rule.svg" width="100%" alt="">

## Teknoloji

| | |
|:--|:--|
| **Diller** | TypeScript · JavaScript · Rust · C# · Go · Python · Lua · PowerShell · SQL |
| **Uygulama** | Next.js · React · Node.js · Tauri · WPF · WebView2 · Slint |
| **Veri ve platform** | PostgreSQL · Prisma · Redis · Linux · nginx · PM2 · systemd |
| **Teslimat** | GitHub Actions · Playwright · Sentry · Tebex · lisans sunucusu · otomatik güncelleme |

<img src="assets/rule.svg" width="100%" alt="">

## İletişim

| | |
|:--|:--|
| E-posta | [talkdedsec@proton.me](mailto:talkdedsec@proton.me) |
| İletişim sayfası | [talkdedsec.com/contact](https://talkdedsec.com/contact) |
| Editör sürümleri | [github.com/talkdedseccode](https://github.com/talkdedseccode) |
| Notlar ve writeup | [talkdedsec.com/blog](https://talkdedsec.com/blog) · [talkdedsec.com/writeups](https://talkdedsec.com/writeups) |

<br>

<p align="center">
  <img src="assets/logo.png" width="130" alt="">
</p>

<p align="center">
  <sub>Talkdedsec adıyla yayınlanan işlerin ana hesabı.</sub>
</p>
