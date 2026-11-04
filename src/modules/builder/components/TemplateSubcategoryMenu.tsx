import React from 'react';
import { TemplateSubcategory } from '../types/template';

interface TemplateSubcategoryMenuProps {
  subcategories: TemplateSubcategory[];
  selectedSubcategoryId: string;
  onSelectSubcategory: (subcategory: TemplateSubcategory) => void;
}

export const TemplateSubcategoryMenu: React.FC<TemplateSubcategoryMenuProps> = ({
  subcategories,
  selectedSubcategoryId,
  onSelectSubcategory
}) => {
  if (subcategories.length === 0) return null;

  return (
    <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1">
      {subcategories.map((sub) => {
        const isSelected = sub.id === selectedSubcategoryId;
        return (
          <button
            key={sub.id}
            onClick={() => onSelectSubcategory(sub)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all whitespace-nowrap shrink-0 border ${
              isSelected
                ? 'bg-[#A3FF70]/15 text-[#A3FF70] border-[#A3FF70]/40 font-bold'
                : 'bg-[#191D24] text-[#9CA3AF] border-[#303744] hover:text-[#F5F7FA] hover:bg-[#202630]'
            }`}
          >
            {sub.label}
          </button>
        );
      })}
    </div>
  );
};

