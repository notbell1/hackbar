import React, { useState, useRef, useEffect } from 'react';
import { TemplateSubcategory } from '../types/template';
import { ChevronDown, Check, Layers, Sparkles } from 'lucide-react';

export interface SubcategoryGroup {
  id: string;
  name: string;
  tag: string;
  color: string;
  subcategoryIds: string[];
}

export const UNION_BASED_GROUPS: SubcategoryGroup[] = [
  {
    id: 'group-1',
    name: 'Kelompok 1: Order & Union',
    tag: 'Group 1',
    color: '#38BDF8',
    subcategoryIds: ['order', 'union']
  },
  {
    id: 'group-2',
    name: 'Kelompok 2: Basic Statement',
    tag: 'Group 2',
    color: '#A3FF70',
    subcategoryIds: ['basic-statements']
  },
  {
    id: 'group-3',
    name: 'Kelompok 3: Database, Tables, Column, Data & Join',
    tag: 'Group 3',
    color: '#F59E0B',
    subcategoryIds: ['database', 'tables', 'column', 'data', 'join']
  },
  {
    id: 'group-4',
    name: 'Kelompok 4: DIOS & Variable Methods',
    tag: 'Group 4',
    color: '#A855F7',
    subcategoryIds: [
      'local-dios',
      'local-var-dios',
      'dios-mysql',
      'dios-postgre',
      'dios-mssql',
      'var-method'
    ]
  }
];

interface CustomSubcategoryDropdownProps {
  categoryId: string;
  subcategories: TemplateSubcategory[];
  selectedSubcategoryId: string | null;
  onSelectSubcategory: (subcategoryId: string) => void;
}

