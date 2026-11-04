import React from 'react';
import { TemplateParameter } from '../types/template';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';

export interface TemplateParameterFormProps {
  parameters: TemplateParameter[];
  values: Record<string, string>;
  onChangeParameter: (paramId: string, value: string) => void;
  onResetParameter: (paramId: string) => void;
  onResetAll?: () => void;
}

export const TemplateParameterForm: React.FC<TemplateParameterFormProps> = ({
  parameters,
  values,
  onChangeParameter,
  onResetParameter,
  onResetAll
}) => {
  if (!parameters || parameters.length === 0) {
    return null;
  }

  const hasModifiedValues = parameters.some(
    (param) => (values[param.id] ?? '').trim() !== ''
  );

  return (
    <div className="bg-[#111318] border border-[#303744] rounded-md p-2.5 space-y-2 text-xs">
      <div className="flex items-center justify-between border-b border-[#202630] pb-1.5">
        <div className="flex items-center space-x-1.5 text-[#A3FF70] font-semibold text-[11px]">
          <SlidersHorizontal size={12} />
          <span>Parameters ({parameters.length})</span>
        </div>

        {onResetAll && hasModifiedValues && (
          <button
            type="button"
            onClick={onResetAll}
            title="Reset all parameters"
            className="flex items-center space-x-1 text-[10px] px-1.5 py-0.5 rounded bg-[#202630] hover:bg-[#303744] text-[#9CA3AF] hover:text-[#F5F7FA] border border-[#303744] transition-colors cursor-pointer"
          >
            <RotateCcw size={10} />
            <span>Reset All</span>
          </button>
        )}
      </div>

      <div className="space-y-2">
        {parameters.map((param) => {
          const currentValue = values[param.id] ?? '';
          const isModified = currentValue.trim() !== '';

          return (
            <div key={param.id} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <label
                  htmlFor={`template-param-${param.id}`}
                  className="font-medium text-[#F5F7FA]"
                >
                  {param.label}
                </label>
              </div>

              <div className="flex items-center space-x-1.5">
                <input
                  id={`template-param-${param.id}`}
                  type={param.inputType}
                  value={currentValue}
                  onChange={(e) => onChangeParameter(param.id, e.target.value)}
                  placeholder={param.defaultValue}
                  className="flex-1 bg-[#191D24] border border-[#303744] focus:border-[#A3FF70] rounded px-2.5 py-1 text-xs font-mono text-[#F5F7FA] placeholder-[#4B5563] focus:outline-none transition-colors"
                />

                <button
                  type="button"
                  onClick={() => onResetParameter(param.id)}
                  disabled={!isModified}
                  title={`Clear "${param.label}"`}
                  className="flex items-center space-x-1 px-2 py-1 rounded bg-[#202630] hover:bg-[#303744] disabled:opacity-40 text-[#9CA3AF] hover:text-[#A3FF70] border border-[#303744] text-[10px] transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed"
                >
                  <RotateCcw size={11} />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

