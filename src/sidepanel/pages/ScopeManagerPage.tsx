import React, { useEffect, useState } from 'react';
import { ScopeRepository } from '@/storage/repositories/ScopeRepository';
import { SettingsRepository, AppSettings } from '@/storage/repositories/SettingsRepository';
import { ScopeRecord } from '@/storage/db';
import { useAppStore } from '@/stores/appStore';
import { Plus, Trash2, Globe, AlertTriangle, Key } from 'lucide-react';

export const ScopeManagerPage: React.FC = () => {
  const [scopes, setScopes] = useState<ScopeRecord[]>([]);
  const [newOrigin, setNewOrigin] = useState('');
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [hostPermissionGranted, setHostPermissionGranted] = useState<boolean | null>(null);

  const { url } = useAppStore();

  const loadData = async () => {
    const records = await ScopeRepository.getAll();
    setScopes(records);
    const set = await SettingsRepository.get();
    setSettings(set);
    checkCurrentHostPermission(url);
  };

  useEffect(() => {
    loadData();
  }, [url]);

  const checkCurrentHostPermission = async (targetUrl: string) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.permissions) {
        const parsed = new URL(targetUrl);
        const originPattern = `${parsed.protocol}//${parsed.hostname}/*`;
        const has = await chrome.permissions.contains({ origins: [originPattern] });
        setHostPermissionGranted(has);
      }
    } catch {
      setHostPermissionGranted(null);
    }
  };

  const requestHostPermission = async () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.permissions) {
        const parsed = new URL(url);
        const originPattern = `${parsed.protocol}//${parsed.hostname}/*`;
        const granted = await chrome.permissions.request({ origins: [originPattern] });
        setHostPermissionGranted(granted);
      }
    } catch (e) {
      alert('Permission request error: ' + String(e));
    }
  };

  const handleAddCurrentOrigin = async () => {
    try {
      const parsed = new URL(url);
      const origin = parsed.origin;
      const hostPattern = parsed.hostname;

      await ScopeRepository.add({
        origin,
        hostPattern,
        enabled: true,
        allowLocalhost: parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1',
        createdAt: Date.now()
      });
      loadData();
    } catch {
      alert('Invalid target URL in top bar');
    }
  };

  const handleAddCustomOrigin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrigin.trim()) return;

    try {
      const parsed = new URL(newOrigin.includes('://') ? newOrigin : `https://${newOrigin}`);
      await ScopeRepository.add({
        origin: parsed.origin,
        hostPattern: parsed.hostname,
        enabled: true,
        allowLocalhost: false,
        createdAt: Date.now()
      });
      setNewOrigin('');
      loadData();
    } catch {
      alert('Please enter a valid URL origin (e.g., https://example.com)');
    }
  };

  const handleToggleScope = async (scope: ScopeRecord) => {
    if (!scope.id) return;
    await ScopeRepository.update(scope.id, { enabled: !scope.enabled });
    loadData();
  };

  const handleDelete = async (id: number) => {
    await ScopeRepository.delete(id);
    loadData();
  };

  const handleTogglePrivateNetworks = async () => {
    if (!settings) return;
    const updated = await SettingsRepository.update({
      allowPrivateNetworks: !settings.allowPrivateNetworks
    });
    setSettings(updated);
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-[#111318]">
      <div>
        <h2 className="text-sm font-bold text-[#F5F7FA]">Target Scope & Authorization</h2>
        <p className="text-xs text-[#9CA3AF]">
          Enforces secure-by-design boundaries. Requests are only dispatched to authorized origins.
        </p>
      </div>

      {/* Browser Host Permissions Card */}
      <div className="bg-[#191D24] p-3 rounded border border-[#303744] space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#F5F7FA] flex items-center space-x-1.5">
            <Key size={13} className="text-[#38BDF8]" />
            <span>Chrome Host Permission</span>
          </span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
              hostPermissionGranted
                ? 'bg-[#22C55E]/15 text-[#22C55E]'
                : 'bg-[#F59E0B]/15 text-[#F59E0B]'
            }`}
          >
            {hostPermissionGranted ? 'Granted' : 'Optional / Not Requested'}
          </span>
        </div>

        <p className="text-[11px] text-[#9CA3AF]">
          To avoid broad access at installation, host access is requested on-demand per target origin.
        </p>

        {!hostPermissionGranted && (
          <button
            onClick={requestHostPermission}
            className="w-full bg-[#202630] hover:bg-[#303744] text-[#A3FF70] border border-[#303744] py-1 rounded font-medium text-xs transition-colors"
          >
            Request Host Permission for Current Target
          </button>
        )}
      </div>

      {/* Scope Controls */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
            Authorized Origins ({scopes.length})
          </span>
          <button
            onClick={handleAddCurrentOrigin}
            className="text-xs text-[#A3FF70] hover:underline flex items-center space-x-1"
          >
            <Plus size={12} />
            <span>Add Current Origin</span>
          </button>
        </div>

        {/* Input for manual origin */}
        <form onSubmit={handleAddCustomOrigin} className="flex space-x-1.5">
          <input
            type="text"
            placeholder="https://authorized-domain.com"
            value={newOrigin}
            onChange={(e) => setNewOrigin(e.target.value)}
            className="flex-1 bg-[#191D24] border border-[#303744] rounded px-2.5 py-1 text-xs text-[#F5F7FA] focus:outline-none focus:border-[#A3FF70]"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-[#202630] hover:bg-[#303744] text-[#A3FF70] border border-[#303744] rounded text-xs font-medium"
          >
            Add
          </button>
        </form>

        {scopes.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#9CA3AF] border border-dashed border-[#303744] rounded">
            No scope rules configured. Add your target domain to allow HTTP request execution.
          </div>
        ) : (
          <div className="space-y-1.5">
            {scopes.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-2 rounded bg-[#191D24] border border-[#303744] text-xs font-mono"
              >
                <div className="flex items-center space-x-2 truncate">
                  <input
                    type="checkbox"
                    checked={s.enabled}
                    onChange={() => handleToggleScope(s)}
                    className="rounded bg-[#202630] border-[#303744] text-[#A3FF70] focus:ring-0"
                  />
                  <Globe size={13} className="text-[#38BDF8] shrink-0" />
                  <span className="text-[#F5F7FA] truncate">{s.origin}</span>
                </div>

                <button
                  onClick={() => s.id && handleDelete(s.id)}
                  className="text-[#9CA3AF] hover:text-[#EF4444] p-1"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Localhost & Private Network Protection Policy */}
      <div className="bg-[#191D24] p-3 rounded border border-[#303744] space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#F5F7FA] flex items-center space-x-1.5">
            <AlertTriangle size={13} className="text-[#F59E0B]" />
            <span>Localhost & Intranet Protection</span>
          </span>
          <button
            onClick={handleTogglePrivateNetworks}
            className={`text-[11px] px-2 py-0.5 rounded font-bold transition-colors ${
              settings?.allowPrivateNetworks
                ? 'bg-[#EF4444]/20 text-[#EF4444]'
                : 'bg-[#22C55E]/15 text-[#22C55E]'
            }`}
          >
            {settings?.allowPrivateNetworks ? 'Restricted Check Disabled' : 'Protected (Default)'}
          </button>
        </div>
        <p className="text-[11px] text-[#9CA3AF]">
          Requests to private IPs (127.0.0.1, 192.168.x.x, 10.x.x.x, localhost) are blocked by default to prevent accidental cross-origin intranet probing.
        </p>
      </div>
    </div>
  );
};
