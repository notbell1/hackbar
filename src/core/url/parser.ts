export interface ParsedUrlDetails {
  raw: string;
  isValid: boolean;
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  params: { key: string; value: string; enabled: boolean }[];
  origin: string;
  error?: string;
}

export function parseUrl(rawUrl: string): ParsedUrlDetails {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return {
      raw: rawUrl,
      isValid: false,
      protocol: '',
      hostname: '',
      port: '',
      pathname: '',
      search: '',
      hash: '',
      params: [],
      origin: '',
      error: 'URL is empty'
    };
  }

  try {
    // If scheme is missing, default to https:// for parsing preview
    const urlString = trimmed.includes('://') ? trimmed : `https://${trimmed}`;
    const parsed = new URL(urlString);

    const params: { key: string; value: string; enabled: boolean }[] = [];
    parsed.searchParams.forEach((value, key) => {
      params.push({ key, value, enabled: true });
    });

    return {
      raw: rawUrl,
      isValid: true,
      protocol: parsed.protocol,
      hostname: parsed.hostname,
      port: parsed.port,
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
      params,
      origin: parsed.origin
    };
  } catch (err) {
    return {
      raw: rawUrl,
      isValid: false,
      protocol: '',
      hostname: '',
      port: '',
      pathname: '',
      search: '',
      hash: '',
      params: [],
      origin: '',
      error: 'Invalid URL format'
    };
  }
}

export function rebuildUrlWithParams(
  baseUrl: string,
  params: { key: string; value: string; enabled: boolean }[]
): string {
  try {
    const urlString = baseUrl.includes('://') ? baseUrl : `https://${baseUrl}`;
    const parsed = new URL(urlString);
    
    // Clear existing params
    const newSearchParams = new URLSearchParams();
    params.forEach((p) => {
      if (p.enabled && p.key.trim()) {
        newSearchParams.append(p.key, p.value);
      }
    });

    parsed.search = newSearchParams.toString();
    return parsed.toString();
  } catch {
    return baseUrl;
  }
}

