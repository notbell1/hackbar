/**
 * URL Normalization & Smart Resolution
 * Handles:
 * 1. Plain text queries (e.g. "DdadD") -> Resolves to search engine crawler query
 * 2. Hostnames without scheme (e.g. "example.com/test") -> Auto-prepends https://
 * 3. Localhost and IP addresses -> Auto-prepends http://
 */

export function isLikelySearchQuery(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed) return false;

  // Has explicit scheme (e.g. http://, https://, ftp://)
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//i.test(trimmed)) {
    return false;
  }

  // Has spaces -> definitely a search phrase
  if (/\s/.test(trimmed)) {
    return true;
  }

  // Matches localhost or IP address with optional port and path
  if (
    /^(localhost|127\.0\.0\.1|::1|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(\/.*)?$/i.test(
      trimmed
    )
  ) {
    return false;
  }

  // Matches domain with valid TLD (e.g. example.com, test.co.id, vuln-site.org)
  if (/^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}(:\d+)?(\/.*)?$/i.test(trimmed)) {
    return false;
  }

  // Plain word or search keyword like "DdadD"
  return true;
}

export function normalizeTargetUrl(input: string): { url: string; isSearchQuery: boolean } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { url: '', isSearchQuery: false };
  }

  if (isLikelySearchQuery(trimmed)) {
    return {
      url: `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`,
      isSearchQuery: true
    };
  }

  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//i.test(trimmed)) {
    return { url: trimmed, isSearchQuery: false };
  }

  // Localhost / loopback defaults to http://, regular domains default to https://
  const isLocal =
    /^localhost(:\d+)?(\/.*)?$/i.test(trimmed) ||
    /^127\.0\.0\.1(:\d+)?(\/.*)?$/i.test(trimmed);

  return {
    url: `${isLocal ? 'http://' : 'https://'}${trimmed}`,
    isSearchQuery: false
  };
}

