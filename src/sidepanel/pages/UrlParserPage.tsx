import React, { useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { parseUrl } from '@/core/url/parser';
import { Copy, Check } from 'lucide-react';

export const UrlParserPage: React.FC = () => {
  const { url, setUrl } = useAppStore();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const parsed = parseUrl(url);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const fields = [
    { label: 'Protocol', value: parsed.protocol },
    { label: 'Hostname', value: parsed.hostname },
    { label: 'Port', value: parsed.port || '(Default)' },
    { label: 'Origin', value: parsed.origin },
    { label: 'Pathname', value: parsed.pathname },
    { label: 'Search Query', value: parsed.search || '(None)' },
    { label: 'Hash Fragment', value: parsed.hash || '(None)' }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-[#111318]">
      <div className="space-y-1">
        <h2 className="text-sm font-bold text-[#F5F7FA]">URL Structure Breakdown</h2>
        <p className="text-xs text-[#9CA3AF]">
          Inspect parsed URL elements and verify query components without character corruption.
        </p>
      </div>

      <div className="bg-[#191D24] p-3 rounded border border-[#303744] space-y-2">
        <label className="text-xs font-semibold text-[#9CA3AF]">Current URL</label>
        <div className="flex space-x-1.5">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-[#111318] border border-[#303744] rounded px-2.5 py-1 text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#A3FF70]"
          />
          <button
            onClick={() => copyToClipboard(url, 'full')}
            className="px-2.5 py-1 bg-[#202630] hover:bg-[#303744] border border-[#303744] text-[#A3FF70] rounded text-xs flex items-center space-x-1"
          >
            {copiedKey === 'full' ? <Check size={12} /> : <Copy size={12} />}
            <span>Copy</span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
          Parsed Components
        </h3>

        <div className="grid grid-cols-1 gap-2">
          {fields.map((f) => (
            <div
              key={f.label}
              className="flex items-center justify-between p-2 rounded bg-[#191D24] border border-[#303744]"
            >
              <span className="text-xs text-[#9CA3AF] w-28 shrink-0">{f.label}</span>
              <span className="text-xs font-mono text-[#F5F7FA] flex-1 truncate pr-2">
                {f.value}
              </span>
              <button
                onClick={() => copyToClipboard(f.value, f.label)}
                title="Copy value"
                className="text-[#9CA3AF] hover:text-[#A3FF70] p-1"
              >
                {copiedKey === f.label ? (
                  <Check size={12} className="text-[#22C55E]" />
                ) : (
                  <Copy size={12} />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {parsed.params.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
            Query Key-Value Pairs ({parsed.params.length})
          </h3>
          <div className="bg-[#191D24] rounded border border-[#303744] divide-y divide-[#303744]">
            {parsed.params.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 text-xs font-mono">
                <span className="text-[#38BDF8] font-bold w-1/3 truncate">{p.key}</span>
                <span className="text-[#F5F7FA] flex-1 truncate px-2">{p.value}</span>
                <button
                  onClick={() => copyToClipboard(p.value, `param-${idx}`)}
                  className="text-[#9CA3AF] hover:text-[#A3FF70] p-1"
                >
                  {copiedKey === `param-${idx}` ? (
                    <Check size={12} className="text-[#22C55E]" />
                  ) : (
                    <Copy size={12} />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