export const CustomSubcategoryDropdown: React.FC<CustomSubcategoryDropdownProps> = ({
  categoryId,
  subcategories,
  selectedSubcategoryId,
  onSelectSubcategory
}) => {
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const [isSingleDropdownOpen, setIsSingleDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isUnionBased = categoryId === 'union-based';

  const currentSubcategory =
    subcategories.find((s) => s.id === selectedSubcategoryId) || subcategories[0];

  const currentGroup = isUnionBased
    ? UNION_BASED_GROUPS.find((g) => g.subcategoryIds.includes(currentSubcategory?.id || ''))
    : null;

  // Close open dropdown popovers on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenGroupId(null);
        setIsSingleDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenGroupId(null);
        setIsSingleDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelect = (id: string) => {
    onSelectSubcategory(id);
    setOpenGroupId(null);
    setIsSingleDropdownOpen(false);
  };

  /* =========================================================================
   * UNION BASED: 5 TAMPILAN KELOMPOK DROPDOWN INFORMATIF
   * ========================================================================= */
  if (isUnionBased) {
    return (
      <div ref={containerRef} className="space-y-2 select-none">
        {/* Header Informative Bar */}
        <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] px-0.5">
          <span className="flex items-center space-x-1.5">
            <Layers size={12} className="text-[#38BDF8]" />
            <span className="font-semibold text-[#F5F7FA]">5 Kelompok Dropdown Union Based</span>
          </span>
          <span className="text-[10px] text-[#6B7280]">
            Pilih subkategori dari kelompok di bawah
          </span>
        </div>

        {/* 5 Kelompok Dropdown Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
          {UNION_BASED_GROUPS.map((group) => {
            const groupSubs = subcategories.filter((s) =>
              group.subcategoryIds.includes(s.id)
            );
            if (groupSubs.length === 0) return null;

            const isGroupActive = group.subcategoryIds.includes(selectedSubcategoryId || '');
            const activeInGroup = groupSubs.find((s) => s.id === selectedSubcategoryId);
            const isThisOpen = openGroupId === group.id;

            return (
              <div key={group.id} className="relative">
                {/* Dropdown Button for each group */}
                <button
                  type="button"
                  onClick={() => setOpenGroupId(isThisOpen ? null : group.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition-all duration-200 shadow-sm ${
                    isGroupActive
                      ? 'bg-gradient-to-r from-[#17222B] to-[#121A21] border-[#A3FF70] shadow-[0_0_10px_rgba(163,255,112,0.18)]'
                      : isThisOpen
                      ? 'bg-[#1C222C] border-[#384152]'
                      : 'bg-[#14171E] hover:bg-[#191D26] border-[#2A3240] hover:border-[#384152]'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-1.5">
                    {/* Group Title with colored dot */}
                    <div className="flex items-center space-x-1.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor: group.color,
                          boxShadow: isGroupActive ? `0 0 6px ${group.color}` : 'none'
                        }}
                      />
                      <span
                        className="text-[11px] font-bold truncate tracking-wide"
                        style={{ color: isGroupActive ? '#F5F7FA' : group.color }}
                      >
                        {group.name}
                      </span>
                    </div>

                    {/* Subtitle / Active indicator */}
                    <div className="pt-0.5 truncate">
                      {isGroupActive && activeInGroup ? (
                        <span className="text-[10px] font-bold text-[#A3FF70] flex items-center space-x-1">
                          <Check size={10} className="shrink-0" />
                          <span className="truncate">{activeInGroup.label}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#6B7280] truncate block">
                          {groupSubs.map((s) => s.label).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right count + Chevron */}
                  <div className="flex items-center space-x-1 shrink-0">
                    <span className="text-[9px] font-mono bg-[#111318] text-[#9CA3AF] px-1 py-0.2 rounded border border-[#252B37]">
                      {groupSubs.length}
                    </span>
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${
                        isThisOpen
                          ? 'rotate-180 text-[#A3FF70]'
                          : isGroupActive
                          ? 'text-[#A3FF70]'
                          : 'text-[#9CA3AF]'
                      }`}
                    />
                  </div>
                </button>

                {/* Floating Menu Popover specifically for this group */}
                {isThisOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-[#14171F]/98 backdrop-blur-md border border-[#384152] rounded-lg shadow-2xl z-50 p-1 space-y-1 animate-fadeIn min-w-[200px]">
                    <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#9CA3AF] border-b border-[#202632] flex items-center justify-between">
                      <span style={{ color: group.color }}>{group.name}</span>
                      <span className="text-[#6B7280] font-mono">{groupSubs.length} subkategori</span>
                    </div>

                    <div className="space-y-0.5 pt-0.5">
                      {groupSubs.map((sub) => {
                        const isSelected = sub.id === selectedSubcategoryId;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => handleSelect(sub.id)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                              isSelected
                                ? 'bg-[#A3FF70]/15 text-[#A3FF70] font-bold border border-[#A3FF70]/40 shadow-sm'
                                : 'text-[#E5E7EB] hover:bg-[#202632] hover:text-[#A3FF70] border border-transparent'
                            }`}
                          >
                            <div className="flex items-center space-x-2 truncate">
                              {isSelected ? (
                                <Check size={11} className="text-[#A3FF70] shrink-0" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4B5563] shrink-0" />
                              )}
                              <span className="truncate">{sub.label}</span>
                            </div>

                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                                isSelected
                                  ? 'bg-[#A3FF70]/25 text-[#A3FF70] font-bold'
                                  : 'bg-[#111318] text-[#9CA3AF]'
                              }`}
                            >
                              {sub.templates.length}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Informative Current Selection Strip */}
        {currentSubcategory && currentGroup && (
          <div className="flex items-center justify-between bg-[#111318] border border-[#252B37] rounded-lg px-2.5 py-1 text-xs">
            <div className="flex items-center space-x-2 truncate">
              <span className="text-[10px] text-[#9CA3AF]">Subkategori Aktif:</span>
              <span className="font-bold text-[#A3FF70] truncate">{currentSubcategory.label}</span>
              <span
                className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded truncate"
                style={{
                  backgroundColor: `${currentGroup.color}20`,
                  color: currentGroup.color,
                  border: `1px solid ${currentGroup.color}40`
                }}
              >
                {currentGroup.name}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#38BDF8] shrink-0">
              {currentSubcategory.templates.length} template siap digunakan
            </span>
          </div>
        )}
      </div>
    );
  }

  /* =========================================================================
   * FALLBACK FOR OTHER CATEGORIES (STANDARD SINGLE LUXURY DROPDOWN)
   * ========================================================================= */
  return (
    <div ref={containerRef} className="relative w-full select-none">
      <button
        type="button"
        onClick={() => setIsSingleDropdownOpen(!isSingleDropdownOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all duration-200 shadow-sm ${
          isSingleDropdownOpen
            ? 'bg-gradient-to-r from-[#1C222C] to-[#171A21] border-[#A3FF70] shadow-[0_0_12px_rgba(163,255,112,0.18)]'
            : 'bg-gradient-to-r from-[#171B22] via-[#14171E] to-[#111318] border-[#303744] hover:border-[#A3FF70]/60 hover:bg-[#1A1F28]'
        }`}
      >
        <div className="flex items-center space-x-2 min-w-0 pr-2">
          <div className="p-1 rounded bg-[#202630] text-[#38BDF8] shrink-0">
            <Layers size={11} />
          </div>

          <div className="truncate">
            <span className="text-xs font-bold text-[#F5F7FA] tracking-wide">
              {currentSubcategory?.label || 'Select Subcategory'}
            </span>
          </div>

          {currentSubcategory && (
            <span className="text-[10px] font-mono bg-[#A3FF70]/15 text-[#A3FF70] border border-[#A3FF70]/30 px-1.5 py-0.2 rounded shrink-0">
              {currentSubcategory.templates.length} templates
            </span>
          )}
        </div>

        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            isSingleDropdownOpen ? 'rotate-180 text-[#A3FF70]' : 'text-[#9CA3AF]'
          }`}
        />
      </button>

      {isSingleDropdownOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#14171F]/98 backdrop-blur-md border border-[#384152] rounded-xl shadow-2xl z-50 p-1.5 space-y-1 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-[#303744] animate-fadeIn">
          <div className="flex items-center justify-between px-2 py-1 text-[10px] text-[#9CA3AF] border-b border-[#252B37]">
            <span className="flex items-center space-x-1">
              <Sparkles size={11} className="text-[#A3FF70]" />
              <span>Select Subcategory</span>
            </span>
            <span className="font-mono text-[#6B7280]">{subcategories.length} total</span>
          </div>

          <div className="space-y-1 pt-1">
            {subcategories.map((sub) => {
              const isSelected = sub.id === currentSubcategory?.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => handleSelect(sub.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    isSelected
                      ? 'bg-[#A3FF70]/15 text-[#A3FF70] font-bold border border-[#A3FF70]/40 shadow-sm'
                      : 'text-[#E5E7EB] hover:bg-[#1C222C] hover:text-[#A3FF70] border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    {isSelected ? (
                      <Check size={12} className="text-[#A3FF70] shrink-0" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#374151] shrink-0" />
                    )}
                    <span className="truncate">{sub.label}</span>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                      isSelected
                        ? 'bg-[#A3FF70]/25 text-[#A3FF70] font-bold'
                        : 'bg-[#191D24] text-[#9CA3AF]'
                    }`}
                  >
                    {sub.templates.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
