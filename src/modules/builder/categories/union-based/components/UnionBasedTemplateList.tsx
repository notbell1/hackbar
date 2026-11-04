import React, { useState, useMemo } from 'react';
import { BuilderTemplate } from '../types';
import { ArrowDownLeft, Check, Search, X } from 'lucide-react';
import { formatTemplateTooltip } from '../../../utils/tooltip-formatter';

interface UnionBasedTemplateListProps {
  templates: BuilderTemplate[];
  selectedTemplateId?: string;
  recentlyInsertedId?: string | null;
  onSelectTemplate: (template: BuilderTemplate) => void;
  onQuickInsert: (template: BuilderTemplate) => void;
}

export const UnionBasedTemplateList: React.FC<UnionBasedTemplateListProps> = ({
  templates,
  selectedTemplateId,
  recentlyInsertedId,
  onSelectTemplate,
  onQuickInsert
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter templates by search query
  const filteredTemplates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return templates;

    return templates.filter((tmpl) => {
      const matchName = tmpl.name.toLowerCase().includes(query);
      const matchDesc = tmpl.description?.toLowerCase().includes(query) ?? false;
      const matchContent = tmpl.content.toLowerCase().includes(query);
      const matchGroup = tmpl.group?.toLowerCase().includes(query) ?? false;
      const matchTags = tmpl.tags?.some((tag) => tag.toLowerCase().includes(query)) ?? false;

      return matchName || matchDesc || matchContent || matchGroup || matchTags;
    });
  }, [templates, searchQuery]);

  if (templates.length === 0) {
    return (
      <div className="p-3 text-center text-xs text-[#9CA3AF] border border-dashed border-[#303744] rounded-lg">
        No templates found in this subcategory.
      </div>
    );
  }

  const showSearch = templates.length > 6 || templates.some((t) => Boolean(t.group));

  return (
    <div className="space-y-2">
      {/* Search Bar if many templates or grouped */}
      {showSearch && (
        <div className="space-y-1.5 bg-[#12151D] p-1.5 rounded-lg border border-[#262D3B]">
          <div className="relative">
            <Search
              size={11}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B7280]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Cari dari ${templates.length} templates...`}
              className="w-full bg-[#181D27] border border-[#2D3646] rounded pl-7 pr-7 py-1 text-xs text-[#F5F7FA] placeholder-[#6B7280] focus:border-[#A3FF70] outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#F5F7FA]"
              >
                <X size={11} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Templates Scrollable List */}
      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
        {filteredTemplates.length === 0 ? (
          <div className="p-3 text-center text-xs text-[#6B7280] border border-dashed border-[#262D3B] rounded-lg">
            Tidak ada template yang cocok dengan pencarian "{searchQuery}".
          </div>
        ) : (
          filteredTemplates.map((tmpl) => {
            const isSelected = tmpl.id === selectedTemplateId;
            const isInserted = tmpl.id === recentlyInsertedId;

            // Tooltip rapi dengan pembatasan lebar baris agar tidak mepet batas kanan layar
            const tooltipText = formatTemplateTooltip(tmpl.description, tmpl.content);

            return (
              <div
                key={tmpl.id}
                onClick={() => onSelectTemplate(tmpl)}
                title={tooltipText}
                className={`p-2 rounded-lg border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                  isInserted
                    ? 'bg-[#A3FF70]/15 border-[#A3FF70]'
                    : isSelected
                    ? 'bg-[#202630] border-[#38BDF8] text-[#F5F7FA]'
                    : 'bg-[#111318] hover:bg-[#202630] border-[#303744] hover:border-[#38BDF8]/50 text-[#9CA3AF]'
                }`}
              >
                <div className="flex-1 min-w-0 flex items-center space-x-1.5 truncate">
                  <span className="font-semibold text-xs text-[#F5F7FA] truncate">{tmpl.name}</span>
                  {tmpl.group && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#1F2736] text-[#38BDF8] border border-[#2D384D] font-mono shrink-0">
                      {tmpl.group}
                    </span>
                  )}
                  {isInserted && (
                    <span className="text-[10px] font-bold text-[#A3FF70] flex items-center space-x-0.5 shrink-0">
                      <Check size={10} />
                      <span>Inserted!</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickInsert(tmpl);
                  }}
                  title="Insert at cursor position"
                  className={`p-1.5 rounded border shrink-0 transition-colors ${
                    isInserted
                      ? 'bg-[#A3FF70] text-[#111318] border-[#A3FF70]'
                      : 'bg-[#202630] hover:bg-[#A3FF70] text-[#A3FF70] hover:text-[#111318] border-[#303744]'
                  }`}
                >
                  <ArrowDownLeft size={11} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
