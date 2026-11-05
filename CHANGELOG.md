# Changelog

All notable changes to the **ZX HACKBAR** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-11-06

### Changed
- **Rebranding to ZX HACKBAR**: Updated project branding from XEOO HACKBAR to **ZX HACKBAR** across UI components, manifest, package metadata, and documentation.
- **Author Watermarks**: Updated DIOS signature watermarks to `ZXMarchia - ZX Hackbar` with corresponding hex encodings.
- **Repository Integration**: Configured official upstream community repository (`https://github.com/Zone-Xploiter/hackbar`) and personal fork (`https://github.com/notbell1/hackbar`).

---

## [1.0.0] - 2026-11-05

### Added

#### Template Builder & DIOS Engine
- **Full DIOS Template Expansion**: Replaced all empty slots (`SOON !!`) with over 170+ syntactically validated templates across Union-Based and WAF-Based categories (MySQL, PostgreSQL, Microsoft SQL Server).
- **Author Watermark & Custom Signature Generator** (`dios-generator.ts`, `DiosSignatureModal.tsx`):
  - Dynamic generator producing hex-encoded (`0x...`) watermarks directly injected into MySQL DIOS payloads.
  - Multi-theme color presets: Neon Green Glow (`#A3FF70`), Neon Red Fire (`#FF3344`), Cyber Cyan (`#00FFFF`), Electric Gold (`#FFE600`), ASCII Frame, and Plain.
  - Interactive modal launched upon selecting DIOS templates in Builder.
  - Default author identity set to `ZXMarchia`.
- **Advanced Security Modules**:
  - `sql-basic`: 37 templates across 6 subcategories (Auth bypass, Boolean blind, Time blind, Stacked queries, SQL clauses, Comments).
  - `other`: 40 templates across 8 subcategories (RCE, SSTI, XXE, SSRF, CRLF, Open Redirect, Headers, Misc).
  - `html`: 23 templates across 6 subcategories (Defacement, CSRF PoCs, Clickjacking, SVG markup, Forms, Containers).
  - `links`: 26 quick-access resources across 5 subcategories (Vulnerability DBs, Payload repositories, Crypto tools, OSINT, URI schemes).

#### User Interface & Ergonomics
- **Responsive Quick Conversion Bar** (`QuickConversionBar.tsx`):
  - Implemented `ResizeObserver` for real-time dynamic button layout.
  - Automatically wraps into 2 balanced rows (4 columns each) on medium/narrow viewports (< 780px) and 4 rows on very narrow panels (< 390px).
  - Added retro 3D metallic bevel styling with dynamic glow corresponding to Active Tab Sync state (`#A3FF70` green when synced, `#EF4444` red when unsynced).
- **Payload Library Navigation** (`PayloadLibraryPage.tsx`):
  - Added horizontal scroll buttons (`<` and `>`), mouse wheel horizontal scrolling (`onWheel`), and slim 4px custom scrollbar for category pills.
  - Seeded 31 standard real-world pentest vectors with JSON export and import capabilities.
  - Renamed top navigation label from `Tests` to `Payloads` for clarity.

#### Automated Quality & Audit Testing
- **DIOS Static Syntax Audit Suite** (`tests/unit/dios-audit.test.ts`):
  - Automated verification of parenthesis balance (`(` vs `)`), delimiter closure (`/*` vs `*/`), hex literal validity, template uniqueness, and cleanliness across 170+ payloads.
- Expanded Vitest test suite to **69 passing unit tests** across 6 test suites.

### Fixed
- **Comment Delimiter Syntax Fixes**:
  - `waf-local-dios-concat-ws`: Fixed unclosed MySQL version comment delimiter typo `/*!50000GROUP_CONCAT*(` to `/*!50000GROUP_CONCAT*/(`.
  - `waf-dios-inline-comment-exclamation`: Fixed missing asterisk in delimiter `/*!/` to `/*!*/`.
  - `waf-dios-inline-plus-dash-comment`: Fixed unclosed delimiter token `/**!` to valid paired inline comments `/**/`.
  - `waf-dios-postgre-pg-catalog-class`: Fixed non-standard comment tokens into legal PostgreSQL ANSI C-style comments `(SELECT/**/string_agg(...)/**/FROM/**/pg_class...)`.
  - `waf-dios-mssql-sys-tables-catalog`: Fixed comment delimiters into legal Microsoft SQL Server syntax `(SELECT/**/t.name+.../**/FOR/**/XML/**/PATH(''))`.
  - `waf-dios-enhanched`: Resolved nested comment termination collision in MySQL lexer by restructuring sequential comments `/*!50000concat*//**ZxMarchia**/`.
- **UI Overflow Fixes**: Resolved horizontal clipping and layout breakage on narrow side panel screens.

### Security
- Maintained local-only execution boundaries with Dexie IndexedDB encryption and local origin restrictions.
- Sensitive credential masking (`Authorization`, `Cookie`, `Set-Cookie`, `API keys`) enabled by default on all logged evidence.
