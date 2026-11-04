export interface SecurityHeaderAssessment {
  headerName: string;
  found: boolean;
  value?: string;
  status: 'good' | 'warning' | 'missing';
  recommendation: string;
}

export interface SecurityAnalysisResult {
  headers: SecurityHeaderAssessment[];
  serverDisclosures: { name: string; value: string }[];
  overallScore: 'strong' | 'moderate' | 'weak';
}

export interface WafDetectionResult {
  detected: boolean;
  wafName?: string;
  signature?: string;
  advice: string;
}

export function detectWaf(
  statusCode: number,
  headers: Record<string, string>,
  body: string
): WafDetectionResult {
  const normHeaders = Object.keys(headers)
    .map((k) => `${k.toLowerCase()}: ${headers[k].toLowerCase()}`)
    .join('\n');
  const lowerBody = body.toLowerCase();

  if (lowerBody.includes('imunify360') || normHeaders.includes('imunify360')) {
    return {
      detected: true,
      wafName: 'Imunify360 Web Application Firewall & Bot-Protection',
      signature: 'Imunify360 Bot-Protection Filter',
      advice:
        'The remote server is protected by Imunify360 WAF. It detected an automated or non-browser request pattern. Pass browser credentials/cookies, avoid custom bot User-Agents, or whitelist your testing IP in the hosting cPanel/Plesk console.'
    };
  }

  if (lowerBody.includes('cloudflare') || normHeaders.includes('cf-ray')) {
    return {
      detected: true,
      wafName: 'Cloudflare Bot Management / WAF',
      signature: 'Cloudflare Security Challenge',
      advice:
        'Cloudflare challenged or blocked the connection. Complete the captcha in the active browser tab so cookies are forwarded.'
    };
  }

  if (
    lowerBody.includes('mod_security') ||
    lowerBody.includes('modsecurity') ||
    normHeaders.includes('mod_security')
  ) {
    return {
      detected: true,
      wafName: 'ModSecurity OWASP Rule Set',
      signature: 'ModSecurity Filtering',
      advice:
        'A ModSecurity inspection rule was triggered. Inspect query parameters and headers for triggered signatures.'
    };
  }

  if (statusCode === 403) {
    return {
      detected: true,
      wafName: 'Access Restriction / Firewall',
      signature: 'HTTP 403 Forbidden Access Control',
      advice:
        'The target server rejected access. Verify if authentication cookies, tokens, or custom headers are required.'
    };
  }

  return { detected: false, advice: '' };
}

export function analyzeSecurityHeaders(headers: Record<string, string>): SecurityAnalysisResult {
  const normalized: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers)) {
    normalized[k.toLowerCase()] = v;
  }

  const assessments: SecurityHeaderAssessment[] = [
    {
      headerName: 'Content-Security-Policy',
      found: Boolean(normalized['content-security-policy']),
      value: normalized['content-security-policy'],
      status: normalized['content-security-policy'] ? 'good' : 'missing',
      recommendation:
        'Mitigates cross-site scripting and unauthorized resource loading. Define script-src and object-src policies.'
    },
    {
      headerName: 'Strict-Transport-Security',
      found: Boolean(normalized['strict-transport-security']),
      value: normalized['strict-transport-security'],
      status: normalized['strict-transport-security'] ? 'good' : 'warning',
      recommendation:
        'Enforces secure HTTPS connections and prevents SSL stripping attacks (max-age=31536000; includeSubDomains).'
    },
    {
      headerName: 'X-Content-Type-Options',
      found: Boolean(normalized['x-content-type-options']),
      value: normalized['x-content-type-options'],
      status: normalized['x-content-type-options']?.toLowerCase() === 'nosniff' ? 'good' : 'warning',
      recommendation: 'Must be set to "nosniff" to prevent MIME-confusion attacks.'
    },
    {
      headerName: 'X-Frame-Options',
      found: Boolean(normalized['x-frame-options']),
      value: normalized['x-frame-options'],
      status: normalized['x-frame-options'] ? 'good' : 'missing',
      recommendation:
        'Prevents clickjacking by controlling if the site can be framed (DENY or SAMEORIGIN).'
    },
    {
      headerName: 'Referrer-Policy',
      found: Boolean(normalized['referrer-policy']),
      value: normalized['referrer-policy'],
      status: normalized['referrer-policy'] ? 'good' : 'warning',
      recommendation:
        'Protects sensitive query parameters and URL paths from leaking in Referer headers (strict-origin-when-cross-origin).'
    },
    {
      headerName: 'Permissions-Policy',
      found: Boolean(normalized['permissions-policy']),
      value: normalized['permissions-policy'],
      status: normalized['permissions-policy'] ? 'good' : 'warning',
      recommendation:
        'Restricts browser features like camera, microphone, geolocation, and payment.'
    }
  ];

  // Disclosures
  const serverDisclosures: { name: string; value: string }[] = [];
  ['server', 'x-powered-by', 'x-aspnet-version', 'x-generator'].forEach((header) => {
    if (normalized[header]) {
      serverDisclosures.push({ name: header, value: normalized[header] });
    }
  });

  const goodCount = assessments.filter((a) => a.status === 'good').length;
  let overallScore: 'strong' | 'moderate' | 'weak' = 'weak';
  if (goodCount >= 4) overallScore = 'strong';
  else if (goodCount >= 2) overallScore = 'moderate';

  return {
    headers: assessments,
    serverDisclosures,
    overallScore
  };
}
