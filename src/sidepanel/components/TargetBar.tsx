import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAppStore } from '@/stores/appStore';
import { Play, Loader2, Zap, Send, X, Copy, Check, ChevronDown, Undo2, Redo2 } from 'lucide-react';
import { useEditorInsertion } from '@/modules/builder/hooks/useEditorInsertion';
import { cursorManager } from '@/modules/builder/editor/cursor-manager';
import { SyncTabAlertModal } from './SyncTabAlertModal';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

export const TargetBar: React.FC = () => {
  const {
    url,
    setUrl,
    method,
    setMethod,
    sendRequest,
    isLoading,
    isSyncWithTab,
    setIsSyncWithTab,
    toastMessage
  } = useAppStore();

  const [copied, setCopied] = useState(false);
  const [showSyncAlert, setShowSyncAlert] = useState(false);
  const [isMethodDropdownOpen, setIsMethodDropdownOpen] = useState(false);
  const methodDropdownRef = useRef<HTMLDivElement>(null);

  // Close method dropdown on click outside or ESC
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (methodDropdownRef.current && !methodDropdownRef.current.contains(e.target as Node)) {
        setIsMethodDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMethodDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Hook up cursor tracking for the Target URL textarea
  const {
    textareaRef,
    handleFocus,
    handleSelect,
    handleKeyUp,
    handleMouseUp
  } = useEditorInsertion('target-url-editor', 'Target URL', () => url, setUrl);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<string[]>([url]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isUndoRedoRef = useRef<boolean>(false);
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number }>({ start: 0, end: 0 });

  // Synchronize selection changes from cursorManager (e.g. when template is inserted and selection collapses)
  useEffect(() => {
    return cursorManager.onSelectionChange((range) => {
      setSelectionRange(range);
    });
  }, []);

  // Update history on URL changes (debounced for continuous typing, immediate for bulk template inserts/conversions)
  useEffect(() => {
    // If selection was collapsed in DOM, ensure state is collapsed
    if (textareaRef.current && textareaRef.current.selectionStart === textareaRef.current.selectionEnd) {
      setSelectionRange({
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd
      });
    }

    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false;
      return;
    }

    if (history[historyIndex] === url) return;

    const timer = setTimeout(() => {
      setHistory((prev) => {
        if (prev[historyIndex] === url) return prev;
        const next = prev.slice(0, historyIndex + 1);
        next.push(url);
        if (next.length > 50) next.shift();
        return next;
      });
      setHistoryIndex((prev) => {
        if (history[prev] === url) return prev;
        return Math.min(prev + 1, 49);
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [url, historyIndex, history]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIdx = historyIndex - 1;
    const prevVal = history[newIdx];
    isUndoRedoRef.current = true;
    setHistoryIndex(newIdx);
    setUrl(prevVal);
    if (textareaRef.current) {
      textareaRef.current.value = prevVal;
      textareaRef.current.focus();
    }
  }, [history, historyIndex, setUrl, textareaRef]);

  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const newIdx = historyIndex + 1;
    const nextVal = history[newIdx];
    isUndoRedoRef.current = true;
    setHistoryIndex(newIdx);
    setUrl(nextVal);
    if (textareaRef.current) {
      textareaRef.current.value = nextVal;
      textareaRef.current.focus();
    }
  }, [history, historyIndex, setUrl, textareaRef]);

  const handleSelectText = useCallback(() => {
    handleSelect();
    if (textareaRef.current) {
      const s = textareaRef.current.selectionStart;
      const e = textareaRef.current.selectionEnd;
      setSelectionRange({ start: s, end: e });
      cursorManager.updateSelection(s, e);
    }
  }, [handleSelect, textareaRef]);

  const handleExecute = () => {
    if (!url.trim() || isLoading) return;

    if (!isSyncWithTab) {
      setShowSyncAlert(true);
      return;
    }

    sendRequest({ forceSyncTab: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Keyboard shortcuts for Undo and Redo
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        handleRedo();
      } else {
        handleUndo();
      }
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      handleRedo();
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleExecute();
    }
  };

  const handleCopyUrl = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getMethodColor = (m: string) => {
    switch (m) {
      case 'GET':
        return 'text-[#22C55E] border-[#22C55E]/40 bg-[#22C55E]/10';
      case 'POST':
        return 'text-[#38BDF8] border-[#38BDF8]/40 bg-[#38BDF8]/10';
      case 'PUT':
      case 'PATCH':
        return 'text-[#F59E0B] border-[#F59E0B]/40 bg-[#F59E0B]/10';
      case 'DELETE':
        return 'text-[#EF4444] border-[#EF4444]/40 bg-[#EF4444]/10';
      default:
        return 'text-[#A3FF70] border-[#A3FF70]/40 bg-[#A3FF70]/10';
    }
  };

  return (
    <div className="bg-[#191D24] border-b border-[#303744] flex flex-col shrink-0 select-none">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="bg-[#A3FF70]/15 text-[#A3FF70] border-b border-[#A3FF70]/30 px-3 py-1 text-[11px] font-mono flex items-center justify-between animate-fadeIn">
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Control Bar (Method, Sync Toggle, Action Buttons) */}
      <div className="px-3 pt-2 pb-1.5 flex items-center justify-between border-b border-[#202630]/60 gap-2">
        {/* Left Side: Method & Sync Toggle */}
        <div className="flex items-center space-x-2">
          {/* Custom Method Dropdown */}
          <div ref={methodDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsMethodDropdownOpen((prev) => !prev)}
              title="Select HTTP Method"
              className={`border rounded-md px-2.5 py-1 text-xs font-mono font-bold flex items-center space-x-1.5 focus:outline-none focus:ring-1 focus:ring-[#A3FF70] cursor-pointer transition-all shadow-sm ${getMethodColor(
                method
              )}`}
            >
              <span>{method}</span>
              <ChevronDown
                size={11}
                className={`transition-transform duration-200 ${
                  isMethodDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isMethodDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 z-50 bg-[#0A0D13] border border-[#A3FF70]/60 rounded-md shadow-[0_8px_25px_rgba(0,0,0,0.85)] py-1 min-w-[110px] animate-fadeIn">
                {HTTP_METHODS.map((m) => {
                  const isSelected = method === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setMethod(m);
                        setIsMethodDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs font-mono font-bold flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-[#A3FF70]/15 text-[#A3FF70]'
                          : 'text-[#F5F7FA] hover:bg-[#1A222E] hover:text-[#A3FF70]'
                      }`}
                    >
                      <span
                        className={
                          m === 'GET'
                            ? 'text-[#22C55E]'
                            : m === 'POST'
                            ? 'text-[#38BDF8]'
                            : m === 'DELETE'
                            ? 'text-[#EF4444]'
                            : 'text-[#F59E0B]'
                        }
                      >
                        {m}
                      </span>
                      {isSelected && <Check size={11} className="text-[#A3FF70]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sync Tab Toggle Button */}
          <button
            onClick={() => setIsSyncWithTab(!isSyncWithTab)}
            title={
              isSyncWithTab
                ? 'Sync Tab is ON: Execution will navigate/submit directly in your active Chrome tab'
                : 'Sync Tab is OFF: Request runs purely in background fetch'
            }
            className={`flex items-center space-x-1 text-[11px] font-medium px-2 py-1 rounded-md border transition-all ${
              isSyncWithTab
                ? 'bg-[#A3FF70]/15 text-[#A3FF70] border-[#A3FF70]/40 shadow-sm'
                : 'bg-[#202630] text-[#9CA3AF] border-[#303744] hover:text-[#F5F7FA]'
            }`}
          >
            <Zap size={12} className={isSyncWithTab ? 'fill-[#A3FF70]' : ''} />
            <span>Sync Tab: {isSyncWithTab ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Right Side: Primary Execution Buttons */}
        <div className="flex items-center space-x-1.5">
          {/* Secondary: Silent Fetch Only Button */}
          <button
            onClick={() => sendRequest({ skipSyncTab: true })}
            disabled={isLoading || !url.trim()}
            title="Fetch only in Side Panel without navigating active browser tab"
            className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-md bg-[#202630] hover:bg-[#303744] text-[#9CA3AF] hover:text-[#38BDF8] border border-[#303744] transition-colors disabled:opacity-40"
          >
            <Send size={12} />
            <span className="hidden sm:inline">Fetch</span>
          </button>

          {/* Primary: Execute Button */}
          <button
            onClick={handleExecute}
            disabled={isLoading || !url.trim()}
            title="Execute request (syncs with active tab when Sync Tab is ON)"
            className="flex items-center space-x-1.5 bg-[#A3FF70] hover:bg-[#8ee85c] disabled:opacity-50 text-[#111318] font-bold text-xs px-3.5 py-1 rounded-md transition-all shadow-sm active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Running</span>
              </>
            ) : (
              <>
                <Play size={12} className="fill-[#111318]" />
                <span>Execute</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Full-Width Spacious URL Input Area (No overlap from action buttons) */}
      {(() => {
        const hasSelection = selectionRange.start !== selectionRange.end && selectionRange.end <= url.length;
        const selectedSnippet = hasSelection ? url.substring(selectionRange.start, selectionRange.end) : '';

        return (
          <div className="p-2 relative flex flex-col space-y-1">
            <div className="relative w-full rounded-lg overflow-hidden border border-[#303744] hover:border-[#4a5568] focus-within:border-[#A3FF70] transition-colors shadow-inner bg-[#111318]">
              {/* Visual Selection Backdrop: Keeps highlighted block visible even when textarea blurs or modules are clicked */}
              {hasSelection && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 px-2.5 py-1.5 text-xs font-mono leading-relaxed break-all whitespace-pre-wrap select-none pointer-events-none overflow-hidden text-transparent z-0"
                  style={{ minHeight: '52px', maxHeight: '180px' }}
                >
                  <span>{url.substring(0, selectionRange.start)}</span>
                  <mark className="bg-[#A3FF70]/30 text-transparent border border-[#A3FF70] rounded-xs shadow-[0_0_8px_rgba(163,255,112,0.45)]">
                    {url.substring(selectionRange.start, selectionRange.end)}
                  </mark>
                  <span>{url.substring(selectionRange.end)}</span>
                </div>
              )}

              <textarea
                ref={textareaRef}
                rows={2}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onSelect={handleSelectText}
                onKeyUp={() => {
                  handleKeyUp();
                  handleSelectText();
                }}
                onMouseUp={() => {
                  handleMouseUp();
                  handleSelectText();
                }}
                placeholder="https://example-vuln.com/slug/resource?id=10"
                className="w-full relative z-10 bg-transparent px-2.5 py-1.5 text-xs font-mono text-[#F5F7FA] focus:outline-none resize-y leading-relaxed break-all"
                style={{ minHeight: '52px', maxHeight: '180px' }}
              />
            </div>

            {/* Compact Dynamic Status & Action Strip Below Textarea */}
            <div className="flex items-center justify-between px-1 text-[10px] text-[#9CA3AF]">
              <div className="flex items-center space-x-1.5 truncate">
                <span className="font-mono text-[#6B7280]">Target URL</span>
                {url.trim() && (
                  <span className="text-[#38BDF8] font-mono truncate max-w-[130px] sm:max-w-[180px]">
                    {(() => {
                      try {
                        return new URL(url).hostname;
                      } catch {
                        return '';
                      }
                    })()}
                  </span>
                )}

                {/* Live Visual Selection Block Tag */}
                {hasSelection && (
                  <div
                    title="Active cursor selection block (retained across module clicks)"
                    className="flex items-center space-x-1 bg-[#A3FF70]/15 border border-[#A3FF70]/40 rounded px-1.5 py-0.5 text-[10px] text-[#A3FF70] font-mono shrink-0 shadow-sm animate-fadeIn"
                  >
                    <span className="font-bold">Block [{selectionRange.start}:{selectionRange.end}]:</span>
                    <span className="truncate max-w-[110px] font-semibold text-[#F5F7FA]">
                      "{selectedSnippet}"
                    </span>
                    <button
                      type="button"
                      title="Clear selection"
                      onClick={() => {
                        setSelectionRange({ start: 0, end: 0 });
                        if (textareaRef.current) {
                          textareaRef.current.setSelectionRange(url.length, url.length);
                          cursorManager.updateSelection(url.length, url.length);
                        }
                      }}
                      className="hover:text-[#EF4444] transition-colors ml-0.5 cursor-pointer"
                    >
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-1 shrink-0">
                {/* Undo Button */}
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={!canUndo}
                  title="Undo URL change (Ctrl + Z)"
                  className="flex items-center space-x-0.5 px-1.5 py-0.5 rounded bg-[#202630] hover:bg-[#303744] text-[#9CA3AF] hover:text-[#A3FF70] border border-[#303744] hover:border-[#A3FF70]/50 transition-all cursor-pointer font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Undo2 size={10} />
                  <span className="hidden min-[480px]:inline">Undo</span>
                </button>

                {/* Redo Button */}
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={!canRedo}
                  title="Redo URL change (Ctrl + Y or Ctrl + Shift + Z)"
                  className="flex items-center space-x-0.5 px-1.5 py-0.5 rounded bg-[#202630] hover:bg-[#303744] text-[#9CA3AF] hover:text-[#A3FF70] border border-[#303744] hover:border-[#A3FF70]/50 transition-all cursor-pointer font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Redo2 size={10} />
                  <span className="hidden min-[480px]:inline">Redo</span>
                </button>

                <span className="font-mono text-[#6B7280]">{url.length} chars</span>

                {/* Copy Button */}
                <button
                  onClick={handleCopyUrl}
                  title="Copy entire URL text"
                  className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-[#202630] hover:bg-[#303744] text-[#9CA3AF] hover:text-[#A3FF70] border border-[#303744] hover:border-[#A3FF70]/50 transition-all cursor-pointer font-medium"
                >
                  {copied ? (
                    <Check size={10} className="text-[#22C55E]" />
                  ) : (
                    <Copy size={10} />
                  )}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                {/* Clear Button */}
                {url.trim() && (
                  <button
                    onClick={() => {
                      setUrl('');
                      cursorManager.updateSelection(0, 0);
                      setSelectionRange({ start: 0, end: 0 });
                    }}
                    title="Clear URL input"
                    className="flex items-center space-x-0.5 px-1.5 py-0.5 rounded bg-[#202630] hover:bg-[#EF4444]/20 text-[#9CA3AF] hover:text-[#EF4444] border border-[#303744] transition-all cursor-pointer"
                  >
                    <X size={10} />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Sync Tab Inactive Alert Modal */}
      <SyncTabAlertModal
        isOpen={showSyncAlert}
        onEnableAndExecute={() => {
          setIsSyncWithTab(true);
          setShowSyncAlert(false);
          sendRequest({ forceSyncTab: true });
        }}
        onExecuteWithoutSync={() => {
          setShowSyncAlert(false);
          sendRequest({ skipSyncTab: true });
        }}
        onClose={() => setShowSyncAlert(false)}
      />
    </div>
  );
};
