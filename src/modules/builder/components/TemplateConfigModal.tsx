import React, { useState, useEffect } from 'react';
import { TextTemplate } from '../types/template';
import { TemplateParameterForm } from './TemplateParameterForm';
import {
  createInitialParameterValues,
  updateParameterValue,
  resetParameterValue,
  resetAllParameterValues,
  resolveTemplateContent
} from '../utils/parameter-utils';
import { X, Eye, ArrowDownLeft, Copy, Check, Code2 } from 'lucide-react';

interface TemplateConfigModalProps {
  isOpen: boolean;
  template: TextTemplate | null;
  onInsert: (template: TextTemplate) => void;
  onClose: () => void;
}

export const TemplateConfigModal: React.FC<TemplateConfigModalProps> = ({
  isOpen,
  template,
  onInsert,
  onClose
}) => {
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (template) {
      setParamValues(createInitialParameterValues(template.parameters));
      setShowPreview(true);
      setCopied(false);
    }
  }, [template?.id]);

  if (!isOpen || !template) {
    return null;
  }

  const hasParameters = Boolean(template.parameters && template.parameters.length > 0);
  const resolvedContent = resolveTemplateContent(template, paramValues);

  const handleChangeParameter = (paramId: string, value: string) => {
    setParamValues((prev) => updateParameterValue(prev, paramId, value));
  };

  const handleResetParameter = (paramId: string) => {
    setParamValues((prev) => resetParameterValue(prev, template.parameters, paramId));
  };

  const handleResetAll = () => {
    setParamValues(resetAllParameterValues(template.parameters));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resolvedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[360px] bg-[#111318] border-2 border-[#A3FF70] rounded-lg shadow-[0_0_25px_rgba(163,255,112,0.25)] overflow-hidden text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#191D24] border-b border-[#303744]">
          <div className="flex items-center space-x-2 min-w-0">
            <Code2 size={14} className="text-[#A3FF70] shrink-0" />
            <div className="truncate">
              <div className="font-bold text-xs text-[#F5F7FA] truncate">
                {template.name}
              </div>
              {template.description && (
                <div className="text-[10px] text-[#9CA3AF] truncate">
                  {template.description}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#EF4444] p-0.5 rounded transition-colors cursor-pointer shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="p-3.5 space-y-3">
          {/* Parameter Configuration Form */}
          {hasParameters && template.parameters && (
            <TemplateParameterForm
              parameters={template.parameters}
              values={paramValues}
              onChangeParameter={handleChangeParameter}
              onResetParameter={handleResetParameter}
              onResetAll={handleResetAll}
            />
          )}

          {/* Synchronized Preview Area */}
          {showPreview && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-[#9CA3AF]">
                <span className="font-semibold uppercase tracking-wider text-[#A3FF70]">
                  Template Preview
                </span>
              </div>

              <div className="bg-[#191D24] border border-[#303744] rounded-md p-2.5 font-mono text-[11px] text-[#A3FF70] whitespace-pre-wrap break-all max-h-36 overflow-y-auto">
                {resolvedContent ? (
                  resolvedContent
                ) : (
                  <span className="text-[#9CA3AF] italic">
                    (Empty template content — manually enter text in configuration file)
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions: Preview, Copy, Insert */}
        <div className="px-3.5 py-2.5 bg-[#191D24] border-t border-[#303744] flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => setShowPreview((prev) => !prev)}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                showPreview
                  ? 'bg-[#202630] text-[#A3FF70] border-[#A3FF70]/40'
                  : 'bg-[#202630] text-[#9CA3AF] hover:text-[#F5F7FA] border-[#303744]'
              }`}
            >
              <Eye size={11} />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center space-x-1 px-2 py-1 rounded text-[11px] bg-[#202630] hover:bg-[#303744] text-[#9CA3AF] hover:text-[#F5F7FA] border border-[#303744] transition-colors cursor-pointer"
            >
              {copied ? <Check size={11} className="text-[#22C55E]" /> : <Copy size={11} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 rounded text-[11px] text-[#9CA3AF] hover:text-[#F5F7FA] bg-[#202630] border border-[#303744] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {
                onInsert({
                  ...template,
                  content: resolvedContent
                });
                onClose();
              }}
              className="flex items-center space-x-1 px-3 py-1 rounded text-[11px] font-bold bg-[#A3FF70] hover:bg-[#8ee85c] text-[#111318] transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <ArrowDownLeft size={12} />
              <span>Insert</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
