import React from 'react';
import { Search, X } from 'lucide-react';

interface TemplateSearchProps {
  query: string;
  onChangeQuery: (query: string) => void;
}

export const TemplateSearch: React.FC<TemplateSearchProps> = ({ query, onChangeQuery }) => {
  return (
    <div className="relative flex items-center">
      <Search size={12} className="absolute left-2.5 text-[#9CA3AF] pointer-events-none" />
      <input
        type="text"
        placeholder="Search all 15 categories..."
        value={query}
        onChange={(e) => onChangeQuery(e.target.value)}
        className="w-full bg-[#191D24] border border-[#303744] hover:border-[#4a5568] focus:border-[#A3FF70] rounded-lg pl-8 pr-7 py-1 text-xs text-[#F5F7FA] placeholder-[#9CA3AF]/60 focus:outline-none transition-colors"
      />
      {query && (
        <button
          onClick={() => onChangeQuery('')}
          className="absolute right-2 text-[#9CA3AF] hover:text-[#EF4444] p-0.5 rounded"
          title="Clear search"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
};

