import React, { useState } from 'react';
import { useTemplateLibrary } from '../hooks/useTemplateLibrary';
import { TemplateCategoryMenu } from './TemplateCategoryMenu';
import { TemplateSubcategoryMenu } from './TemplateSubcategoryMenu';
import { TemplateList } from './TemplateList';
import { TemplatePreview } from './TemplatePreview';
import { TemplateSearch } from './TemplateSearch';
import { BookOpen, ArrowDownLeft, LayoutGrid, ListFilter } from 'lucide-react';
import { cursorManager } from '../editor/cursor-manager';

export const TemplateLibrary: React.FC = () => {
  const {
    categories,
    selectedCategoryId,
    selectedSubcategoryId,
    selectedTemplate,
    currentSubcategories,
    currentTemplates,
    searchQuery,
    searchResults,
    setSearchQuery,
    selectCategory,
    selectSubcategory,
    selectTemplate,
    insertTemplate
  } = useTemplateLibrary();

  const [viewMode, setViewMode] = useState<'categories' | 'all'>('all'); // default to 'all' templates as requested!
  const activeTarget = cursorManager.getActiveTarget();

  return (
    <div className="bg-[#191D24] border border-[#303744] rounded-lg p-3 space-y-3">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#202630] pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded bg-[#A3FF70]/15 text-[#A3FF70]">
            <BookOpen size={14} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#F5F7FA]">Template Library</h3>
            <p className="text-[10px] text-[#9CA3AF]">15 structured modular syntax categories</p>
          </div>
        </div>

        {/* View Mode Toggle & Target Indicator */}
        <div className="flex items-center space-x-2">
          <div className="flex space-x-0.5 bg-[#111318] p-0.5 rounded border border-[#303744]">
            <button
              onClick={() => setViewMode('all')}
              title="Show all templates together"
              className={`px-2 py-0.5 rounded text-[10px] font-medium flex items-center space-x-1 transition-colors ${
                viewMode === 'all'
                  ? 'bg-[#A3FF70] text-[#111318] font-bold'
                  : 'text-[#9CA3AF] hover:text-[#F5F7FA]'
              }`}
            >
              <LayoutGrid size={10} />
              <span>All</span>
            </button>
            <button
              onClick={() => setViewMode('categories')}
              title="Browse by Category Dropdown"
              className={`px-2 py-0.5 rounded text-[10px] font-medium flex items-center space-x-1 transition-colors ${
                viewMode === 'categories'
                  ? 'bg-[#A3FF70] text-[#111318] font-bold'
                  : 'text-[#9CA3AF] hover:text-[#F5F7FA]'
              }`}
            >
              <ListFilter size={10} />
              <span>Category</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center space-x-1 text-[10px] bg-[#111318] text-[#9CA3AF] px-2 py-0.5 rounded border border-[#303744]">
            <span>Target:</span>
            <span className="text-[#38BDF8] font-mono font-medium truncate max-w-[90px]">
              {activeTarget ? activeTarget.name : 'Editor'}
            </span>
          </div>
        </div>
      </div>

      {/* Global Search */}
      <TemplateSearch query={searchQuery} onChangeQuery={setSearchQuery} />

      {/* Static Preview Section (Placed at top so user sees template preview without scrolling down) */}
      {selectedTemplate && (
        <TemplatePreview
          template={selectedTemplate}
          onInsert={insertTemplate}
          onClose={() => selectTemplate(null as any)}
        />
      )}

      {/* Search Mode vs All View vs Category View */}
      {searchQuery.trim() ? (
        <div className="space-y-2">
          <div className="text-[11px] text-[#9CA3AF] font-medium flex items-center justify-between">
            <span>Search Results ({searchResults.length})</span>
          </div>

          {searchResults.length === 0 ? (
            <div className="p-4 text-center text-xs text-[#9CA3AF] border border-dashed border-[#303744] rounded-lg">
              No matching templates found for "{searchQuery}".
            </div>
          ) : (
            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {searchResults.map((res) => (
                <div
                  key={res.template.id}
                  onClick={() => selectTemplate(res.template)}
                  title={res.template.content}
                  className="p-2 rounded-lg bg-[#111318] border border-[#303744] hover:border-[#A3FF70]/50 cursor-pointer transition-colors flex items-center justify-between text-xs"
                >
                  <div className="flex-1 truncate pr-2">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-medium text-[#F5F7FA]">{res.template.name}</span>
                      <span className="text-[9px] bg-[#202630] text-[#38BDF8] px-1.5 py-0.2 rounded border border-[#303744]">
                        {res.category.label}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-[#A3FF70] truncate pt-0.5">
                      {res.template.content}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      insertTemplate(res.template);
                    }}
                    title={res.template.content}
                    className="p-1 rounded bg-[#202630] hover:bg-[#A3FF70] text-[#A3FF70] hover:text-[#111318] border border-[#303744] transition-colors shrink-0"
                  >
                    <ArrowDownLeft size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : viewMode === 'all' ? (
        /* ALL TEMPLATES EXPANDED VIEW */
        <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-[#111318] border border-[#303744] rounded-lg p-2.5 space-y-2">
              {/* Category Header */}
              <div className="flex items-center justify-between border-b border-[#202630] pb-1">
                <span className="font-bold text-xs text-[#A3FF70] tracking-wide">{cat.label}</span>
                <span className="text-[10px] text-[#9CA3AF]">
                  {cat.subcategories.reduce((acc, s) => acc + s.templates.length, 0)} templates
                </span>
              </div>

              {/* Subcategories and Templates */}
              <div className="space-y-2 pt-0.5">
                {cat.subcategories.map((sub) => (
                  <div key={sub.id} className="space-y-1">
                    <span className="text-[10px] font-semibold text-[#38BDF8] uppercase tracking-wider block">
                      {sub.label}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {sub.templates.map((tmpl) => (
                        <div
                          key={tmpl.id}
                          onClick={() => selectTemplate(tmpl)}
                          title={tmpl.content}
                          className="group p-2 rounded bg-[#191D24] hover:bg-[#202630] border border-[#303744] hover:border-[#A3FF70]/50 cursor-pointer transition-all flex items-center justify-between text-xs"
                        >
                          <div className="truncate pr-2 min-w-0 flex-1">
                            <div className="font-medium text-[#F5F7FA] group-hover:text-[#A3FF70] truncate text-[11px]">
                              {tmpl.name}
                            </div>
                            <div className="font-mono text-[10px] text-[#9CA3AF] truncate">
                              {tmpl.content}
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              insertTemplate(tmpl);
                            }}
                            title={tmpl.content}
                            className="p-1 rounded bg-[#111318] group-hover:bg-[#A3FF70] text-[#A3FF70] group-hover:text-[#111318] border border-[#303744] shrink-0 transition-colors"
                          >
                            <ArrowDownLeft size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* CATEGORY DROPDOWN VIEW */
        <div className="space-y-2.5">
          <TemplateCategoryMenu
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={selectCategory}
          />

          {currentSubcategories.length > 0 && (
            <TemplateSubcategoryMenu
              subcategories={currentSubcategories}
              selectedSubcategoryId={selectedSubcategoryId}
              onSelectSubcategory={selectSubcategory}
            />
          )}

          <TemplateList
            templates={currentTemplates}
            selectedTemplateId={selectedTemplate?.id}
            onSelectTemplate={selectTemplate}
            onQuickInsert={insertTemplate}
          />
        </div>
      )}
    </div>
  );
};
