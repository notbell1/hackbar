import React, { useEffect, useState } from 'react';
import { HistoryRepository, HistoryFilter } from '@/storage/repositories/HistoryRepository';
import { HistoryItem } from '@/storage/db';
import { useAppStore } from '@/stores/appStore';
import {
  Search,
  Trash2,
  Download,
  Bookmark,
  Send,
  Clock
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState<HistoryFilter>({});
  const { loadHistoryIntoBuilder } = useAppStore();

  const loadData = async () => {
    const items = await HistoryRepository.getFiltered(filter);
    setHistory(items);
  };

  useEffect(() => {
    loadData();
  }, [filter]);

  const handleToggleEvidence = async (item: HistoryItem) => {
    if (!item.id) return;
    await HistoryRepository.updateNotes(item.id, item.notes || '', !item.isEvidence);
    loadData();
  };

  const handleClear = async () => {
    if (confirm('Clear all request history logs?')) {
      await HistoryRepository.clearAll();
      loadData();
    }
  };

  const exportToJson = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xeoo-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToMarkdown = () => {
    let md = `# XEOO HACKBAR Request History & Evidence Report\nGenerated: ${new Date().toLocaleString()}\n\n`;
    history.forEach((h, i) => {
      md += `### ${i + 1}. [${h.method}] ${h.url}\n`;
      md += `- **Status**: ${h.status} ${h.statusText}\n`;
      md += `- **Timestamp**: ${new Date(h.timestamp).toLocaleString()}\n`;
      md += `- **Duration**: ${h.durationMs}ms\n`;
      md += `- **Evidence Mark**: ${h.isEvidence ? 'YES' : 'NO'}\n`;
      if (h.notes) md += `- **Notes**: ${h.notes}\n`;
      md += `\n**Request Headers**:\n\`\`\`json\n${JSON.stringify(h.headers, null, 2)}\n\`\`\`\n`;
      if (h.body) {
        md += `\n**Request Body**:\n\`\`\`\n${h.body}\n\`\`\`\n`;
      }
      md += `\n**Response Headers**:\n\`\`\`json\n${JSON.stringify(h.responseHeaders, null, 2)}\n\`\`\`\n`;
      md += `\n**Response Body (Excerpt)**:\n\`\`\`\n${h.responseBody.slice(0, 500)}\n\`\`\`\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xeoo-evidence-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#111318]">
      <div className="flex items-center justify-between pb-1 border-b border-[#303744]">
        <div>
          <h2 className="text-sm font-bold text-[#F5F7FA]">Request History & Evidence</h2>
          <p className="text-xs text-[#9CA3AF]">{history.length} requests logged locally</p>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={exportToJson}
            title="Export JSON"
            className="p-1.5 bg-[#202630] hover:bg-[#303744] text-[#9CA3AF] hover:text-[#F5F7FA] rounded border border-[#303744]"
          >
            <Download size={13} />
          </button>
          <button
            onClick={exportToMarkdown}
            title="Export Markdown Report"
            className="px-2 py-1 bg-[#202630] hover:bg-[#303744] text-[#A3FF70] text-xs font-medium rounded border border-[#303744]"
          >
            MD Report
          </button>
          <button
            onClick={handleClear}
            title="Clear all history"
            className="p-1.5 bg-[#202630] hover:bg-[#303744] text-[#EF4444] rounded border border-[#303744]"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center space-x-2 text-xs">
        <div className="flex-1 relative">
          <Search size={13} className="absolute left-2.5 top-2 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search URL or notes..."
            value={filter.searchTerm || ''}
            onChange={(e) => setFilter({ ...filter, searchTerm: e.target.value })}
            className="w-full bg-[#191D24] border border-[#303744] rounded pl-8 pr-2 py-1 text-xs text-[#F5F7FA] focus:outline-none focus:border-[#A3FF70]"
          />
        </div>

        <select
          value={filter.statusCategory || ''}
          onChange={(e) =>
            setFilter({
              ...filter,
              statusCategory: (e.target.value as any) || undefined
            })
          }
          className="bg-[#191D24] border border-[#303744] rounded px-2 py-1 text-xs text-[#F5F7FA]"
        >
          <option value="">All Statuses</option>
          <option value="2xx">2xx Success</option>
          <option value="3xx">3xx Redirect</option>
          <option value="4xx">4xx Client Error</option>
          <option value="5xx">5xx Server Error</option>
          <option value="err">Network Error</option>
        </select>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {history.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#9CA3AF] border border-dashed border-[#303744] rounded">
            No history entries found matching criteria.
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="bg-[#191D24] border border-[#303744] rounded p-2.5 space-y-1.5 text-xs hover:border-[#A3FF70]/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className={`font-mono font-bold text-[11px] px-1.5 py-0.2 rounded ${
                      item.method === 'GET'
                        ? 'bg-[#22C55E]/15 text-[#22C55E]'
                        : item.method === 'POST'
                        ? 'bg-[#38BDF8]/15 text-[#38BDF8]'
                        : 'bg-[#F59E0B]/15 text-[#F59E0B]'
                    }`}
                  >
                    {item.method}
                  </span>
                  <span
                    className={`font-mono font-semibold ${
                      item.status >= 200 && item.status < 300
                        ? 'text-[#22C55E]'
                        : item.status >= 400
                        ? 'text-[#EF4444]'
                        : 'text-[#F59E0B]'
                    }`}
                  >
                    {item.status} {item.statusText}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-[#9CA3AF] text-[11px]">
                  <span className="flex items-center space-x-0.5">
                    <Clock size={11} />
                    <span>{item.durationMs}ms</span>
                  </span>
                  <button
                    onClick={() => handleToggleEvidence(item)}
                    title="Mark as Security Evidence"
                    className={`p-1 rounded ${
                      item.isEvidence ? 'text-[#F59E0B] bg-[#F59E0B]/15' : 'hover:text-[#F5F7FA]'
                    }`}
                  >
                    <Bookmark size={13} />
                  </button>
                </div>
              </div>

              <div className="font-mono text-xs text-[#F5F7FA] break-all truncate">{item.url}</div>

              <div className="flex items-center justify-between pt-1 border-t border-[#202630] text-[11px] text-[#9CA3AF]">
                <span>{new Date(item.timestamp).toLocaleTimeString()}</span>

                <button
                  onClick={() => loadHistoryIntoBuilder(item)}
                  className="flex items-center space-x-1 text-[#A3FF70] hover:underline"
                >
                  <Send size={11} />
                  <span>Re-open in Builder</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
