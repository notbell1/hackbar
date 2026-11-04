import React, { useState } from 'react';
import { unionBasedCategory } from '../index';
import { BuilderSubcategory, BuilderTemplate } from '../types';
import { UnionBasedSubcategoryMenu } from './UnionBasedSubcategoryMenu';
import { UnionBasedTemplateList } from './UnionBasedTemplateList';
import { UnionBasedTemplatePreview } from './UnionBasedTemplatePreview';
import { insertContentIntoEditor } from '../../../editor/editor-adapter';
import { Layers } from 'lucide-react';

interface UnionBasedCategoryProps {
  onInsertContent?: (content: string) => void;
}

export const UnionBasedCategory: React.FC<UnionBasedCategoryProps> = ({
  onInsertContent
}) => {
  const subcategories: BuilderSubcategory[] = unionBasedCategory.subcategories;
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>(
    subcategories[0]?.id || 'order'
  );

  const activeSubcategory =
    subcategories.find((s) => s.id === selectedSubcategoryId) || subcategories[0];

  const [selectedTemplate, setSelectedTemplate] = useState<BuilderTemplate | null>(
    activeSubcategory?.templates[0] || null
  );
  const [recentlyInsertedId, setRecentlyInsertedId] = useState<string | null>(null);

  const handleSelectSubcategory = (sub: BuilderSubcategory) => {
    setSelectedSubcategoryId(sub.id);
    setSelectedTemplate(sub.templates[0] || null);
  };

  const handleInsert = (template: BuilderTemplate) => {
    const success = insertContentIntoEditor(template.content);
    if (success) {
      setRecentlyInsertedId(template.id);
      setTimeout(() => setRecentlyInsertedId(null), 1800);
      onInsertContent?.(template.content);
    }
  };

  return (
    <div className="bg-[#191D24] border border-[#303744] rounded-lg p-3 space-y-3">
      {/* Category Header */}
      <div className="flex items-center space-x-2 pb-2 border-b border-[#303744]">
        <Layers size={16} className="text-[#38BDF8]" />
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-xs text-[#F5F7FA]">Union Based Module</h3>
            <span className="text-[10px] bg-[#38BDF8]/15 text-[#38BDF8] px-1.5 py-0.2 rounded border border-[#38BDF8]/30 font-mono">
              14 subcategories
            </span>
          </div>
          <p className="text-[11px] text-[#9CA3AF]">
            {unionBasedCategory.description}
          </p>
        </div>
      </div>

      {/* Nested Subcategory Dropdown Menu */}
      <UnionBasedSubcategoryMenu
        subcategories={subcategories}
        selectedSubcategoryId={selectedSubcategoryId}
        onSelectSubcategory={handleSelectSubcategory}
      />

      {/* Template List */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-[#9CA3AF]">
          <span>Available Templates ({activeSubcategory?.templates.length || 0})</span>
          <span className="text-[10px] text-[#38BDF8]">Click card to preview or arrow to insert</span>
        </div>
        <UnionBasedTemplateList
          templates={activeSubcategory?.templates || []}
          selectedTemplateId={selectedTemplate?.id}
          recentlyInsertedId={recentlyInsertedId}
          onSelectTemplate={(tmpl) => setSelectedTemplate(tmpl)}
          onQuickInsert={handleInsert}
        />
      </div>

      {/* Template Preview Section */}
      <div className="pt-1">
        <UnionBasedTemplatePreview
          template={selectedTemplate}
          onInsert={handleInsert}
        />
      </div>
    </div>
  );
};
