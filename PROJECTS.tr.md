<picture><source media="(prefers-color-scheme: dark)" srcset="assets/v1/rule-dark.svg"><img width="100%" src="assets/v1/rule-light.svg" alt=""></picture>

# Projeler

Talkdedsec adı altında şu an yayında olan her şey. Herkese açık olmayan işler burada listelenmiyor.

[← Profil](README.tr.md) &nbsp;·&nbsp; [English](PROJECTS.md)

<picture><source media="(prefers-color-scheme: dark)" srcset="assets/v1/rule-dark.svg"><img width="100%" src="assets/v1/rule-light.svg" alt=""></picture>

## Siteler

| Site | Nedir | Teknoloji |
|:--|:--|:--|
| [talkdedsec.com](https://talkdedsec.com) | Stüdyo sitesi: araçlar, oyunlar, portfolyo, blog, writeup. İki dilli. | Next.js |
| [code.talkdedsec.com](https://code.talkdedsec.com) | Talkdedsec Editör: indirmeler, temalar ve dokümantasyon. | Next.js |
| [styles.talkdedsec.com](https://styles.talkdedsec.com) | Tasarım sistemleri, bileşenler, temalar ve referanslar. | Next.js / TypeScript |
| [agents.talkdedsec.com](https://agents.talkdedsec.com) | Ajan tanımları, Claude Code skill'leri, promptlar ve MCP rehberleri. | Next.js |
| [projects.talkdedsec.com](https://projects.talkdedsec.com) | Masaüstü-OS arayüzünde portfolyo. | TypeScript |
| [store.talkdedsec.com](https://store.talkdedsec.com) | Tebex Headless üzerinde FiveM script mağazası. | Next.js |
| [ornek.talkdedsec.com](https://ornek.talkdedsec.com) | Sattığım site şablonlarının demoları. | Next.js |
| [flypen.com.tr](https://flypen.com.tr) | Kurup işlettiğim üretim platformu. | Next.js / PM2 |

<picture><source media="(prefers-color-scheme: dark)" srcset="assets/v1/rule-dark.svg"><img width="100%" src="assets/v1/rule-light.svg" alt=""></picture>

## Katalog

| | Adet | Nerede |
|:--|--:|:--|
| Geliştirici araçları | 274 | [talkdedsec.com/tools](https://talkdedsec.com/tools) |
| Oyunlar | 212 | [talkdedsec.com/games](https://talkdedsec.com/games) |
| UI bileşenleri | 202 | [styles.talkdedsec.com](https://styles.talkdedsec.com) |
| Temalar | 130 | [styles.talkdedsec.com](https://styles.talkdedsec.com) |
| Tasarım sistemleri | 26 | [styles.talkdedsec.com](https://styles.talkdedsec.com) |
| Tasarım referansları | 308 | [styles.talkdedsec.com](https://styles.talkdedsec.com) |
| Claude Code skill'leri | 54 | [agents.talkdedsec.com](https://agents.talkdedsec.com) |

<picture><source media="(prefers-color-scheme: dark)" srcset="assets/v1/rule-dark.svg"><img width="100%" src="assets/v1/rule-light.svg" alt=""></picture>

## Açık kaynak

Dört depo, tek tek açılıyor. Bu tablo her gün GitHub API'sinden yeniden üretiliyor.

<!-- OSS:START -->
| Depo | Nedir | Teknoloji | Güncelleme |
|:--|:--|:--|:--|
| **[scoop-tlk](https://github.com/Talkdedsec/scoop-tlk)** | Scoop bucket for the Talkdedsec Windows tools - wymcmd and tlk-visual. | `package-manager` `scoop` | 31 Ağu 2026 |
| **[tlk-wymcmd](https://github.com/Talkdedsec/tlk-wymcmd)** | O konsol penceresini neyin açtığını buluyor — zamanlanmış görev, servis, kayıt defteri anahtarı ya da tıklama — kapandıktan saatler sonra. | `C#` `.NET 10` `ETW` | 31 Ağu 2026 |
| **[tlk-visual](https://github.com/Talkdedsec/tlk-visual)** · 2 ★ | Windows için ekranın tamamını kapsayan renk motoru; doğrudan ekranın gama tablosuna yazıyor. Tek exe, sürücü yok, yönetici hakkı yok. | `Rust` `Slint` `Win32` | 31 Ağu 2026 |
| **[tlk-pass](https://github.com/Talkdedsec/tlk-pass)** | Web Crypto ile çalışan çevrimdışı şifre üreteci. Tek HTML dosyası, sıfır bağımlılık, sıfır ağ isteği. | `HTML` `JavaScript` | 31 Ağu 2026 |
| **[tlk-sentinel](https://github.com/Talkdedsec/tlk-sentinel)** | Sunucu ve uygulama güvenlik motoru: loglardan saldırı tespiti, IP banlama, itibar ve anomali skoru, canlı panel. | `TypeScript` `Node` `SQLite` | 31 Ağu 2026 |

<sub>02 Eyl 2026 tarihinde eşitlendi · yalnızca açık depolar</sub>
<!-- OSS:END -->

Hepsinde İngilizce ve Türkçe README, bir güvenlik politikası ve CI var. `tlk-sentinel` açık kaynak
değil kaynak-erişilebilir — çalıştırabilir ve kendi kullanımın için değiştirebilirsin ama satamaz ve
yeniden dağıtamazsın; diğerleri MIT ya da GPL-3.0.

<picture><source media="(prefers-color-scheme: dark)" srcset="assets/v1/rule-dark.svg"><img width="100%" src="assets/v1/rule-light.svg" alt=""></picture>

## Ürünler

**Talkdedsec Editör** — açık kaynaklı bir çekirdek üzerine kurulu, telemetri katmanı kaynağından
sökülmüş bir Windows kod editörü. Kendi sürüm kanalı, temaları, dokümantasyonu ve destek akışı var.
Sürümler [talkdedseccode](https://github.com/talkdedseccode) hesabında; indirmeler ve dokümanlar
[code.talkdedsec.com](https://code.talkdedsec.com) adresinde.

**FiveM scriptleri** — server-authoritative, resmon dostu, Türkçe ve İngilizce dilli kaynaklar;
[store.talkdedsec.com](https://store.talkdedsec.com) üzerinden satılıyor.

**Site şablonları** — üretim kalitesinde Next.js şablonları, canlı demoları
[ornek.talkdedsec.com](https://ornek.talkdedsec.com) adresinde.

<picture><source media="(prefers-color-scheme: dark)" srcset="assets/v1/rule-dark.svg"><img width="100%" src="assets/v1/rule-light.svg" alt=""></picture>

<p align="center">
  <sub>Müşteri işleri ve yayınlanmamış yazılımlar özel kalıyor.<br>
  Açık depolar <a href="README.tr.md">profilde</a> listeleniyor ve her gün yenileniyor.</sub>
</p>
