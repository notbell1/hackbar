import React from 'react';
import { TemplateCategory } from '../types/template';
import { ChevronDown, Database, Layers, Shield, ShieldAlert, FileText, Settings, AlertCircle, Search, Code, Folder, Lock, Link, FileCode, MoreHorizontal } from 'lucide-react';

interface TemplateCategoryMenuProps {
  categories: TemplateCategory[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const TemplateCategoryMenu: React.FC<TemplateCategoryMenuProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'sql-basic':
        return <Database size={13} className="text-[#A3FF70]" />;
      case 'union-based':
        return <Layers size={13} className="text-[#38BDF8]" />;
      case 'waf-based':
        return <Shield size={13} className="text-[#F59E0B]" />;
      case 'waf-bypass':
        return <ShieldAlert size={13} className="text-[#EF4444]" />;
      case 'out-file':
        return <FileText size={13} className="text-[#A855F7]" />;
      case 'custom-based':
        return <Settings size={13} className="text-[#EC4899]" />;
      case 'error-double':
        return <AlertCircle size={13} className="text-[#F97316]" />;
      case 'ldap-fuzz':
        return <Search size={13} className="text-[#06B6D4]" />;
      case 'xss':
        return <Code size={13} className="text-[#EAB308]" />;
      case 'lfi':
        return <Folder size={13} className="text-[#84CC16]" />;
      case 'encryption':
        return <Lock size={13} className="text-[#6366F1]" />;
      case 'links':
        return <Link size={13} className="text-[#3B82F6]" />;
      case 'html':
        return <FileCode size={13} className="text-[#14B8A6]" />;
      default:
        return <MoreHorizontal size={13} className="text-[#9CA3AF]" />;
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-1.5 bg-[#191D24] border border-[#303744] rounded-lg px-2.5 py-1.5 text-xs text-[#F5F7FA]">
        <span className="text-[#9CA3AF] text-[11px] font-medium shrink-0">Category:</span>
        <div className="flex-1 flex items-center space-x-1.5 overflow-hidden">
          {getIcon(selectedCategoryId)}
          <select
            value={selectedCategoryId}
            onChange={(e) => onSelectCategory(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold text-[#F5F7FA] focus:outline-none cursor-pointer truncate"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-[#191D24] text-[#F5F7FA]">
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <ChevronDown size={12} className="text-[#9CA3AF] shrink-0 pointer-events-none" />
      </div>
    </div>
  );
};

