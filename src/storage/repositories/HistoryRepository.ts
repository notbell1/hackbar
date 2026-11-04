import { db, HistoryItem } from '../db';

export interface HistoryFilter {
  searchTerm?: string;
  method?: string;
  statusCategory?: '2xx' | '3xx' | '4xx' | '5xx' | 'err';
  onlyEvidence?: boolean;
}

export const HistoryRepository = {
  async getAll(limit = 100): Promise<HistoryItem[]> {
    return await db.history.orderBy('timestamp').reverse().limit(limit).toArray();
  },

  async getFiltered(filter: HistoryFilter): Promise<HistoryItem[]> {
    let collection = db.history.orderBy('timestamp').reverse();

    let items = await collection.toArray();

    if (filter.onlyEvidence) {
      items = items.filter((item) => item.isEvidence);
    }

    if (filter.method) {
      items = items.filter((item) => item.method.toUpperCase() === filter.method?.toUpperCase());
    }

    if (filter.statusCategory) {
      items = items.filter((item) => {
        if (filter.statusCategory === '2xx') return item.status >= 200 && item.status < 300;
        if (filter.statusCategory === '3xx') return item.status >= 300 && item.status < 400;
        if (filter.statusCategory === '4xx') return item.status >= 400 && item.status < 500;
        if (filter.statusCategory === '5xx') return item.status >= 500 && item.status < 600;
        if (filter.statusCategory === 'err') return item.status === 0;
        return true;
      });
    }

    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      items = items.filter(
        (item) =>
          item.url.toLowerCase().includes(term) ||
          item.statusText.toLowerCase().includes(term) ||
          (item.notes && item.notes.toLowerCase().includes(term))
      );
    }

    return items;
  },

  async add(item: Omit<HistoryItem, 'id'>, redact = true): Promise<number> {
    const sanitizedHeaders = { ...item.headers };
    const sanitizedResponseHeaders = { ...item.responseHeaders };

    if (redact) {
      const sensitiveKeys = [
        'authorization',
        'cookie',
        'set-cookie',
        'x-api-key',
        'api-key',
        'token',
        'x-auth-token',
        'proxy-authorization'
      ];

      for (const key of Object.keys(sanitizedHeaders)) {
        if (sensitiveKeys.includes(key.toLowerCase())) {
          sanitizedHeaders[key] = '[REDACTED]';
        }
      }

      for (const key of Object.keys(sanitizedResponseHeaders)) {
        if (sensitiveKeys.includes(key.toLowerCase())) {
          sanitizedResponseHeaders[key] = '[REDACTED]';
        }
      }
    }

    return await db.history.add({
      ...item,
      headers: sanitizedHeaders,
      responseHeaders: sanitizedResponseHeaders
    } as HistoryItem);
  },

  async updateNotes(id: number, notes: string, isEvidence?: boolean): Promise<number> {
    return await db.history.update(id, { notes, ...(isEvidence !== undefined ? { isEvidence } : {}) });
  },

  async delete(id: number): Promise<void> {
    await db.history.delete(id);
  },

  async clearAll(): Promise<void> {
    await db.history.clear();
  }
};

