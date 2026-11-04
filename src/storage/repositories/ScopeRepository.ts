import { db, ScopeRecord } from '../db';
import { normalizeTargetUrl } from '@/core/url/normalizer';

export const ScopeRepository = {
  async getAll(): Promise<ScopeRecord[]> {
    return await db.scopes.toArray();
  },

  async getById(id: number): Promise<ScopeRecord | undefined> {
    return await db.scopes.get(id);
  },

  async add(record: Omit<ScopeRecord, 'id'>): Promise<number> {
    return await db.scopes.add(record as ScopeRecord);
  },

  async addOrigin(rawUrl: string): Promise<ScopeRecord> {
    const parsed = new URL(rawUrl.includes('://') ? rawUrl : `https://${rawUrl}`);
    const origin = parsed.origin;
    const hostPattern = parsed.hostname;
    const isLocal =
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname === '::1' ||
      parsed.hostname.startsWith('192.168.') ||
      parsed.hostname.startsWith('10.');

    const all = await db.scopes.toArray();
    const existing = all.find((s) => s.origin === origin);

    if (existing && existing.id) {
      if (!existing.enabled) {
        await db.scopes.update(existing.id, { enabled: true });
        existing.enabled = true;
      }
      return existing;
    }

    const newRecord: Omit<ScopeRecord, 'id'> = {
      origin,
      hostPattern,
      enabled: true,
      allowLocalhost: isLocal,
      notes: 'Added via Quick Authorize',
      createdAt: Date.now()
    };
    const id = await db.scopes.add(newRecord as ScopeRecord);
    return { ...newRecord, id };
  },

  async update(id: number, changes: Partial<ScopeRecord>): Promise<number> {
    return await db.scopes.update(id, changes);
  },

  async delete(id: number): Promise<void> {
    await db.scopes.delete(id);
  },

  async isAllowed(url: string, allowPrivateNetwork = false): Promise<{ allowed: boolean; reason?: string }> {
    try {
      const { url: normalized, isSearchQuery } = normalizeTargetUrl(url);
      if (isSearchQuery) {
        // Safe search / crawler queries are always permitted in scope
        return { allowed: true };
      }

      const parsed = new URL(normalized);

      // Check protocol
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return { allowed: false, reason: 'Only HTTP and HTTPS protocols are allowed' };
      }

      // Check localhost / private network & cloud metadata SSRF
      const hostname = parsed.hostname.toLowerCase();
      const isPrivateNetwork =
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '::1' ||
        hostname === '169.254.169.254' ||
        /^10\./.test(hostname) ||
        /^192\.168\./.test(hostname) ||
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname) ||
        hostname.endsWith('.local');

      if (isPrivateNetwork && !allowPrivateNetwork) {
        return {
          allowed: false,
          reason:
            'Localhost and private network targets are restricted by default. Enable private network access in Scope Settings to test local servers.'
        };
      }

      // Check against stored scopes using in-memory boolean filter for IndexedDB safety
      const allScopes = await db.scopes.toArray();
      const scopes = allScopes.filter((s) => Boolean(s.enabled));
      if (scopes.length === 0) {
        // Smart Scope Auto-Enrollment: Automatically enroll the first target origin
        await db.scopes.add({
          origin: parsed.origin,
          hostPattern: parsed.hostname,
          enabled: true,
          allowLocalhost: false,
          createdAt: Date.now()
        });
        return { allowed: true };
      }

      const currentOrigin = parsed.origin;
      const matched = scopes.some((s) => {
        if (s.origin === currentOrigin) return true;
        if (s.hostPattern === parsed.hostname) return true;
        if (s.hostPattern.startsWith('*.') && parsed.hostname.endsWith(s.hostPattern.slice(1))) {
          return true;
        }
        return false;
      });

      if (!matched) {
        return { allowed: false, reason: `Origin ${currentOrigin} is out of authorized scope.` };
      }

      return { allowed: true };
    } catch {
      return { allowed: false, reason: 'Invalid target URL' };
    }
  }
};
