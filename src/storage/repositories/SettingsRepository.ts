export interface AppSettings {
  theme: 'dark' | 'light';
  defaultTimeoutMs: number;
  maxResponseSizeBytes: number;
  autoRedactSensitiveHeaders: boolean;
  allowPrivateNetworks: boolean;
  recentTargets: string[];
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  defaultTimeoutMs: 10000,
  maxResponseSizeBytes: 2 * 1024 * 1024, // 2 MB limit
  autoRedactSensitiveHeaders: true,
  allowPrivateNetworks: false,
  recentTargets: []
};

const SETTINGS_KEY = 'xeoo_app_settings';

export const SettingsRepository = {
  async get(): Promise<AppSettings> {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        const result = await chrome.storage.local.get(SETTINGS_KEY);
        return { ...DEFAULT_SETTINGS, ...(result[SETTINGS_KEY] || {}) };
      }
      const local = localStorage.getItem(SETTINGS_KEY);
      return local ? { ...DEFAULT_SETTINGS, ...JSON.parse(local) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  async update(newSettings: Partial<AppSettings>): Promise<AppSettings> {
    const current = await this.get();
    const updated = { ...current, ...newSettings };
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        await chrome.storage.local.set({ [SETTINGS_KEY]: updated });
      } else {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
    return updated;
  },

  async addRecentTarget(url: string): Promise<void> {
    const current = await this.get();
    const filtered = current.recentTargets.filter((t) => t !== url);
    const updated = [url, ...filtered].slice(0, 10);
    await this.update({ recentTargets: updated });
  }
};

