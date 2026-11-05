import Dexie, { Table } from 'dexie';

export interface ScopeRecord {
  id?: number;
  origin: string;
  hostPattern: string;
  enabled: boolean;
  allowLocalhost: boolean;
  notes?: string;
  createdAt: number;
}

export interface HistoryItem {
  id?: number;
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  status: number;
  statusText: string;
  responseHeaders: Record<string, string>;
  responseBody: string;
  durationMs: number;
  timestamp: number;
  notes?: string;
  isEvidence?: boolean;
}

export interface PayloadItem {
  id?: number;
  title: string;
  category: string;
  subcategory?: string;
  content: string;
  description?: string;
  tags: string[];
  isFavorite?: boolean;
  createdAt: number;
}

export class HackbarDatabase extends Dexie {
  scopes!: Table<ScopeRecord, number>;
  history!: Table<HistoryItem, number>;
  payloads!: Table<PayloadItem, number>;

  constructor() {
    super('ZXHackbarDB');
    this.version(1).stores({
      scopes: '++id, origin, hostPattern, enabled, createdAt',
      history: '++id, url, method, status, timestamp, isEvidence',
      payloads: '++id, title, category, *tags, isFavorite, createdAt'
    });
  }
}

export const db = new HackbarDatabase();

