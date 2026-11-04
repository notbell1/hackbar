import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/stores/appStore';
import { getAllCategories } from '../registry/category-registry';
import { TextTemplate, TemplateSubcategory, TemplateCategory } from '../types/template';
import { insertContentIntoEditor } from '../editor/editor-adapter';
import {
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Check,
  Search,
  Sparkles,
  Play,
  Lock,
  Star,
  Database,
  Table,
  Grid,
  FileText,
  Link2,
  Syringe,
  FlaskConical,
  X,
  Code,
  ArrowDownLeft,
  Eye,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Cpu,
  Globe,
  Folder,
  FileCode,
  MoreHorizontal
} from 'lucide-react';
import { searchTemplates } from '../registry/template-registry';
import { generateUnionColumns, generateOrderColumns, applyCommentSuffix } from '../categories/union-based/generator';
import { generateWafUnionColumns, generateWafOrderColumns } from '../categories/waf-based/generator';
import { UnionColumnPromptModal } from './UnionColumnPromptModal';
import { TemplateConfigModal } from './TemplateConfigModal';
import { DiosSignatureModal } from './DiosSignatureModal';
import { SubcategoryTemplateDropdown } from './SubcategoryTemplateDropdown';
import { QuickConversionBar } from './QuickConversionBar';
import { formatTemplateTooltip } from '../utils/tooltip-formatter';

interface ClassicSubcategoryItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface ClassicMenuGroup {
  groupId: string;
  items: ClassicSubcategoryItem[];
}

// 4 Kelompok Menu Klasik HackBar untuk Union Based & WAF Based
const UNION_BASED_CLASSIC_GROUPS: ClassicMenuGroup[] = [
  {
    groupId: 'group-1',
    items: [
      { id: 'order', label: 'Column count', icon: <Play size={11} className="text-[#10B981] fill-[#10B981]" /> },
      { id: 'union', label: 'Union statement', icon: <Play size={11} className="text-[#38BDF8] fill-[#38BDF8]" /> }
    ]
  },
  {
    groupId: 'group-2',
    items: [
      { id: 'basic-statements', label: 'Basic statements', icon: <Star size={11} className="text-[#F59E0B] fill-[#F59E0B]" /> }
    ]
  },
  {
    groupId: 'group-3',
    items: [
      { id: 'database', label: 'Databases', icon: <Database size={11} className="text-[#EF4444]" /> },
      { id: 'tables', label: 'Tables', icon: <Table size={11} className="text-[#EF4444]" /> },
      { id: 'column', label: 'Columns', icon: <Grid size={11} className="text-[#EF4444]" /> },
      { id: 'data', label: 'Dump Data', icon: <FileText size={11} className="text-[#EF4444]" /> },
      { id: 'join', label: 'Join Method', icon: <Link2 size={11} className="text-[#EC4899]" /> }
    ]
  },
  {
    groupId: 'group-4',
    items: [
      { id: 'local-dios', label: 'Local Dios', icon: <Lock size={11} className="text-[#A855F7]" /> },
      { id: 'local-var-dios', label: 'Local Variable Dios', icon: <Sparkles size={11} className="text-[#10B981]" /> },
      { id: 'dios-mysql', label: 'DIOS MySQL', icon: <Syringe size={11} className="text-[#EF4444]" /> },
      { id: 'dios-postgre', label: 'DIOS PostgreSQL', icon: <Syringe size={11} className="text-[#EF4444]" /> },
      { id: 'dios-mssql', label: 'DIOS MSSQL', icon: <Syringe size={11} className="text-[#EF4444]" /> },
      { id: 'var-method', label: 'VARIABLE METHODS', icon: <FlaskConical size={11} className="text-[#F43F5E]" /> }
    ]
  }
];

