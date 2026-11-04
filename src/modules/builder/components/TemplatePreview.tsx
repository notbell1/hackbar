import React, { useState, useEffect } from 'react';
import { TextTemplate } from '../types/template';
import { ArrowDownLeft, Copy, Check, Eye, X } from 'lucide-react';
import { TemplateParameterForm } from './TemplateParameterForm';
import {
  createInitialParameterValues,
  updateParameterValue,
  resetParameterValue,
  resetAllParameterValues,
  resolveTemplateContent
} from '../utils/parameter-utils';

interface TemplatePreviewProps {
  template: TextTemplate | null;
  onInsert: (template: TextTemplate) => void;
  onClose?: () => void;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, onInsert, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});

  useEffect(() => {
    setParamValues(createInitialParameterValues(template?.parameters));
    setShowPreview(true);
  }, [template?.id]);

  if (!template) {
    return (
      <div className="p-2.5 rounded-lg bg-[#191D24] border border-[#303744] text-xs text-[#9CA3AF] text-center italic">
        Select a template from the list to preview content.
      </div>
    );
  }

  const hasParameters = Boolean(template.parameters && template.parameters.length > 0);
  const resolvedContent = resolveTemplateContent(template, paramValues);

  const handleCopy = () => {
    navigator.clipboard.writeText(resolvedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleChangeParameter = (paramId: string, value: string) => {
    setParamValues((prev) => updateParameterValue(prev, paramId, value));
  };

  const handleResetParameter = (paramId: string) => {
    setParamValues((prev) => resetParameterValue(prev, template.parameters, paramId));
  };

  const handleResetAll = () => {
    setParamValues(resetAllParameterValues(template.parameters));
  };

  return (
    <div className="bg-[#191D24] border border-[#303744] rounded-lg p-2.5 space-y-2 text-xs shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-[#F5F7FA] truncate">{template.name}</span>
            <span className="text-[9px] bg-[#A3FF70]/10 text-[#A3FF70] px-1.5 py-0.5 rounded border border-[#A3FF70]/30 font-medium">Preview</span>
          </div>
          {template.description && (
            <p className="text-[10px] text-[#9CA3AF] truncate mt-0.5">{template.description}</p>
          )}
        </div>

        <div className="flex items-center space-x-1 shrink-0">
          <button
            type="button"
            onClick={() => setShowPreview((prev) => !prev)}
            title="Toggle template text preview"
            className={`flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
              showPreview
                ? 'bg-[#202630] text-[#A3FF70] border-[#A3FF70]/40'
                : 'bg-[#202630] text-[#9CA3AF] hover:text-[#F5F7FA] border-[#303744]'
            }`}
          >
            <Eye size={11} />
            <span className="hidden min-[420px]:inline">Preview</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            title="Copy content"
            className="flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded bg-[#202630] hover:bg-[#303744] text-[#9CA3AF] hover:text-[#F5F7FA] border border-[#303744] transition-colors cursor-pointer"
          >
            {copied ? <Check size={11} className="text-[#22C55E]" /> : <Copy size={11} />}
            <span className="hidden min-[420px]:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onInsert({
                ...template,
                content: resolvedContent
              })
            }
            title={`Insert into editor (${resolvedContent})`}
            className="flex items-center space-x-1 text-[11px] px-2.5 py-0.5 rounded bg-[#A3FF70] hover:bg-[#8ee85c] text-[#111318] font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <ArrowDownLeft size={11} />
            <span>Insert</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Close preview"
              className="p-1 rounded bg-[#202630] hover:bg-[#EF4444]/20 hover:text-[#EF4444] text-[#9CA3AF] border border-[#303744] transition-colors cursor-pointer ml-0.5"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Reusable Parameter Configuration Inputs */}
      {hasParameters && template.parameters && (
        <TemplateParameterForm
          parameters={template.parameters}
          values={paramValues}
          onChangeParameter={handleChangeParameter}
          onResetParameter={handleResetParameter}
          onResetAll={handleResetAll}
        />
      )}

      {/* Synchronized Plain-Text Preview Area */}
      {showPreview && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-[#9CA3AF]">
            <span>Stored Template Text Preview</span>
          </div>
          <div className="bg-[#111318] p-2 rounded-md font-mono text-[11px] text-[#A3FF70] whitespace-pre-wrap break-all border border-[#202630] max-h-24 overflow-y-auto">
            {resolvedContent ? (
              resolvedContent
            ) : (
              <span className="text-[#9CA3AF] italic">
                (Empty template content — manually enter text in the category configuration file)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
