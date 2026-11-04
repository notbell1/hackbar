import { create } from 'zustand';
import { parseUrl, rebuildUrlWithParams } from '@/core/url/parser';
import { HttpClient, HttpResponseResult } from '@/core/http/client';
import { HistoryRepository } from '@/storage/repositories/HistoryRepository';
import { SettingsRepository } from '@/storage/repositories/SettingsRepository';
import { ScopeRepository } from '@/storage/repositories/ScopeRepository';
import { TabExecutor } from '@/core/browser/tabExecutor';
import { normalizeTargetUrl } from '@/core/url/normalizer';

export type NavigationPage =
  | 'builder'
  | 'parser'
  | 'encoder'
  | 'security'
  | 'payloads'
  | 'history'
  | 'scope'
  | 'settings';

export interface HeaderEntry {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface QueryParamEntry {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

interface AppState {
  currentPage: NavigationPage;
  url: string;
  method: string;
  queryParams: QueryParamEntry[];
  headers: HeaderEntry[];
  bodyType: 'none' | 'json' | 'form' | 'raw';
  bodyContent: string;
  isLoading: boolean;
  isSyncWithTab: boolean;
  response: HttpResponseResult | null;
  statusMessage: string | null;
  toastMessage: string | null;

  setCurrentPage: (page: NavigationPage) => void;
  setUrl: (url: string) => void;
  setMethod: (method: string) => void;
  setIsSyncWithTab: (sync: boolean) => void;
  setQueryParams: (params: QueryParamEntry[]) => void;
  updateQueryParam: (id: string, key: string, value: string, enabled: boolean) => void;
  addQueryParam: () => void;
  removeQueryParam: (id: string) => void;
  setHeaders: (headers: HeaderEntry[]) => void;
  updateHeader: (id: string, key: string, value: string, enabled: boolean) => void;
  addHeader: () => void;
  removeHeader: (id: string) => void;
  setBodyType: (type: 'none' | 'json' | 'form' | 'raw') => void;
  setBodyContent: (body: string) => void;
  setToastMessage: (msg: string | null) => void;
  sendRequest: (options?: { forceSyncTab?: boolean; skipSyncTab?: boolean }) => Promise<void>;
  executeInBrowserTab: () => Promise<void>;
  authorizeCurrentOriginAndSend: () => Promise<void>;
  loadHistoryIntoBuilder: (history: any) => void;
  loadActiveTabUrl: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentPage: 'builder',
  url: '',
  method: 'GET',
  queryParams: [],
  headers: [
    { id: '1', key: 'Accept', value: 'application/json, text/plain, */*', enabled: true },
    { id: '2', key: 'User-Agent', value: 'XEOO-Hackbar/1.0', enabled: false }
  ],
  bodyType: 'none',
  bodyContent: '',
  isLoading: false,
  isSyncWithTab: true, // Default to true for authentic HackBar experience!
  response: null,
  statusMessage: null,
  toastMessage: null,

  setCurrentPage: (page) => set({ currentPage: page }),

  setUrl: (newUrl) => {
    const parsed = parseUrl(newUrl);
    const queryParams: QueryParamEntry[] = parsed.params.map((p, idx) => ({
      id: `${idx}-${Date.now()}`,
      key: p.key,
      value: p.value,
      enabled: p.enabled
    }));
    set({ url: newUrl, queryParams });
  },

  setMethod: (method) => set({ method }),
  setIsSyncWithTab: (sync) => set({ isSyncWithTab: sync }),
  setToastMessage: (msg) => {
    set({ toastMessage: msg });
    if (msg) {
      setTimeout(() => {
        if (get().toastMessage === msg) {
          set({ toastMessage: null });
        }
      }, 3000);
    }
  },

  setQueryParams: (queryParams) => {
    const { url } = get();
    const updatedUrl = rebuildUrlWithParams(url, queryParams);
    set({ queryParams, url: updatedUrl });
  },

  updateQueryParam: (id, key, value, enabled) => {
    const { queryParams, url } = get();
    const updated = queryParams.map((p) => (p.id === id ? { ...p, key, value, enabled } : p));
    const updatedUrl = rebuildUrlWithParams(url, updated);
    set({ queryParams: updated, url: updatedUrl });
  },

  addQueryParam: () => {
    const { queryParams } = get();
    set({
      queryParams: [...queryParams, { id: `${Date.now()}`, key: '', value: '', enabled: true }]
    });
  },

  removeQueryParam: (id) => {
    const { queryParams, url } = get();
    const updated = queryParams.filter((p) => p.id !== id);
    const updatedUrl = rebuildUrlWithParams(url, updated);
    set({ queryParams: updated, url: updatedUrl });
  },

  setHeaders: (headers) => set({ headers }),

  updateHeader: (id, key, value, enabled) => {
    const { headers } = get();
    set({
      headers: headers.map((h) => (h.id === id ? { ...h, key, value, enabled } : h))
    });
  },

