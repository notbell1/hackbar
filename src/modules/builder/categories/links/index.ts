import { TemplateCategory } from '../../types/template';

export const linksCategory: TemplateCategory = {
  id: 'links',
  label: 'Links',
  description: 'Quick reference pentest portals, exploit databases, payload repositories, crypto tools, and URI schemes',
  iconName: 'Link',
  subcategories: [
    {
      id: 'vuln-databases',
      label: 'Vulnerability Databases',
      description: 'Authoritative vulnerability catalogues, CVE indexes, and security training labs',
      templates: [
        {
          id: 'link-exploit-db',
          name: 'Exploit Database (Exploit-DB)',
          description: 'OffSec repository of exploits and proof of concepts',
          content: 'https://www.exploit-db.com/'
        },
        {
          id: 'link-cve-mitre',
          name: 'MITRE CVE Database',
          description: 'Official dictionary of Common Vulnerabilities and Exposures',
          content: 'https://cve.mitre.org/'
        },
        {
          id: 'link-nvd-nist',
          name: 'NIST NVD Search',
          description: 'U.S. National Vulnerability Database CVE search engine',
          content: 'https://nvd.nist.gov/vuln/search'
        },
        {
          id: 'link-portswigger-academy',
          name: 'PortSwigger Web Security Academy',
          description: 'Comprehensive interactive labs and theory for web vulnerabilities',
          content: 'https://portswigger.net/web-security'
        },
        {
          id: 'link-cwe-mitre',
          name: 'MITRE CWE List',
          description: 'Common Weakness Enumeration architectural security flaws',
          content: 'https://cwe.mitre.org/'
        }
      ]
    },
    {
      id: 'payload-repos',
      label: 'Payloads & Cheat Sheets',
      description: 'Popular community repositories for pentest payloads, reverse shells, and bypass wordlists',
      templates: [
        {
          id: 'link-payloads-all-the-things',
          name: 'PayloadsAllTheThings (GitHub)',
          description: 'Swissky repo containing cheat sheets and bypass methodology',
          content: 'https://github.com/swisskyrepo/PayloadsAllTheThings'
        },
        {
          id: 'link-seclists',
          name: 'SecLists Wordlists (GitHub)',
          description: 'Daniel Miessler security tester companion wordlists',
          content: 'https://github.com/danielmiessler/SecLists'
        },
        {
          id: 'link-owasp-cheatsheet',
          name: 'OWASP Cheat Sheet Series',
          description: 'Concise high-value defensive and offensive guidance',
          content: 'https://cheatsheetseries.owasp.org/'
        },
        {
          id: 'link-revshells',
          name: 'Reverse Shell Generator (revshells.com)',
          description: 'Online one-liner reverse shell command builder',
          content: 'https://www.revshells.com/'
        },
        {
          id: 'link-gtfobins',
          name: 'GTFOBins (Unix Privilege Escalation)',
          description: 'Curated list of Unix binaries for escaping restricted shells',
          content: 'https://gtfobins.github.io/'
        },
        {
          id: 'link-lolbas',
          name: 'LOLBAS (Windows Living Off The Land)',
          description: 'Living Off The Land Binaries, Scripts and Libraries on Windows',
          content: 'https://lolbas-project.github.io/'
        }
      ]
    },
    {
      id: 'crypto-tools',
      label: 'Crypto & Hash Lookups',
      description: 'Online rainbow table lookups, decoders, and multi-format converters',
      templates: [
        {
          id: 'link-crackstation',
          name: 'CrackStation Rainbow Lookup',
          description: 'Online password hash cracker with massive precomputed dictionary',
          content: 'https://crackstation.net/'
        },
        {
          id: 'link-cyberchef',
          name: 'CyberChef (GCHQ)',
          description: 'The Cyber Swiss Army Knife for encryption, compression, and analysis',
          content: 'https://gchq.github.io/CyberChef/'
        },
        {
          id: 'link-hashes-com',
          name: 'Hashes.com Decrypt',
          description: 'Community-driven hash lookup and escrow service',
          content: 'https://hashes.com/en/decrypt/hash'
        },
        {
          id: 'link-md5decrypt',
          name: 'MD5Decrypt.net',
          description: 'Specialized MD5, SHA1, SHA256 rainbow database lookup',
          content: 'https://md5decrypt.net/'
        }
      ]
    },
    {
      id: 'osint-recon',
      label: 'OSINT & Reconnaissance',
      description: 'Tools for target reconnaissance, certificate transparency, and external posture analysis',
      templates: [
        {
          id: 'link-crt-sh',
          name: 'crt.sh Certificate Search',
          description: 'Searches public Certificate Transparency logs for subdomains',
          content: 'https://crt.sh/?q={domain}'
        },
        {
          id: 'link-virustotal',
          name: 'VirusTotal URL & IP Scanner',
          description: 'Analyzes suspicious URLs and IPs against 70+ threat intelligence engines',
          content: 'https://www.virustotal.com/gui/home/url'
        },
        {
          id: 'link-shodan',
          name: 'Shodan Search Engine',
          description: 'Search engine for Internet-connected devices and exposed services',
          content: 'https://www.shodan.io/search?query={ip_or_query}'
        },
        {
          id: 'link-censys',
          name: 'Censys Search',
          description: 'Attack surface management and host search engine',
          content: 'https://search.censys.io/'
        },
        {
          id: 'link-securityheaders',
          name: 'SecurityHeaders.com',
          description: 'Analyzes HTTP response security headers (CSP, HSTS, X-Frame-Options)',
          content: 'https://securityheaders.com/?q={url}'
        }
      ]
    },
    {
      id: 'uri-schemes',
      label: 'URI Schemes & Protocols',
      description: 'Standard protocols, data URIs, and test pseudo-protocols',
      templates: [
        {
          id: 'link-data-uri-html',
          name: 'Data URI HTML Skeleton',
          description: 'Basic data URI with HTML content placeholder',
          content: 'data:text/html;charset=utf-8,<h1>Test%20Page</h1>'
        },
        {
          id: 'link-data-uri-json',
          name: 'Data URI JSON Skeleton',
          description: 'Basic data URI with JSON payload',
          content: 'data:application/json;charset=utf-8,{"status":"ok"}'
        },
        {
          id: 'link-data-base64',
          name: 'Base64 Encoded Data URI',
          description: 'Data URI containing Base64 encoded payload',
          content: 'data:text/html;base64,{base64_content}'
        },
        {
          id: 'link-javascript-void',
          name: 'JavaScript Void Link',
          description: 'Standard safe void pseudo-protocol',
          content: 'javascript:void(0);'
        },
        {
          id: 'link-javascript-alert',
          name: 'JavaScript Alert URI',
          description: 'Direct JavaScript execution pseudo-protocol',
          content: 'javascript:alert(1);'
        },
        {
          id: 'link-blob-url',
          name: 'Blob URL Format',
          description: 'In-memory object URL representation',
          content: 'blob:https://{host}/{uuid}'
        }
      ]
    }
  ]
};
