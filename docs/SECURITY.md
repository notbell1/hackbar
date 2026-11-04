# Security Policy — XEOO HACKBAR

**Project:** XEOO HACKBAR  
**Version:** v1.0.0  
**Author:** Zone Xploiter / ZXMarchia  
**License:** MIT License  
**Last Updated:** November 2026  

---

## 1. Scope & Security Architecture

XEOO HACKBAR is designed with a strict **security-by-default, local-first** architecture for authorized penetration testing, security assessments, and educational research.

### Core Security Principles

- **SEC-01: Zero Static Host Permissions**  
  XEOO HACKBAR does not declare static wildcards in `host_permissions` during installation. Network access is governed strictly by Chrome's `optional_host_permissions` requested on-demand per authorized domain.
- **SEC-02: Explicit User Execution**  
  No HTTP socket or web request is initiated automatically or in the background. Every request requires an explicit trigger (`Execute` or `Fetch`) by the user.
- **SEC-03: Scope Guardian (Private Network Protection)**  
  Target origins are checked against the `ScopeRepository`. Intranet addresses (`127.0.0.1`, `localhost`, `10.0.0.0/8`, `192.168.0.0/16`, `172.16.0.0/12`, `.local`) are blocked by default to prevent DNS rebinding attacks or inadvertent internal network exposure.
- **SEC-04: Memory & Buffer Exhaustion Protection**  
  Incoming response streams are metered via `ReadableStream` reader limits (default 2 MB) to prevent memory exhaustion in the extension process.
- **SEC-05: Safe Response Rendering**  
  Target HTML and JavaScript bodies are treated strictly as unformatted text (`<pre>`) or structured data. Content is never evaluated in the DOM (`dangerouslySetInnerHTML`), eliminating Cross-Site Scripting (XSS) risks inside the extension runtime.
- **SEC-06: Strict Code Integrity**  
  The extension contains no `eval()`, `new Function()`, or dynamic remote code loading. The extension Content Security Policy (CSP) enforces `script-src 'self'`.
- **SEC-07: Sensitive Credential Redaction**  
  Authorization headers, authentication cookies (`Cookie`, `Set-Cookie`), and API keys are automatically masked with `[REDACTED]` prior to storing history in local IndexedDB.

---

## 2. Supported Versions

| Version | Supported | Security Maintenance |
| :---: | :---: | :---: |
| **v1.0.x** | ✅ Yes | Active Security Fixes |
| < v1.0.0 | ❌ No | Deprecated |

---

## 3. Reporting a Vulnerability

We take the security and integrity of XEOO HACKBAR seriously. If you discover a security vulnerability or bypass in the extension runtime:

1. **Do not create a public GitHub issue.**
2. Send an advisory detailing the vulnerability, reproduction steps, affected component, and suggested remediation to the repository maintainer.
3. You will receive an acknowledgment within **48 hours**.
4. We follow coordinated vulnerability disclosure guidelines and will release an emergency patch before public disclosure.

---

## 4. Operational Boundaries & Legal Notice

XEOO HACKBAR is strictly intended for **authorized penetration testing, CTF security competitions, web development debugging, and academic security analysis**. Use of this extension against systems without prior explicit written permission from the target owner is strictly prohibited and illegal under applicable cybercrime legislation.

Refer to [DISCLAIMER.md](../DISCLAIMER.md) and [PRIVACY.md](../PRIVACY.md) for full liability and privacy terms.
