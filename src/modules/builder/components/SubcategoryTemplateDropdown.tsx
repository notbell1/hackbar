import React, { useState, useMemo } from 'react';
import { TextTemplate } from '../types/template';
import { Check, ArrowDownLeft, ChevronDown } from 'lucide-react';
import { formatTemplateTooltip } from '../utils/tooltip-formatter';

interface SubcategoryTemplateDropdownProps {
  templates: TextTemplate[];
  recentlyInsertedId: string | null;
  onSelectTemplate: (template: TextTemplate) => void;
  maxHeightClass?: string;
}

export const SubcategoryTemplateDropdown: React.FC<SubcategoryTemplateDropdownProps> = ({
  templates,
  recentlyInsertedId,
  onSelectTemplate,
  maxHeightClass = ''
}) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Extract unique groups in order of appearance
  const availableGroups = useMemo(() => {
    const set = new Set<string>();
    templates.forEach((t) => {
      if (t.group) set.add(t.group);
    });
    return Array.from(set);
  }, [templates]);

  // Group the templates by their group property
  const groupedTemplates = useMemo(() => {
    if (availableGroups.length === 0) {
      return null;
    }

    const map = new Map<string, TextTemplate[]>();
    availableGroups.forEach((g) => map.set(g, []));

    const ungrouped: TextTemplate[] = [];

    templates.forEach((tmpl) => {
      if (tmpl.group && map.has(tmpl.group)) {
        map.get(tmpl.group)!.push(tmpl);
      } else {
        ungrouped.push(tmpl);
      }
    });

    return { map, ungrouped };
  }, [templates, availableGroups]);

  const toggleGroupOpen = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const renderTemplateItem = (tmpl: TextTemplate) => {
    const isInserted = recentlyInsertedId === tmpl.id;
    const tooltipText = formatTemplateTooltip(tmpl.description, tmpl.content);

    return (
      <div
        key={tmpl.id}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onSelectTemplate(tmpl)}
        title={tooltipText}
        className={`px-2 py-1.5 rounded cursor-pointer transition-all border text-xs group flex items-center justify-between gap-2 ${
          isInserted
            ? 'bg-[#A3FF70]/20 border-[#A3FF70] text-[#A3FF70]'
            : 'bg-[#12161F] hover:bg-[#1A222E] border-[#252B37] hover:border-[#A3FF70]/50 text-[#F5F7FA]'
        }`}
      >
        <span className="font-semibold text-[11px] group-hover:text-[#A3FF70] truncate min-w-0 flex-1">
          {tmpl.name}
        </span>

        <div className="flex items-center space-x-1 shrink-0">
          {isInserted ? (
            <span
              title="Inserted successfully"
              className="text-[9px] font-bold text-[#A3FF70] flex items-center space-x-0.5"
            >
              <Check size={10} />
              <span>OK</span>
            </span>
          ) : (
            <span
              title="Click to insert snippet"
              className="text-[#6B7280] group-hover:text-[#A3FF70] transition-colors"
            >
              <ArrowDownLeft size={11} />
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="space-y-1 bg-transparent w-full"
      onClick={(e) => e.stopPropagation()}
    >
      {/* List of Templates / Groups - natural flow without nested scroll traps */}
      <div className={maxHeightClass ? `${maxHeightClass} overflow-y-auto space-y-1 pr-0.5 scrollbar-thin scrollbar-thumb-[#252B37]` : 'space-y-1'}>
        {groupedTemplates ? (
          /* Render by Group Accordion when groups exist */
          <div className="space-y-1">
            {availableGroups.map((group) => {
              const items = groupedTemplates.map.get(group) || [];
              if (items.length === 0) return null;
              const isOpen = !!openGroups[group];

              return (
                <div
                  key={group}
                  className="border border-[#1E2532] hover:border-[#2E3B4E] rounded-md overflow-hidden bg-[#10141D] transition-all"
                >
                  <button
                    type="button"
                    title={group}
                    onClick={() => toggleGroupOpen(group)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 text-xs transition-colors cursor-pointer select-none ${
                      isOpen
                        ? 'bg-[#151C26] text-[#A3FF70] font-bold border-b border-[#1E2532]'
                        : 'text-[#E2E8F0] hover:text-[#A3FF70] hover:bg-[#151A24]'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 min-w-0 flex-1 pr-1.5">
                      <ChevronDown
                        size={11}
                        className={`transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-[#A3FF70]' : 'text-[#64748B]'
                        }`}
                      />
                      <span className="truncate tracking-wide text-[11px] text-left min-w-0 flex-1">
                        {group}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0A0D13] text-[#A3FF70] border border-[#232B3A] shrink-0 font-bold">
                      ({items.length})
                    </span>
                  </button>

                  {isOpen && (
                    <div className="p-1 space-y-1 bg-[#080B10] border-t border-[#1E2532]/60 animate-fadeIn">
                      {items.map(renderTemplateItem)}
                    </div>
                  )}
                </div>
              );
            })}

            {groupedTemplates.ungrouped.length > 0 && (
              <div className="p-1 space-y-1">
                {groupedTemplates.ungrouped.map(renderTemplateItem)}
              </div>
            )}
          </div>
        ) : (
          /* Render flat list */
          <div className="space-y-1">
            {templates.map(renderTemplateItem)}
          </div>
        )}
      </div>
    </div>
  );
};