  addHeader: () => {
    const { headers } = get();
    set({
      headers: [...headers, { id: `${Date.now()}`, key: '', value: '', enabled: true }]
    });
  },

  removeHeader: (id) => {
    const { headers } = get();
    set({
      headers: headers.filter((h) => h.id !== id)
    });
  },

  setBodyType: (bodyType) => set({ bodyType }),
  setBodyContent: (bodyContent) => set({ bodyContent }),

  executeInBrowserTab: async () => {
    const { url, method, bodyContent, bodyType, setToastMessage } = get();
    if (!url.trim()) return;

    const res = await TabExecutor.execute(url, method, bodyContent, bodyType);
    if (!res.success) {
      setToastMessage(`Warning: ${res.message}`);
    } else {
      setToastMessage(null);
    }
  },

  sendRequest: async (options) => {
    const { url, method, headers, bodyType, bodyContent, isSyncWithTab, executeInBrowserTab } = get();
    if (!url.trim()) return;

    const shouldSync = options?.forceSyncTab ?? (options?.skipSyncTab ? false : isSyncWithTab);

    // If sync with tab is enabled, trigger browser tab execution
    if (shouldSync) {
      executeInBrowserTab().catch(console.error);
    }

    set({ isLoading: true, statusMessage: null, toastMessage: null });

    // Prepare header map
    const headerMap: Record<string, string> = {};
    headers.forEach((h) => {
      if (h.enabled && h.key.trim()) {
        headerMap[h.key.trim()] = h.value;
      }
    });

    if (bodyType === 'json' && !headerMap['Content-Type'] && !headerMap['content-type']) {
      headerMap['Content-Type'] = 'application/json';
    } else if (bodyType === 'form' && !headerMap['Content-Type'] && !headerMap['content-type']) {
      headerMap['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    try {
      const { url: effectiveUrl } = normalizeTargetUrl(url);

      const result = await HttpClient.execute({
        url: effectiveUrl,
        method,
        headers: headerMap,
        body: bodyType !== 'none' ? bodyContent : undefined
      });

      set({ response: result, isLoading: false, statusMessage: null });

      // Save to history & recent targets
      await HistoryRepository.add({
        url: result.url,
        method,
        headers: headerMap,
        body: bodyType !== 'none' ? bodyContent : undefined,
        status: result.status,
        statusText: result.statusText,
        responseHeaders: result.headers,
        responseBody: result.body,
        durationMs: result.durationMs,
        timestamp: Date.now()
      });

      await SettingsRepository.addRecentTarget(url);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      set({
        isLoading: false,
        statusMessage: errorMsg,
        response: {
          ok: false,
          status: 0,
          statusText: 'CLIENT_ERROR',
          headers: {},
          body: '',
          durationMs: 0,
          sizeBytes: 0,
          url,
          error: errorMsg
        }
      });
    }
  },

  authorizeCurrentOriginAndSend: async () => {
    const { url, sendRequest } = get();
    try {
      await ScopeRepository.addOrigin(url);

      if (typeof chrome !== 'undefined' && chrome.permissions) {
        const parsed = new URL(url.includes('://') ? url : `https://${url}`);
        const originPattern = `${parsed.protocol}//${parsed.hostname}/*`;
        await chrome.permissions.request({ origins: [originPattern] }).catch(() => {});
      }

      await sendRequest();
    } catch (e) {
      set({ statusMessage: 'Failed to authorize origin: ' + String(e) });
    }
  },

  loadHistoryIntoBuilder: (historyItem) => {
    const parsed = parseUrl(historyItem.url);
    const queryParams: QueryParamEntry[] = parsed.params.map((p, idx) => ({
      id: `${idx}-${Date.now()}`,
      key: p.key,
      value: p.value,
      enabled: p.enabled
    }));

    const headerEntries: HeaderEntry[] = Object.entries(historyItem.headers || {}).map(
      ([k, v], idx) => ({
        id: `${idx}-${Date.now()}`,
        key: k,
        value: String(v),
        enabled: true
      })
    );

    set({
      currentPage: 'builder',
      url: historyItem.url,
      method: historyItem.method || 'GET',
      queryParams,
      headers: headerEntries,
      bodyType: historyItem.body ? 'raw' : 'none',
      bodyContent: historyItem.body || '',
      response: {
        ok: historyItem.status >= 200 && historyItem.status < 300,
        status: historyItem.status,
        statusText: historyItem.statusText,
        headers: historyItem.responseHeaders || {},
        body: historyItem.responseBody || '',
        durationMs: historyItem.durationMs || 0,
        sizeBytes: (historyItem.responseBody || '').length,
        url: historyItem.url
      }
    });
  },

  loadActiveTabUrl: async () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.url && !tab.url.startsWith('chrome://')) {
          get().setUrl(tab.url);
        }
      }
    } catch (e) {
      console.warn('Could not query active tab:', e);
    }
  }
}));