export const TemplateMenuBar: React.FC = () => {
  const { isSyncWithTab, setIsSyncWithTab } = useAppStore();
  const categories = getAllCategories();
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [openUpwards, setOpenUpwards] = useState<boolean>(false);
  const [dropdownLeftOffset, setDropdownLeftOffset] = useState<number>(0);
  const [dropdownMaxHeight, setDropdownMaxHeight] = useState<number>(360);
  const [expandedSubcategoryId, setExpandedSubcategoryId] = useState<string | null>(null);
  const [recentlyInsertedId, setRecentlyInsertedId] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [promptTemplate, setPromptTemplate] = useState<TextTemplate | null>(null);
  const [promptSubcategoryId, setPromptSubcategoryId] = useState<string | null>(null);
  const [configModalTemplate, setConfigModalTemplate] = useState<TextTemplate | null>(null);
  const [diosModalTemplate, setDiosModalTemplate] = useState<TextTemplate | null>(null);

  const isDiosTemplate = (tmpl: TextTemplate, subId?: string) => {
    return (
      subId === 'dios-mysql' ||
      tmpl.id.includes('dios-mysql') ||
      tmpl.id.includes('sig-nttbell') ||
      tmpl.id.includes('custom-author') ||
      Boolean(tmpl.group && tmpl.group.includes('Signatures'))
    );
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement | null>(null);

  const updateDropdownGeometry = (buttonEl: HTMLButtonElement) => {
    const rect = buttonEl.getBoundingClientRect();
    const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;

    const spaceBelow = viewportHeight - rect.bottom - 14;
    const spaceAbove = rect.top - 14;

    // Only open upwards if space below is very tight (< 200px) and there is ample space above (> 200px)
    const shouldOpenUpwards = spaceBelow < 200 && spaceAbove > spaceBelow && spaceAbove > 200;
    setOpenUpwards(shouldOpenUpwards);

    // Constrain maxHeight strictly within available viewport space so borders never get cut off
    const availableHeight = shouldOpenUpwards
      ? Math.max(140, spaceAbove - 10)
      : Math.max(140, spaceBelow - 10);
    setDropdownMaxHeight(Math.min(520, Math.floor(availableHeight)));

    // Calculate horizontal offset so dropdown never overflows right or left viewport edge
    const dropdownWidth = Math.min(325, viewportWidth - 14);
    let leftOffset = 0;

    if (rect.left + dropdownWidth > viewportWidth - 8) {
      const rightAlignedOffset = rect.width - dropdownWidth;
      if (rect.left + rightAlignedOffset >= 8) {
        leftOffset = rightAlignedOffset;
      } else {
        leftOffset = Math.max(8 - rect.left, viewportWidth - 8 - dropdownWidth - rect.left);
      }
    }
    setDropdownLeftOffset(leftOffset);
  };

  // Close dropdown on outside click or ESC, and recalculate max-height on window resize
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenCategoryId(null);
        setExpandedSubcategoryId(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (expandedSubcategoryId) {
          setExpandedSubcategoryId(null);
        } else {
          setOpenCategoryId(null);
          setShowSearchModal(false);
        }
      }
    };

    const handleResize = () => {
      if (activeButtonRef.current) {
        updateDropdownGeometry(activeButtonRef.current);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleToggleCategory = (catId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (openCategoryId === catId) {
      setOpenCategoryId(null);
      setExpandedSubcategoryId(null);
      activeButtonRef.current = null;
    } else {
      activeButtonRef.current = event.currentTarget;
      updateDropdownGeometry(event.currentTarget);
      setOpenCategoryId(catId);
      setExpandedSubcategoryId(null);
    }
  };

  // Reset scroll position to top when switching between subcategories and templates view
  useEffect(() => {
    if (activeButtonRef.current) {
      const dropdownEl = activeButtonRef.current.parentElement?.querySelector('.overflow-y-auto') as HTMLElement | null;
      if (dropdownEl) {
        dropdownEl.scrollTop = 0;
      }
    }
  }, [expandedSubcategoryId, openCategoryId]);

  const handleInsert = (template: TextTemplate) => {
    const success = insertContentIntoEditor(template.content);
    if (success) {
      setRecentlyInsertedId(template.id);
      setTimeout(() => setRecentlyInsertedId(null), 1800);
    }
  };

  const openColumnPrompt = (tmpl: TextTemplate, subId: string) => {
    setPromptTemplate(tmpl);
    setPromptSubcategoryId(subId);
  };

  const handleConfirmColumnPrompt = (count: number, commentSuffix?: string) => {
    if (promptTemplate) {
      const isOrder =
        promptSubcategoryId === 'order' ||
        promptTemplate.id.includes('col-count');

      let generated = isOrder
        ? (promptTemplate.id.startsWith('waf-')
            ? generateWafOrderColumns(promptTemplate.id, count)
            : generateOrderColumns(promptTemplate.id, count))
        : (promptTemplate.id.startsWith('waf-')
            ? generateWafUnionColumns(promptTemplate.id, count)
            : generateUnionColumns(promptTemplate.id, count));

      if (commentSuffix && commentSuffix !== 'none') {
        generated = applyCommentSuffix(generated, commentSuffix);
      }

      handleInsert({
        ...promptTemplate,
        content: generated
      });
      setPromptTemplate(null);
      setPromptSubcategoryId(null);
    }
  };

  const getTemplateItemIcon = (tmplId: string) => {
    if (tmplId.includes('user-database-version') || tmplId.includes('count-databases')) {
      return <Star size={11} className="text-[#EF4444] fill-[#EF4444]/60 shrink-0" />;
    }
    if (tmplId.includes('privilege')) {
      return <Database size={11} className="text-[#9CA3AF] shrink-0" />;
    }
    if (tmplId.includes('get-running-query')) {
      return <Eye size={11} className="text-[#38BDF8] shrink-0" />;
    }
    return null;
  };

  const searchResults = searchQuery.trim() ? searchTemplates(searchQuery) : [];

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'sql-basic':
        return <Database size={11} className="text-[#38BDF8]" />;
      case 'union-based':
        return <Play size={11} className="text-[#A3FF70] fill-[#A3FF70]" />;
      case 'waf-based':
        return <Shield size={11} className="text-[#F59E0B]" />;
      case 'waf-bypass':
        return <ShieldAlert size={11} className="text-[#EF4444]" />;
      case 'out-file':
        return <FileText size={11} className="text-[#EC4899]" />;
      case 'custom-based':
        return <Code size={11} className="text-[#A855F7]" />;
      case 'error-double':
        return <AlertTriangle size={11} className="text-[#F97316]" />;
      case 'ldap-fuzz':
        return <Cpu size={11} className="text-[#06B6D4]" />;
      case 'xss':
        return <Globe size={11} className="text-[#EAB308]" />;
      case 'lfi':
        return <Folder size={11} className="text-[#14B8A6]" />;
      case 'encryption':
        return <Lock size={11} className="text-[#6366F1]" />;
      case 'links':
        return <Link2 size={11} className="text-[#3B82F6]" />;
      case 'html':
        return <FileCode size={11} className="text-[#10B981]" />;
      case 'other':
      default:
        return <MoreHorizontal size={11} className="text-[#9CA3AF]" />;
    }
  };

  const getCategoryShortLabel = (id: string, defaultLabel: string): string => {
    switch (id) {
      case 'sql-basic':
        return 'SQL';
      case 'union-based':
        return 'UNION';
      case 'waf-based':
        return 'WAF';
      case 'waf-bypass':
        return 'BYPASS';
      case 'out-file':
        return 'OUTFILE';
      case 'custom-based':
        return 'CUSTOM';
      case 'error-double':
        return 'ERROR';
      case 'ldap-fuzz':
        return 'LDAP';
      case 'xss':
        return 'XSS';
      case 'lfi':
        return 'LFI';
      case 'encryption':
        return 'ENCRYPT';
      case 'links':
        return 'LINKS';
      case 'html':
        return 'HTML';
      case 'other':
        return 'OTHER';
      default:
        return defaultLabel;
    }
  };

  const renderCategory = (cat: TemplateCategory) => {
    const isOpen = openCategoryId === cat.id;
    const shortLabel = getCategoryShortLabel(cat.id, cat.label);

    return (
      <div key={cat.id} className={`relative flex-1 min-w-0 ${isOpen ? 'z-50' : 'z-10'}`}>
        {/* Category Tab Button with distinct border boundary & tooltip */}
        <button
          type="button"
          title={cat.label}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            setShowSearchModal(false);
            handleToggleCategory(cat.id, e);
          }}
          className={`w-full flex items-center justify-center space-x-1 px-1 py-1 rounded border text-[11px] font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer ${
            isOpen
              ? isSyncWithTab
                ? 'text-[#A3FF70] bg-[#16291E] border-[#A3FF70] shadow-[0_0_12px_rgba(163,255,112,0.45)]'
                : 'text-[#EF4444] bg-[#291319] border-[#EF4444] shadow-[0_0_12px_rgba(239,68,68,0.45)]'
              : isSyncWithTab
              ? 'text-[#A3FF70] bg-[#0F1614] border-[#A3FF70]/40 shadow-[0_0_6px_rgba(163,255,112,0.18)] hover:text-[#B6FF8F] hover:bg-[#152B1E] hover:border-[#A3FF70] hover:shadow-[0_0_10px_rgba(163,255,112,0.4)]'
              : 'text-[#EF4444] bg-[#120F13] border-[#441E24] shadow-none hover:text-[#FF7070] hover:bg-[#201217] hover:border-[#EF4444]/70 hover:shadow-[0_0_8px_rgba(239,68,68,0.3)]'
          }`}
        >
          {/* Icon only on small screens; hidden on wider screens where text label is visible */}
          <span className="shrink-0 min-[500px]:hidden">{getCategoryIcon(cat.id)}</span>
          <span className="hidden min-[660px]:inline truncate">{cat.label}</span>
          <span className="hidden min-[500px]:inline min-[660px]:hidden truncate">{shortLabel}</span>
          <ChevronDown
            size={10}
            className={`transition-transform duration-200 shrink-0 ${
              isOpen
                ? isSyncWithTab
                  ? 'rotate-180 text-[#A3FF70]'
                  : 'rotate-180 text-[#EF4444]'
                : isSyncWithTab
                ? 'text-[#A3FF70]'
                : 'text-[#EF4444]'
            }`}
          />
        </button>

              {/* Classic HackBar Dropdown Menu with fixed width & smart upward/downward/horizontal positioning */}
              {isOpen && (() => {
                const activeSubcategory = expandedSubcategoryId
                  ? cat.subcategories.find((s) => s.id === expandedSubcategoryId)
                  : null;
                const classicItem = expandedSubcategoryId
                  ? UNION_BASED_CLASSIC_GROUPS.flatMap((g) => g.items).find((i) => i.id === expandedSubcategoryId)
                  : null;
                const activeIcon = classicItem?.icon || <Code size={12} className="text-[#38BDF8] shrink-0" />;
                const activeLabel = classicItem?.label || activeSubcategory?.label || 'Templates';

                return (
                  <div
                    style={{
                      left: `${dropdownLeftOffset}px`,
                      maxHeight: `${dropdownMaxHeight}px`
                    }}
                    className={`absolute ${
                      openUpwards ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
                    } bg-[#0A0D13] border-2 ${
                      isSyncWithTab
                        ? 'border-[#A3FF70] shadow-[0_0_25px_rgba(163,255,112,0.25)]'
                        : 'border-[#EF4444] shadow-[0_0_25px_rgba(239,68,68,0.25)]'
                    } rounded-md w-[325px] max-w-[calc(100vw-14px)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#252B37] py-1.5 px-1 z-50 animate-fadeIn`}
                  >
                    {/* LEVEL 2: DRILL-DOWN TEMPLATE VIEW (No elements pushing each other!) */}
                    {activeSubcategory ? (
                      <div className="flex flex-col space-y-1 animate-fadeIn">
                        {/* Top Sticky-Style Header with Back Button */}
                        <div className="flex items-center justify-between px-2 py-1.5 border-b border-[#1E2532] bg-[#0E131C] rounded select-none">
                          <button
                            type="button"
                            onClick={() => setExpandedSubcategoryId(null)}
                            className="flex items-center space-x-1 text-xs text-[#9CA3AF] hover:text-[#A3FF70] px-1.5 py-0.5 rounded hover:bg-[#151D28] transition-colors cursor-pointer group"
                            title="Kembali ke daftar subkategori"
                          >
                            <ArrowLeft size={12} className="text-[#9CA3AF] group-hover:text-[#A3FF70] transition-colors" />
                            <span className="font-semibold text-[11px]">Kembali</span>
                          </button>

                          <div className="flex items-center space-x-1.5 min-w-0 pr-1 truncate">
                            <span className="shrink-0">{activeIcon}</span>
                            <span className="font-bold text-[11px] text-[#A3FF70] truncate">{activeLabel}</span>
                            <span className="text-[9px] font-mono font-bold text-[#64748B] shrink-0">
                              ({activeSubcategory.templates.length})
                            </span>
                          </div>
                        </div>

                        {/* Templates List */}
                        <div className="pt-0.5">
                          {activeSubcategory.templates.some((t) => t.group) || activeSubcategory.templates.length > 6 ? (
                            <SubcategoryTemplateDropdown
                              templates={activeSubcategory.templates}
                              recentlyInsertedId={recentlyInsertedId}
                              onSelectTemplate={(tmpl) => {
                                if (activeSubcategory.id === 'union' || activeSubcategory.id === 'order') {
                                  openColumnPrompt(tmpl, activeSubcategory.id);
                                } else if (isDiosTemplate(tmpl, activeSubcategory.id)) {
                                  setDiosModalTemplate(tmpl);
                                } else if (tmpl.parameters && tmpl.parameters.length > 0) {
                                  setConfigModalTemplate(tmpl);
                                } else {
                                  handleInsert(tmpl);
                                }
                              }}
                            />
                          ) : (
                            <div className="space-y-1">
                              {activeSubcategory.templates.map((tmpl) => {
                                const isInserted = recentlyInsertedId === tmpl.id;
                                const itemIcon = getTemplateItemIcon(tmpl.id);
                                const hasDividerBefore =
                                  tmpl.id.includes('privileges-is') ||
                                  tmpl.id.includes('privileges-check');

                                return (
                                  <React.Fragment key={tmpl.id}>
                                    {hasDividerBefore && (
                                      <div className="border-b border-[#252B37] my-1" />
                                    )}
                                    <div
                                      onClick={() => {
                                        if (activeSubcategory.id === 'union' || activeSubcategory.id === 'order') {
                                          openColumnPrompt(tmpl, activeSubcategory.id);
                                        } else if (isDiosTemplate(tmpl, activeSubcategory.id)) {
                                          setDiosModalTemplate(tmpl);
                                        } else if (tmpl.parameters && tmpl.parameters.length > 0) {
                                          setConfigModalTemplate(tmpl);
                                        } else {
                                          handleInsert(tmpl);
                                        }
                                      }}
                                      title={formatTemplateTooltip(tmpl.description, tmpl.content)}
                                      className={`px-2 py-1.5 rounded cursor-pointer transition-all border text-xs group flex items-center justify-between gap-2 ${
                                        isInserted
                                          ? 'bg-[#A3FF70]/20 border-[#A3FF70] text-[#A3FF70]'
                                          : 'bg-[#12161F] hover:bg-[#1A222E] border-[#252B37] hover:border-[#A3FF70]/50 text-[#F5F7FA]'
                                      }`}
                                    >
                                      <div className="flex items-center space-x-1.5 truncate min-w-0 flex-1">
                                        {itemIcon}
                                        <span
                                          className={`font-semibold text-[11px] truncate min-w-0 flex-1 ${
                                            itemIcon
                                              ? 'text-[#EF4444] group-hover:text-[#A3FF70]'
                                              : 'text-[#F5F7FA] group-hover:text-[#A3FF70]'
                                          }`}
                                        >
                                          {tmpl.name}
                                        </span>
                                      </div>

                                      <div className="flex items-center space-x-1 shrink-0">
                                        {isInserted ? (
                                          <span title="Inserted successfully" className="text-[9px] font-bold text-[#A3FF70] flex items-center space-x-0.5">
                                            <Check size={9} />
                                            <span>OK</span>
                                          </span>
                                        ) : (
                                          <span title="Click to insert snippet" className="text-[#6B7280] group-hover:text-[#A3FF70] transition-colors">
                                            <ArrowDownLeft size={11} />
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </React.Fragment>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* LEVEL 1: SUBCATEGORIES LIST VIEW */
                      cat.id === 'union-based' || cat.id === 'waf-based' ? (
                        <div>
                          {UNION_BASED_CLASSIC_GROUPS.map((group, groupIdx) => {
                            return (
                              <React.Fragment key={group.groupId}>
                                {groupIdx > 0 && (
                                  <div className="border-b border-[#252B37] my-1" />
                                )}
                                <div className="space-y-0.5">
                                  {group.items.map((item) => {
                                    const sub = cat.subcategories.find((s) => s.id === item.id);

                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        id={`sub-btn-${item.id}`}
                                        title={item.label}
                                        onClick={() => setExpandedSubcategoryId(item.id)}
                                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer text-[#E2E8F0] hover:text-[#A3FF70] hover:bg-[#151D28] group"
                                      >
                                        <div className="flex items-center space-x-2 truncate min-w-0 flex-1">
                                          <span className="shrink-0">{item.icon}</span>
                                          <span className="truncate tracking-wide text-left font-medium">{item.label}</span>
                                        </div>

                                        <div className="flex items-center space-x-1 shrink-0 text-[#6B7280] ml-1.5">
                                          <span className="text-[9px] font-mono text-[#94A3B8]">
                                            ({sub?.templates.length || 0})
                                          </span>
                                          <ChevronRight
                                            size={11}
                                            className="text-[#64748B] group-hover:text-[#A3FF70] transition-colors"
                                          />
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          {cat.subcategories.map((sub: TemplateSubcategory) => (
                            <button
                              key={sub.id}
                              type="button"
                              id={`sub-btn-${sub.id}`}
                              title={sub.label}
                              onClick={() => setExpandedSubcategoryId(sub.id)}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer text-[#E2E8F0] hover:text-[#A3FF70] hover:bg-[#151D28] group"
                            >
                              <div className="flex items-center space-x-2 truncate min-w-0 flex-1">
                                <Code size={11} className="text-[#38BDF8] shrink-0" />
                                <span className="truncate tracking-wide text-left font-medium">{sub.label}</span>
                              </div>

                              <div className="flex items-center space-x-1 shrink-0 text-[#6B7280] ml-1.5">
                                <span className="text-[9px] font-mono text-[#94A3B8]">
                                  ({sub.templates.length})
                                </span>
                                <ChevronRight
                                  size={11}
                                  className="text-[#64748B] group-hover:text-[#A3FF70] transition-colors"
                                />
                              </div>
                            </button>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                );
              })()}
            </div>
    );
  };

  const row1CategoryIds = ['sql-basic', 'union-based', 'waf-based', 'waf-bypass', 'out-file'];
  const row2CategoryIds = ['custom-based', 'error-double', 'ldap-fuzz', 'xss', 'lfi'];
  const row3CategoryIds = ['encryption', 'links', 'html', 'other'];

  const isRow1Active = Boolean(openCategoryId && row1CategoryIds.includes(openCategoryId));
  const isRow2Active = Boolean(openCategoryId && row2CategoryIds.includes(openCategoryId));
  const isRow3Active = Boolean(openCategoryId && row3CategoryIds.includes(openCategoryId));

  return (
    <div ref={containerRef} className="relative bg-[#090B0E] border-b border-[#252B37] select-none z-40">
      {/* Category Tabs: Strictly 3 Rows for Proper Layout & Zero Clipping */}
      <div className="flex flex-col text-xs w-full">
        {/* Row 1: HackBar Star Indicator (Sync Tab Status) + 5 Categories */}
        <div className={`flex items-center gap-1 w-full px-1.5 pt-1.5 pb-0.5 ${isRow1Active ? 'z-30 relative' : 'z-10 relative'}`}>
          <button
            type="button"
            onClick={() => setIsSyncWithTab(!isSyncWithTab)}
            title={
              isSyncWithTab
                ? 'Sync Tab: ON (Connected) - Click to toggle'
                : 'Sync Tab: OFF (Disconnected) - Click to toggle'
            }
            className={`flex items-center justify-center space-x-1 font-mono font-bold px-2 py-1 rounded shrink-0 shadow-sm transition-all cursor-pointer border ${
              isSyncWithTab
                ? 'text-[#A3FF70] bg-[#11141C] border-[#A3FF70]/50 hover:border-[#A3FF70] shadow-[0_0_8px_rgba(163,255,112,0.3)]'
                : 'text-[#EF4444] bg-[#11141C] border-[#EF4444]/50 hover:border-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.3)]'
            }`}
          >
            <span
              className={`text-sm ${
                isSyncWithTab ? 'text-[#A3FF70] animate-pulse' : 'text-[#EF4444]'
              }`}
            >
              ★
            </span>
          </button>

          {categories.slice(0, 5).map(renderCategory)}
        </div>

        {/* Row 2: 5 Categories */}
        <div className={`flex items-center gap-1 w-full px-1.5 py-0.5 ${isRow2Active ? 'z-30 relative' : 'z-10 relative'}`}>
          {categories.slice(5, 10).map(renderCategory)}
        </div>

        {/* Row 3: Remaining 5 Categories + Find Button */}
        <div className={`flex items-center gap-1 w-full px-1.5 pt-0.5 pb-1.5 ${isRow3Active ? 'z-30 relative' : 'z-10 relative'}`}>
          {categories.slice(10, 15).map(renderCategory)}

          {/* Global Quick Search Pill */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setShowSearchModal(!showSearchModal);
              setOpenCategoryId(null);
            }}
            title="Search all templates"
            className={`flex items-center justify-center space-x-1 px-2 py-1 rounded text-[11px] font-bold border transition-all shrink-0 shadow-sm cursor-pointer ${
              showSearchModal
                ? isSyncWithTab
                  ? 'bg-[#A3FF70] text-[#0A0D13] border-[#A3FF70] shadow-[0_0_8px_rgba(163,255,112,0.35)]'
                  : 'bg-[#EF4444] text-[#0A0D13] border-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.35)]'
                : isSyncWithTab
                ? 'text-[#A3FF70] hover:text-[#B6FF8F] bg-[#0F1614] hover:bg-[#152B1E] border-[#A3FF70]/40 hover:border-[#A3FF70] shadow-[0_0_6px_rgba(163,255,112,0.18)]'
                : 'text-[#EF4444] hover:text-[#FF7070] bg-[#120F13] hover:bg-[#201217] border-[#441E24] hover:border-[#EF4444]/70 shadow-none'
            }`}
          >
            <Search size={11} className="shrink-0" />
            <span className="hidden min-[680px]:inline">Find</span>
          </button>
        </div>
      </div>

      {/* Quick Conversion Bar (Classic HackBar Bidirectional Encode / Decode Bar) */}
      <QuickConversionBar />

      {/* Quick Search Modal Overlay */}
      {showSearchModal && (
        <div className="absolute top-full left-2 right-2 mt-1 bg-[#0A0D13] border-2 border-[#A3FF70] rounded-md shadow-2xl p-2.5 z-50 max-h-80 overflow-y-auto animate-fadeIn space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-[#252B37]">
            <span className="text-xs font-bold text-[#A3FF70]">Search All Templates</span>
            <button
              onClick={() => setShowSearchModal(false)}
              className="text-[#9CA3AF] hover:text-[#EF4444]"
            >
              <X size={13} />
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type keyword e.g. UNION, ORDER, SELECT..."
              className="w-full bg-[#12161F] border border-[#252B37] focus:border-[#A3FF70] text-[#F5F7FA] text-xs rounded px-2.5 py-1.5 focus:outline-none font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-[#9CA3AF] hover:text-[#F5F7FA]"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {searchQuery.trim() && (
            <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
              {searchResults.length === 0 ? (
                <div className="text-center py-4 text-xs text-[#9CA3AF]">
                  No matching templates found for "{searchQuery}".
                </div>
              ) : (
                searchResults.map((res) => (
                  <div
                    key={res.template.id}
                    onClick={() => handleInsert(res.template)}
                    title={res.template.name}
                    className="p-1.5 rounded bg-[#12161F] hover:bg-[#1A222E] border border-[#252B37] hover:border-[#A3FF70] cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="truncate pr-2 min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className="font-semibold text-xs text-[#F5F7FA] truncate"
                        >
                          {res.template.name}
                        </span>
                        <span className="text-[9px] bg-[#1E2530] text-[#38BDF8] px-1 py-0.2 rounded font-mono shrink-0">
                          {res.category.label}
                        </span>
                      </div>
                      <div
                        className="font-mono text-[10px] text-[#A3FF70] truncate pt-0.5"
                      >
                        {res.template.content}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          res.subcategory.id === 'union' ||
                          res.subcategory.id === 'order' ||
                          res.template.id.includes('col-count')
                        ) {
                          openColumnPrompt(res.template, res.subcategory.id);
                        } else if (isDiosTemplate(res.template, res.subcategory.id)) {
                          setShowSearchModal(false);
                          setDiosModalTemplate(res.template);
                        } else {
                          handleInsert(res.template);
                        }
                      }}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#A3FF70] text-[#0A0D13] shrink-0"
                    >
                      Insert
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Classic HackBar Union & Column Count Prompt Modal */}
      <UnionColumnPromptModal
        isOpen={promptTemplate !== null}
        defaultCount={10}
        templateName={promptTemplate?.name}
        templateId={promptTemplate?.id}
        promptLabel={
          promptSubcategoryId === 'order' || promptTemplate?.id.includes('col-count')
            ? 'Amount of columns to test for Column Count (e.g. 10)'
            : 'Amount of columns to use in the UNION SELECT Statement'
        }
        onConfirm={handleConfirmColumnPrompt}
        onCancel={() => {
          setPromptTemplate(null);
          setPromptSubcategoryId(null);
        }}
      />

      {/* Parameterized Template Configuration & Preview Modal (Tables, Column, etc.) */}
      <TemplateConfigModal
        isOpen={configModalTemplate !== null}
        template={configModalTemplate}
        onInsert={handleInsert}
        onClose={() => setConfigModalTemplate(null)}
      />

      {/* Dynamic DIOS Signature & Watermark Configurator Modal */}
      <DiosSignatureModal
        isOpen={diosModalTemplate !== null}
        template={diosModalTemplate}
        onConfirm={(finalContent) => {
          if (diosModalTemplate) {
            handleInsert({
              ...diosModalTemplate,
              content: finalContent
            });
            setDiosModalTemplate(null);
          }
        }}
        onCancel={() => setDiosModalTemplate(null)}
      />
    </div>
  );
};
