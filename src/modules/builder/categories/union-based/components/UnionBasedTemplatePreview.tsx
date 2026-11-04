import React, { useState, useEffect } from 'react';
import { BuilderTemplate } from '../types';
import { Copy, Check, ArrowDownLeft, Code2, Eye } from 'lucide-react';
import { TemplateParameterForm } from '../../../components/TemplateParameterForm';
import {
  createInitialParameterValues,
  updateParameterValue,
  resetParameterValue,
  resetAllParameterValues,
  resolveTemplateContent
} from '../../../utils/parameter-utils';

interface UnionBasedTemplatePreviewProps {
  template: BuilderTemplate | null;
  onInsert: (template: BuilderTemplate) => void;
}

export const UnionBasedTemplatePreview: React.FC<UnionBasedTemplatePreviewProps> = ({
  template,
  onInsert
}) => {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});

  useEffect(() => {
    setParamValues(createInitialParameterValues(template?.parameters));
    setShowPreview(true);
  }, [template?.id]);

  if (!template) {
    return (
      <div className="p-3 text-center text-xs text-[#9CA3AF] border border-dashed border-[#303744] rounded-lg">
        Select a template to view details and preview.
      </div>
    );
  }

  const hasParameters = Boolean(template.parameters && template.parameters.length > 0);
  const resolvedContent = resolveTemplateContent(template, paramValues);

  const handleCopy = () => {
    navigator.clipboard.writeText(resolvedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    <div className="bg-[#111318] border border-[#303744] rounded-lg p-3 space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center space-x-1.5">
            <Code2 size={13} className="text-[#38BDF8]" />
            <span className="font-semibold text-xs text-[#F5F7FA]">{template.name}</span>
          </div>
          {template.description && (
            <p className="text-[11px] text-[#9CA3AF] pt-0.5">{template.description}</p>
          )}
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowPreview((prev) => !prev)}
            className={`flex items-center space-x-1 text-[10px] px-2 py-1 rounded border transition-colors cursor-pointer ${
              showPreview
                ? 'bg-[#202630] text-[#A3FF70] border-[#A3FF70]/40'
                : 'bg-[#202630] text-[#9CA3AF] hover:text-[#F5F7FA] border-[#303744]'
            }`}
            title="Preview stored template text"
          >
            <Eye size={11} />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center space-x-1 text-[10px] text-[#9CA3AF] hover:text-[#F5F7FA] px-2 py-1 rounded bg-[#202630] border border-[#303744] transition-colors cursor-pointer"
            title="Copy template content"
          >
            {copied ? <Check size={11} className="text-[#A3FF70]" /> : <Copy size={11} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onInsert({
                ...template,
                content: resolvedContent
              })
            }
            className="flex items-center space-x-1 text-[10px] font-semibold text-[#111318] bg-[#A3FF70] hover:bg-[#86efac] px-2 py-1 rounded transition-colors cursor-pointer"
            title="Insert into active cursor position"
          >
            <ArrowDownLeft size={11} />
            <span>Insert</span>
          </button>
        </div>
      </div>

      {/* Reusable Parameter Input Form */}
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
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-[#9CA3AF]">
            <span>Stored Template Text</span>
          </div>
          <pre className="font-mono text-xs text-[#A3FF70] bg-[#191D24] border border-[#303744] rounded p-2.5 overflow-x-auto whitespace-pre-wrap break-all max-h-36">
            {resolvedContent ? (
              resolvedContent
            ) : (
              <span className="text-[#9CA3AF] italic">
                (Empty template content — manually enter text in configuration file)
              </span>
            )}
          </pre>
        </div>
      )}
    </div>
  );
};
