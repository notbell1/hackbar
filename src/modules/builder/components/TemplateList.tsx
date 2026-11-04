import React from 'react';
import { TextTemplate } from '../types/template';
import { ChevronRight, ArrowDownLeft } from 'lucide-react';

interface TemplateListProps {
  templates: TextTemplate[];
  selectedTemplateId?: string;
  onSelectTemplate: (template: TextTemplate) => void;
  onQuickInsert: (template: TextTemplate) => void;
}

export const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  onQuickInsert
}) => {
  if (templates.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-[#9CA3AF] border border-dashed border-[#303744] rounded-lg">
        No templates found in this subcategory.
      </div>
    );
  }

  return (
    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
      {templates.map((t) => {
        const isSelected = t.id === selectedTemplateId;
        return (
          <div
            key={t.id}
            onClick={() => onSelectTemplate(t)}
            title={t.content}
            className={`p-2 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-xs ${
              isSelected
                ? 'bg-[#202630] border-[#A3FF70]/50 text-[#F5F7FA] shadow-sm'
                : 'bg-[#191D24] border-[#303744] text-[#9CA3AF] hover:text-[#F5F7FA] hover:bg-[#202630]'
            }`}
          >
            <div className="flex-1 truncate pr-2">
              <div className="font-medium text-[#F5F7FA] truncate">{t.name}</div>
              {t.description && (
                <div className="text-[10px] text-[#9CA3AF] truncate">{t.description}</div>
              )}
            </div>

            <div className="flex items-center space-x-1 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickInsert(t);
                }}
                title={t.content}
                className="p-1 rounded bg-[#111318] hover:bg-[#A3FF70] text-[#A3FF70] hover:text-[#111318] border border-[#303744] transition-colors cursor-pointer"
              >
                <ArrowDownLeft size={11} />
              </button>
              <ChevronRight
                size={13}
                className={isSelected ? 'text-[#A3FF70]' : 'text-[#9CA3AF]'}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

