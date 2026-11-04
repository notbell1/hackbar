/**
 * XEOO HACKBAR — Security Testing & HTTP Inspection Chrome Extension
 * 
 * @module DiosSignatureModal
 * @author Zone Xploiter / ZXMarchia
 * @license MIT
 * @description Interactive Modal component allowing users to customize DIOS author watermarks and preview rendered HTML hex output.
 */

import React, { useState, useEffect } from 'react';
import {
  DiosSignatureColor,
  DIOS_SIGNATURE_OPTIONS,
  generateDiosHeader,
  injectDiosSignature
} from '../utils/dios-generator';
import { X, Sparkles, Copy, Check, Terminal, Eye, ArrowRight } from 'lucide-react';
import { TextTemplate } from '../types/template';

interface DiosSignatureModalProps {
  isOpen: boolean;
  template: TextTemplate | null;
  onConfirm: (finalContent: string) => void;
  onCancel: () => void;
}

export const DiosSignatureModal: React.FC<DiosSignatureModalProps> = ({
  isOpen,
  template,
  onConfirm,
  onCancel
}) => {
  const [authorName, setAuthorName] = useState<string>('ZXMarchia');
  const [selectedStyle, setSelectedStyle] = useState<DiosSignatureColor>('green');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen || !template) {
    return null;
  }

  const { hex, htmlPreview } = generateDiosHeader(authorName, selectedStyle);
  const finalQuery = injectDiosSignature(template.content, authorName, selectedStyle);

  const handleCopy = () => {
    navigator.clipboard.writeText(finalQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleInsert = () => {
    onConfirm(finalQuery);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 animate-fadeIn"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[440px] bg-[#0E121A] border-2 border-[#A3FF70] rounded-xl shadow-[0_0_30px_rgba(163,255,112,0.25)] overflow-hidden text-xs flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#141A24] border-b border-[#252E3E]">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="p-1 rounded bg-[#1C2433] text-[#A3FF70] border border-[#A3FF70]/30 shrink-0">
              <Sparkles size={14} />
            </span>
            <div className="truncate">
              <div className="font-bold text-xs text-[#F5F7FA] truncate">
                {template.name}
              </div>
              <div className="text-[10px] text-[#A3FF70] font-mono">
                DIOS Signature & Watermark Configurator
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-[#9CA3AF] hover:text-[#EF4444] transition-colors p-1"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-3.5 space-y-3 overflow-y-auto">
          {/* Author Name Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10.5px] font-bold text-[#F5F7FA] uppercase tracking-wider">
                Author / Handle Name
              </label>
              <span className="text-[10px] text-[#9CA3AF]">Custom banner watermark</span>
            </div>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. NttBell, ZoneXploiter, Pongo"
              className="w-full bg-[#141A24] border border-[#2A3447] focus:border-[#A3FF70] rounded-lg px-3 py-1.5 text-xs text-[#F5F7FA] font-mono focus:outline-none transition-colors"
            />
          </div>

          {/* Color & Style Selection Pills */}
          <div className="space-y-1.5">
            <label className="text-[10.5px] font-bold text-[#F5F7FA] uppercase tracking-wider">
              Signature Style & Neon Glow
            </label>
            <div className="grid grid-cols-2 min-[380px]:grid-cols-3 gap-1.5">
              {DIOS_SIGNATURE_OPTIONS.map((opt) => {
                const isSelected = selectedStyle === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedStyle(opt.id)}
                    className={`flex items-center space-x-1.5 px-2 py-1.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1C2536] border-[#A3FF70] shadow-[0_0_8px_rgba(163,255,112,0.25)] text-[#F5F7FA]'
                        : 'bg-[#121620] border-[#222A3B] text-[#9CA3AF] hover:border-[#38455E] hover:text-[#F5F7FA]'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: opt.colorCode }}
                    />
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visual Reflected Preview */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1 text-[10.5px] font-bold text-[#9CA3AF] uppercase">
              <Eye size={12} />
              <span>Target Webpage Render Preview</span>
            </div>
            <div className="bg-[#080B10] border border-[#222A3B] rounded-lg p-2.5 min-h-[48px] flex items-center justify-center text-center font-sans">
              {selectedStyle === 'none' ? (
                <span className="text-[#6B7280] italic text-[11px]">
                  (No signature header — pure database dump only)
                </span>
              ) : selectedStyle === 'ascii' ? (
                <pre className="font-mono text-xs text-[#A3FF70] whitespace-pre-wrap select-all">
                  {htmlPreview}
                </pre>
              ) : (
                <div
                  className="text-xs select-all drop-shadow-md"
                  dangerouslySetInnerHTML={{ __html: htmlPreview }}
                />
              )}
            </div>
          </div>

          {/* Hex & SQL Query Preview */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10.5px] font-bold text-[#9CA3AF] uppercase">
              <div className="flex items-center space-x-1">
                <Terminal size={12} />
                <span>Generated SQL Query</span>
              </div>
              <span className="text-[9.5px] font-mono text-[#38BDF8]">
                Hex: {hex.slice(0, 14)}...
              </span>
            </div>
            <div className="relative group">
              <div className="bg-[#080B10] border border-[#202838] rounded-lg p-2.5 font-mono text-[10.5px] text-[#A3FF70] max-h-24 overflow-y-auto break-all leading-relaxed select-all">
                {finalQuery}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                title="Copy SQL to clipboard"
                className="absolute right-2 top-2 p-1 rounded bg-[#18202E] hover:bg-[#253247] text-[#A3FF70] border border-[#303E57] cursor-pointer transition-colors shadow-md"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#141A24] border-t border-[#252E3E]">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#9CA3AF] hover:text-[#F5F7FA] hover:bg-[#1E2636] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleInsert}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-[#A3FF70] hover:bg-[#B6FF8F] text-[#0A0D13] font-bold rounded-lg text-xs transition-all shadow-[0_0_12px_rgba(163,255,112,0.35)] active:scale-95 cursor-pointer"
          >
            <span>Insert DIOS</span>
            <ArrowRight size={13} className="stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};

