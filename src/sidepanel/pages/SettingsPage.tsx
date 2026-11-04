import React, { useEffect, useState } from 'react';
import { SettingsRepository, AppSettings, DEFAULT_SETTINGS } from '@/storage/repositories/SettingsRepository';
import { Save, RefreshCw, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    SettingsRepository.get().then(setSettings);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await SettingsRepository.update(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = async () => {
    if (confirm('Reset all settings to default configuration?')) {
      const reset = await SettingsRepository.update(DEFAULT_SETTINGS);
      setSettings(reset);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-[#111318]">
      <div>
        <h2 className="text-sm font-bold text-[#F5F7FA]">Application Settings</h2>
        <p className="text-xs text-[#9CA3AF]">
          Configure execution timeouts, response memory guards, and sensitive information redaction.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        {/* Request Timeout */}
        <div className="bg-[#191D24] p-3 rounded border border-[#303744] space-y-1.5">
          <label className="font-semibold text-[#F5F7FA] block">Request Timeout (milliseconds)</label>
          <p className="text-[11px] text-[#9CA3AF]">
            Maximum time to wait before cancelling pending HTTP fetch calls.
          </p>
          <input
            type="number"
            min={1000}
            max={60000}
            step={1000}
            value={settings.defaultTimeoutMs}
            onChange={(e) =>
              setSettings({ ...settings, defaultTimeoutMs: Number(e.target.value) })
            }
            className="w-full bg-[#111318] border border-[#303744] rounded px-2.5 py-1 text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#A3FF70]"
          />
        </div>

        {/* Max Response Buffer Size */}
        <div className="bg-[#191D24] p-3 rounded border border-[#303744] space-y-1.5">
          <label className="font-semibold text-[#F5F7FA] block">
            Maximum Response Body Size (bytes)
          </label>
          <p className="text-[11px] text-[#9CA3AF]">
            Protects the browser side-panel from crashing on giant payload responses (Default: 2MB).
          </p>
          <input
            type="number"
            min={102400}
            max={10485760}
            step={102400}
            value={settings.maxResponseSizeBytes}
            onChange={(e) =>
              setSettings({ ...settings, maxResponseSizeBytes: Number(e.target.value) })
            }
            className="w-full bg-[#111318] border border-[#303744] rounded px-2.5 py-1 text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#A3FF70]"
          />
        </div>

        {/* Sensitive Information Redaction */}
        <div className="bg-[#191D24] p-3 rounded border border-[#303744] space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-[#F5F7FA] block">Sensitive Header Redaction</span>
              <p className="text-[11px] text-[#9CA3AF]">
                Automatically redact Cookies, Authorization tokens, and API keys before saving to local history logs.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoRedactSensitiveHeaders}
              onChange={(e) =>
                setSettings({ ...settings, autoRedactSensitiveHeaders: e.target.checked })
              }
              className="rounded bg-[#202630] border-[#303744] text-[#A3FF70] focus:ring-0 ml-3"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1 text-xs text-[#9CA3AF] hover:text-[#EF4444]"
          >
            <RefreshCw size={12} />
            <span>Restore Defaults</span>
          </button>

          <button
            type="submit"
            className="flex items-center space-x-1.5 bg-[#A3FF70] hover:bg-[#8ee85c] text-[#111318] font-bold px-4 py-1.5 rounded transition-all shadow-sm"
          >
            {saved ? <Check size={13} className="text-[#111318]" /> : <Save size={13} />}
            <span>{saved ? 'Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

