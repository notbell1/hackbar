import React, { useState, useEffect, useRef, useMemo } from 'react';
import { HelpCircle, X, Check } from 'lucide-react';
import {
  generateUnionColumns,
  generateOrderColumns,
  applyCommentSuffix
} from '../categories/union-based/generator';
import {
  generateWafUnionColumns,
  generateWafOrderColumns
} from '../categories/waf-based/generator';

interface UnionColumnPromptModalProps {
  isOpen: boolean;
  defaultCount?: number;
  templateName?: string;
  templateId?: string;
  promptLabel?: string;
  onConfirm: (count: number, commentSuffix?: string) => void;
  onCancel: () => void;
}

interface SuffixOption {
  id: string;
  label: string;
  tooltip: string;
}

interface SuffixGroup {
  title: string;
  options: SuffixOption[];
}

const SUFFIX_GROUPS: SuffixGroup[] = [
  {
    title: 'Komentar Dasar',
    options: [
      { id: 'none', label: 'None', tooltip: 'Tanpa komentar tambahan (Default)' },
      { id: '--+', label: '--+', tooltip: 'URL-Safe space comment (MySQL/MSSQL)' },
      { id: '-- -', label: '-- -', tooltip: 'ANSI SQL standard comment' },
      { id: '#', label: '#', tooltip: 'MySQL raw hash comment' },
      { id: '%23', label: '%23', tooltip: 'MySQL URL-encoded hash comment' },
      { id: '/*', label: '/*', tooltip: 'Block comment terminator' }
    ]
  },
  {
    title: 'Context Closer (String / Kurung)',
    options: [
      { id: "'--+", label: "'--+", tooltip: "Penutup kutip tunggal ('--+)" },
      { id: '"--+', label: '"--+', tooltip: 'Penutup kutip ganda ("--+)' },
      { id: "')--+", label: "')--+", tooltip: "Penutup kutip & kurung (')--+)" },
      { id: '")--+', label: '")--+', tooltip: 'Penutup kutip ganda & kurung (")--+)' },
      { id: '))--+', label: '))--+', tooltip: 'Penutup kurung bersarang ())]--+)' }
    ]
  },
  {
    title: 'Ordering & WAF Bypass',
    options: [
      { id: 'ASC --+', label: 'ASC --+', tooltip: 'Pengurutan Ascending + Comment' },
      { id: 'DESC --+', label: 'DESC --+', tooltip: 'Pengurutan Descending + Comment' },
      { id: '%23%0A', label: '%23%0A', tooltip: 'MySQL Hash + Newline (%0A) bypass' },
      { id: ';%00', label: ';%00', tooltip: 'Null byte string terminator' },
      { id: 'custom', label: 'Custom', tooltip: 'Kustom karakter komentar bebas' }
    ]
  }
];

