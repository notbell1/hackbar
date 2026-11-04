# XEOO HACKBAR — ARCHITECTURE SPECIFICATION

## 1. High-Level Architectural Overview

XEOO HACKBAR adopts a modular, clean-layer architecture designed for Manifest V3:

```text
┌────────────────────────────────────────────────────────┐
│                   Chrome Browser                       │
│                                                        │
│  ┌────────────────────────┐  ┌──────────────────────┐  │
│  │   Side Panel UI        │  │  Background Worker   │  │
│  │   (React 18 + Zustand) │  │  (Event / Tab / Menu)│  │
│  └───────────┬────────────┘  └──────────┬───────────┘  │
│              │                          │              │
│              ▼                          ▼              │
│  ┌──────────────────────────────────────────────────┐  │
│  │          Core Layer (HTTP / Parser / Encoders)   │  │
│  └──────────────────────────┬───────────────────────┘  │
│                             │                          │
│                             ▼                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │   Data Layer (IndexedDB / Dexie & chrome.storage)│  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

## 2. Layer Responsibilities

### Presentation Layer (`src/sidepanel/`)
- **Components**: Reusable UI blocks including `Header`, `TargetBar`, and `StatusBadge`.
- **Pages**: Modular workspace views (`RequestBuilder`, `UrlParserPage`, `EncoderPage`, `SecurityHeadersPage`, `PayloadLibraryPage`, `HistoryPage`, `ScopeManagerPage`, `SettingsPage`).
- **Store**: Zustand state management coordinating URL input, active request state, and tab selection.

### Core Layer (`src/core/`)
- **HTTP Client**: Wraps native `fetch` with `AbortController` timeouts, stream size limiting, and scope validation.
- **URL Engine**: Pure URL and Query parameter parsing, manipulation, and safe re-assembly.
- **Encoding Engine**: Lossless UTF-8 multi-format conversion suite.
- **Security Analyzer**: Passive response inspection evaluating defensive headers (`CSP`, `HSTS`, `X-Frame-Options`, etc.).

### Data Layer (`src/storage/`)
- **Dexie Database (`XeooHackbarDB`)**: High-performance local IndexedDB managing `scopes`, `history`, and `payloads`.
- **Repository Pattern**: Encapsulates data persistence (`ScopeRepository`, `HistoryRepository`, `PayloadRepository`, `SettingsRepository`) with sanitization and redaction rules.

### Background Service Worker (`src/background/`)
- Handles side panel open triggers via `chrome.sidePanel.setPanelBehavior`.
- Manages Context Menu events (*"Open URL in XEOO HACKBAR"*).
- Mediates permission inquiries via `chrome.permissions`.