export const UnionColumnPromptModal: React.FC<UnionColumnPromptModalProps> = ({
  isOpen,
  defaultCount = 10,
  templateName,
  templateId,
  promptLabel,
  onConfirm,
  onCancel
}) => {
  const [countInput, setCountInput] = useState<string>(String(defaultCount));
  const [selectedSuffix, setSelectedSuffix] = useState<string>('none');
  const [customSuffix, setCustomSuffix] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCountInput(String(defaultCount));
      setSelectedSuffix('none');
      setCustomSuffix('');
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
    }
  }, [isOpen, defaultCount]);

  // Compute live statement preview based on current count and selected comment suffix
  const previewStatement = useMemo(() => {
    if (!templateId) return '';
    const parsed = parseInt(countInput, 10);
    const cnt = isNaN(parsed) || parsed < 1 ? defaultCount : Math.min(parsed, 500);

    const isOrder =
      templateId.includes('order') ||
      templateId.includes('col-count') ||
      templateId.includes('group');

    const raw = isOrder
      ? templateId.startsWith('waf-')
        ? generateWafOrderColumns(templateId, cnt)
        : generateOrderColumns(templateId, cnt)
      : templateId.startsWith('waf-')
      ? generateWafUnionColumns(templateId, cnt)
      : generateUnionColumns(templateId, cnt);

    const activeSuffix = selectedSuffix === 'custom' ? customSuffix : selectedSuffix;
    return applyCommentSuffix(raw, activeSuffix);
  }, [templateId, countInput, defaultCount, selectedSuffix, customSuffix]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsed = parseInt(countInput, 10);
    const finalCount = isNaN(parsed) || parsed < 1 ? defaultCount : parsed;
    const finalSuffix = selectedSuffix === 'custom' ? customSuffix.trim() : selectedSuffix;
    onConfirm(finalCount, finalSuffix);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  const handleToggleSuffix = (optId: string) => {
    if (selectedSuffix === optId && optId !== 'none') {
      // Uncheck / toggle back to none
      setSelectedSuffix('none');
    } else {
      setSelectedSuffix(optId);
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn select-none"
    >
      <div className="bg-[#191D24] border-2 border-[#A3FF70] rounded-lg shadow-[0_0_30px_rgba(163,255,112,0.3)] w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden text-[#F5F7FA]">
        {/* Header bar matching [JavaScript Application] */}
        <div className="bg-[#111318] border-b border-[#303744] px-3 py-1.5 flex items-center justify-between shrink-0">
          <span className="text-xs font-mono font-bold text-[#A3FF70]">
            [JavaScript Application]
          </span>
          <button
            type="button"
            onClick={onCancel}
            className="text-[#9CA3AF] hover:text-[#EF4444] transition-colors p-0.5 rounded cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>

        {/* Dialog Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-[#252B37]">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 bg-[#38BDF8]/20 text-[#38BDF8] rounded-full shrink-0 mt-0.5">
              <HelpCircle size={22} className="fill-[#38BDF8] text-[#111318]" />
            </div>

            <div className="space-y-0.5 min-w-0 flex-1">
              <label htmlFor="union-column-input" className="text-xs font-medium text-[#F5F7FA] block leading-snug">
                {promptLabel || 'Amount of columns to use in the statement'}
              </label>
              {templateName && (
                <div className="text-[10px] text-[#38BDF8] font-mono truncate">
                  {templateName}
                </div>
              )}
            </div>
          </div>

          {/* Number Input Box */}
          <div className="pt-0.5">
            <input
              id="union-column-input"
              ref={inputRef}
              type="number"
              min={1}
              max={500}
              value={countInput}
              onChange={(e) => setCountInput(e.target.value)}
              className="w-full bg-[#111318] border border-[#38BDF8] focus:border-[#A3FF70] text-[#A3FF70] font-mono text-sm font-bold rounded px-2.5 py-1.5 focus:outline-none shadow-inner"
            />
          </div>

          {/* Optional Comment Suffix Section with Categorized Groups */}
          <div className="space-y-2 pt-1 border-t border-[#252B37]">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#9CA3AF] font-medium">Comment Suffix (Opsional):</span>
              <span className="text-[10px] text-[#6B7280]">Centang salah satu untuk menambahkan</span>
            </div>

            {/* Groups */}
            <div className="space-y-2">
              {SUFFIX_GROUPS.map((grp) => (
                <div key={grp.title} className="space-y-1">
                  <span className="text-[10px] text-[#6B7280] font-semibold uppercase tracking-wider block">
                    {grp.title}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {grp.options.map((opt) => {
                      const isChecked = selectedSuffix === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          title={opt.tooltip}
                          onClick={() => handleToggleSuffix(opt.id)}
                          className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] min-[400px]:text-[11px] font-mono font-bold border transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-[#A3FF70]/15 text-[#A3FF70] border-[#A3FF70] shadow-[0_0_8px_rgba(163,255,112,0.3)]'
                              : 'bg-[#11141C] text-[#9CA3AF] hover:text-[#F5F7FA] border-[#2D3646] hover:border-[#4A5568]'
                          }`}
                        >
                          {isChecked && <Check size={10} className="text-[#A3FF70]" />}
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Suffix Input when 'custom' is checked */}
            {selectedSuffix === 'custom' && (
              <div className="pt-1 animate-fadeIn">
                <input
                  type="text"
                  placeholder="Ketik suffix kustom, misal: ')--+ atau ;%00"
                  value={customSuffix}
                  onChange={(e) => setCustomSuffix(e.target.value)}
                  className="w-full bg-[#111318] border border-[#A3FF70] text-[#A3FF70] font-mono text-xs rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Live Preview Box */}
          {previewStatement && (
            <div className="p-2 rounded bg-[#0D1017] border border-[#252B37] space-y-1">
              <span className="text-[10px] text-[#6B7280] font-mono block">Preview Statement:</span>
              <div className="font-mono text-[11px] text-[#A3FF70] break-all max-h-16 overflow-y-auto leading-relaxed select-text">
                {previewStatement}
              </div>
            </div>
          )}

          {/* Action Buttons: [OK] and [Cancel] */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#303744]/60">
            <button
              type="submit"
              className="px-5 py-1 rounded bg-[#A3FF70] hover:bg-[#86efac] text-[#111318] text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              OK
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-1 rounded bg-[#202630] hover:bg-[#303744] text-[#F5F7FA] text-xs font-medium border border-[#303744] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
