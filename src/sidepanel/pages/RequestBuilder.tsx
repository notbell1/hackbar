import React, { useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { StatusBadge } from '../components/StatusBadge';
import {
  Plus,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Zap,
  ExternalLink,
  Code,
  BookOpen
} from 'lucide-react';
import { detectWaf } from '@/core/security/headers';
import { useEditorInsertion } from '@/modules/builder/hooks/useEditorInsertion';
import { TemplateLibrary } from '@/modules/builder/components/TemplateLibrary';
import { TemplateMenuBar } from '@/modules/builder/components/TemplateMenuBar';

export const RequestBuilder: React.FC = () => {
  const {
    queryParams,
    updateQueryParam,
    addQueryParam,
    removeQueryParam,
    setQueryParams,
    headers,
    setHeaders,
    updateHeader,
    addHeader,
    removeHeader,
    bodyType,
    setBodyType,
    bodyContent,
    setBodyContent,
    response,
    isLoading,
    statusMessage,
    isSyncWithTab,
    executeInBrowserTab,
    authorizeCurrentOriginAndSend,
    setCurrentPage
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body' | 'templates' | 'response'>('params');
  const [responseViewMode, setResponseViewMode] = useState<'pretty' | 'raw' | 'headers'>('pretty');
  const [copied, setCopied] = useState(false);
  const [showInlineTemplatesInBody, setShowInlineTemplatesInBody] = useState(false);

  // Hook up cursor tracking for Request Body editor
  const {
    textareaRef: bodyTextareaRef,
    handleFocus: handleBodyFocus,
    handleSelect: handleBodySelect,
    handleKeyUp: handleBodyKeyUp,
    handleMouseUp: handleBodyMouseUp
  } = useEditorInsertion('request-body-editor', 'Request Body', () => bodyContent, setBodyContent);

  const handleCopyResponse = () => {
    if (!response?.body) return;
    navigator.clipboard.writeText(response.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatResponseBody = (body: string) => {
    if (responseViewMode === 'pretty') {
      try {
        const obj = JSON.parse(body);
        return JSON.stringify(obj, null, 2);
      } catch {
        return body;
      }
    }
    return body;
  };

  const formatJsonBody = () => {
    try {
      const obj = JSON.parse(bodyContent);
      setBodyContent(JSON.stringify(obj, null, 2));
    } catch {
      // ignore if invalid json
    }
  };

  const isScopeError = statusMessage?.toLowerCase().includes('scope');

  const applyBrowserHeadersPreset = () => {
    setHeaders([
      { id: '1', key: 'Accept', value: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8', enabled: true },
      { id: '2', key: 'Accept-Language', value: 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7', enabled: true },
      { id: '3', key: 'Sec-Fetch-Dest', value: 'document', enabled: true },
      { id: '4', key: 'Sec-Fetch-Mode', value: 'navigate', enabled: true },
      { id: '5', key: 'Sec-Fetch-Site', value: 'none', enabled: true },
      { id: '6', key: 'Sec-Ch-Ua', value: '"Chromium";v="128", "Not;A=Brand";v="24"', enabled: true },
      { id: '7', key: 'Sec-Ch-Ua-Mobile', value: '?0', enabled: true },
      { id: '8', key: 'Sec-Ch-Ua-Platform', value: '"Windows"', enabled: true }
    ]);
  };

  const wafInfo = response ? detectWaf(response.status, response.headers, response.body) : null;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#111318]">
      {/* 15-Category Quick Template Menu Bar (Always accessible directly in Builder) */}
      <TemplateMenuBar />

      {/* Sub-tabs: Strictly 1 Single Line */}
      <div className="flex items-center justify-between gap-1 border-b border-[#303744] bg-[#191D24] px-1.5 pt-0.5 select-none overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={() => setActiveTab('params')}
            title={`Query Parameters (${queryParams.length})`}
            className={`px-2 py-1 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'params'
                ? 'border-[#A3FF70] text-[#A3FF70]'
                : 'border-transparent text-[#9CA3AF] hover:text-[#F5F7FA]'
            }`}
          >
            <span className="hidden min-[480px]:inline">Params</span>
            <span className="min-[480px]:hidden">Param</span> ({queryParams.length})
          </button>
          <button
            onClick={() => setActiveTab('headers')}
            title={`Request Headers (${headers.length})`}
            className={`px-2 py-1 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'headers'
                ? 'border-[#A3FF70] text-[#A3FF70]'
                : 'border-transparent text-[#9CA3AF] hover:text-[#F5F7FA]'
            }`}
          >
            <span className="hidden min-[480px]:inline">Headers</span>
            <span className="min-[480px]:hidden">Head</span> ({headers.length})
          </button>
          <button
            onClick={() => setActiveTab('body')}
            title={`Request Body ${bodyType !== 'none' ? `(${bodyType})` : ''}`}
            className={`px-2 py-1 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'body'
                ? 'border-[#A3FF70] text-[#A3FF70]'
                : 'border-transparent text-[#9CA3AF] hover:text-[#F5F7FA]'
            }`}
          >
            <span>Body</span>
            {bodyType !== 'none' && (
              <span className="hidden sm:inline text-[10px] opacity-80"> ({bodyType})</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            title="Template Library"
            className={`px-2 py-1 text-xs font-medium border-b-2 transition-colors flex items-center space-x-1 whitespace-nowrap cursor-pointer ${
              activeTab === 'templates'
                ? 'border-[#A3FF70] text-[#A3FF70]'
                : 'border-transparent text-[#9CA3AF] hover:text-[#F5F7FA]'
            }`}
          >
            <BookOpen size={12} className="shrink-0" />
            <span className="hidden min-[480px]:inline">Templates</span>
          </button>
          <button
            onClick={() => setActiveTab('response')}
            title={`Response ${response ? `(${response.status})` : ''}`}
            className={`px-2 py-1 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'response'
                ? 'border-[#A3FF70] text-[#A3FF70]'
                : 'border-transparent text-[#9CA3AF] hover:text-[#F5F7FA]'
            }`}
          >
            <span>Response</span>
            {response && <span className="text-[10px] opacity-80"> ({response.status})</span>}
          </button>
        </div>

        {activeTab === 'response' && response && (
          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              onClick={() => executeInBrowserTab()}
              title="Navigate active browser tab to this URL"
              className="flex items-center space-x-1 text-[11px] text-[#A3FF70] hover:bg-[#202630] px-2 py-0.5 rounded border border-[#A3FF70]/30 transition-colors"
            >
              <ExternalLink size={11} />
              <span>Open in Tab</span>
            </button>
            <button
              onClick={handleCopyResponse}
              className="flex items-center space-x-1 text-[11px] text-[#9CA3AF] hover:text-[#F5F7FA] px-2 py-0.5 rounded bg-[#202630] border border-[#303744] transition-colors"
            >
              {copied ? <Check size={12} className="text-[#22C55E]" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* PARAMS TAB */}
        {activeTab === 'params' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9CA3AF] pb-1">
              <span>Query Parameters</span>
              <div className="flex items-center space-x-2">
                {queryParams.length > 0 && (
                  <button
                    onClick={() => setQueryParams([])}
                    className="text-[#9CA3AF] hover:text-[#EF4444] text-[11px]"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={addQueryParam}
                  className="flex items-center space-x-1 text-[#A3FF70] hover:underline"
                >
                  <Plus size={13} />
                  <span>Add Param</span>
                </button>
              </div>
            </div>

            {queryParams.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#9CA3AF] border border-dashed border-[#303744] rounded-lg">
                No query parameters attached to URL. Click <strong className="text-[#A3FF70]">Add Param</strong> to append key-value pairs.
              </div>
            ) : (
              <div className="space-y-1.5">
                {queryParams.map((param) => (
                  <div key={param.id} className="flex items-center space-x-1.5">
                    <input
                      type="checkbox"
                      checked={param.enabled}
                      onChange={(e) =>
                        updateQueryParam(param.id, param.key, param.value, e.target.checked)
                      }
                      className="rounded bg-[#202630] border-[#303744] text-[#A3FF70] focus:ring-0"
                    />
                    <input
                      type="text"
                      placeholder="Key"
                      value={param.key}
                      onChange={(e) =>
                        updateQueryParam(param.id, e.target.value, param.value, param.enabled)
                      }
                      className="w-1/3 bg-[#191D24] border border-[#303744] rounded-md px-2 py-1 text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#A3FF70]"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={param.value}
                      onChange={(e) =>
                        updateQueryParam(param.id, param.key, e.target.value, param.enabled)
                      }
                      className="flex-1 bg-[#191D24] border border-[#303744] rounded-md px-2 py-1 text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#A3FF70]"
                    />
                    <button
                      onClick={() => removeQueryParam(param.id)}
                      className="text-[#9CA3AF] hover:text-[#EF4444] p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* HEADERS TAB */}
        {activeTab === 'headers' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9CA3AF] pb-1">
              <span>Request Headers</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={applyBrowserHeadersPreset}
                  title="Preset standard Chrome browser headers to bypass bot detection"
                  className="flex items-center space-x-1 text-[11px] text-[#38BDF8] hover:underline"
                >
                  <Sparkles size={12} />
                  <span>Browser Headers</span>
                </button>
                <button
                  onClick={addHeader}
                  className="flex items-center space-x-1 text-[#A3FF70] hover:underline"
                >
                  <Plus size={13} />
                  <span>Add Header</span>
                </button>
              </div>
            </div>

            {headers.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#9CA3AF] border border-dashed border-[#303744] rounded-lg">
                No custom headers configured. Click <strong className="text-[#38BDF8]">Browser Headers</strong> to apply Chrome defaults.
              </div>
            ) : (
              <div className="space-y-1.5">
                {headers.map((h) => (
                  <div key={h.id} className="flex items-center space-x-1.5">
                    <input
                      type="checkbox"
                      checked={h.enabled}
                      onChange={(e) => updateHeader(h.id, h.key, h.value, e.target.checked)}
                      className="rounded bg-[#202630] border-[#303744] text-[#A3FF70] focus:ring-0"
                    />
                    <input
                      type="text"
                      placeholder="Header"
                      value={h.key}
                      onChange={(e) => updateHeader(h.id, e.target.value, h.value, h.enabled)}
                      className="w-1/3 bg-[#191D24] border border-[#303744] rounded-md px-2 py-1 text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#A3FF70]"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={h.value}
                      onChange={(e) => updateHeader(h.id, h.key, e.target.value, h.enabled)}
                      className="flex-1 bg-[#191D24] border border-[#303744] rounded-md px-2 py-1 text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#A3FF70]"
                    />
                    <button
                      onClick={() => removeHeader(h.id)}
                      className="text-[#9CA3AF] hover:text-[#EF4444] p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BODY TAB */}
        {activeTab === 'body' && (
          <div className="space-y-3 h-full flex flex-col">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="text-[#9CA3AF]">Format:</span>
                {(['none', 'json', 'form', 'raw'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setBodyType(type)}
                    className={`px-2.5 py-0.5 rounded text-xs uppercase font-mono font-medium transition-colors ${
                      bodyType === type
                        ? 'bg-[#A3FF70] text-[#111318]'
                        : 'bg-[#202630] text-[#9CA3AF] hover:text-[#F5F7FA]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowInlineTemplatesInBody(!showInlineTemplatesInBody)}
                  className={`flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded border transition-colors ${
                    showInlineTemplatesInBody
                      ? 'bg-[#A3FF70]/15 text-[#A3FF70] border-[#A3FF70]/40'
                      : 'bg-[#202630] text-[#9CA3AF] border-[#303744] hover:text-[#F5F7FA]'
                  }`}
                >
                  <BookOpen size={11} />
                  <span>{showInlineTemplatesInBody ? 'Hide Templates' : 'Browse Templates'}</span>
                </button>

                {bodyType === 'json' && (
                  <button
                    onClick={formatJsonBody}
                    className="flex items-center space-x-1 text-[11px] text-[#A3FF70] hover:underline"
                  >
                    <Code size={12} />
                    <span>Prettify JSON</span>
                  </button>
                )}
              </div>
            </div>

            {bodyType !== 'none' && (
              <textarea
                ref={bodyTextareaRef}
                value={bodyContent}
                onChange={(e) => setBodyContent(e.target.value)}
                onFocus={handleBodyFocus}
                onSelect={handleBodySelect}
                onKeyUp={handleBodyKeyUp}
                onMouseUp={handleBodyMouseUp}
                placeholder={
                  bodyType === 'json'
                    ? '{\n  "key": "value"\n}'
                    : bodyType === 'form'
                    ? 'param1=value1&param2=value2'
                    : 'Raw payload text...'
                }
                rows={showInlineTemplatesInBody ? 6 : 12}
                className="w-full bg-[#191D24] border border-[#303744] rounded-lg p-2.5 font-mono text-xs text-[#F5F7FA] focus:outline-none focus:border-[#A3FF70] resize-y"
              />
            )}

            {/* Inline Template Drawer inside Body tab when toggled */}
            {showInlineTemplatesInBody && (
              <div className="pt-2">
                <TemplateLibrary />
              </div>
            )}
          </div>
        )}

        {/* TEMPLATES TAB (Full View) */}
        {activeTab === 'templates' && (
          <div className="space-y-3">
            <TemplateLibrary />
          </div>
        )}

        {/* RESPONSE TAB */}
        {activeTab === 'response' && (
          <div className="space-y-3 h-full flex flex-col">
            {isLoading && (
              <div className="p-8 text-center text-xs text-[#9CA3AF]">
                Waiting for target response...
              </div>
            )}

            {statusMessage && (
              <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg text-xs text-[#EF4444] space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertCircle size={15} className="shrink-0 text-[#EF4444]" />
                  <span className="flex-1 font-medium">{statusMessage}</span>
                </div>

                {isScopeError && (
                  <div className="flex items-center justify-end space-x-2 pt-1 border-t border-[#EF4444]/20">
                    <button
                      onClick={() => setCurrentPage('scope')}
                      className="px-2.5 py-1 text-[11px] text-[#9CA3AF] hover:text-[#F5F7FA] rounded bg-[#202630] border border-[#303744] transition-colors"
                    >
                      Scope Manager
                    </button>
                    <button
                      onClick={() => authorizeCurrentOriginAndSend()}
                      className="px-3 py-1 text-[11px] bg-[#A3FF70] hover:bg-[#8ee85c] text-[#111318] font-bold rounded flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
                    >
                      <ShieldCheck size={13} />
                      <span>Authorize Origin & Resend</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {!isLoading && !response && !statusMessage && (
              <div className="p-8 text-center text-xs text-[#9CA3AF] border border-dashed border-[#303744] rounded-lg space-y-2">
                <p>No response recorded yet.</p>
                <p className="text-[11px] text-[#9CA3AF]/70">
                  Click <strong className="text-[#A3FF70]">Execute</strong> on the top bar to run in active tab and inspect the result.
                </p>
              </div>
            )}

            {!isLoading && response && (
              <div className="space-y-2 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between pb-1 border-b border-[#202630]">
                  <div className="flex items-center space-x-2">
                    <StatusBadge
                      status={response.status}
                      statusText={response.statusText}
                      durationMs={response.durationMs}
                      sizeBytes={response.sizeBytes}
                    />
                    {isSyncWithTab && (
                      <span className="hidden sm:flex items-center space-x-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#A3FF70]/15 text-[#A3FF70] border border-[#A3FF70]/30">
                        <Zap size={10} className="fill-[#A3FF70]" />
                        <span>Tab Synced</span>
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-1">
                    {(['pretty', 'raw', 'headers'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setResponseViewMode(mode)}
                        className={`text-[11px] px-2 py-0.5 rounded capitalize ${
                          responseViewMode === mode
                            ? 'bg-[#A3FF70] text-[#111318] font-bold'
                            : 'bg-[#202630] text-[#9CA3AF] hover:text-[#F5F7FA]'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* WAF / Bot-Protection Observation Banner */}
                {wafInfo?.detected && (
                  <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg p-2.5 space-y-1 text-xs">
                    <div className="flex items-center space-x-1.5 text-[#F59E0B] font-bold">
                      <ShieldAlert size={14} className="shrink-0" />
                      <span>{wafInfo.wafName} Detected</span>
                    </div>
                    <p className="text-[11px] text-[#9CA3AF]">
                      {wafInfo.advice}
                    </p>
                    <div className="pt-1">
                      <button
                        onClick={() => executeInBrowserTab()}
                        className="px-2.5 py-1 text-[11px] bg-[#A3FF70] text-[#111318] font-bold rounded flex items-center space-x-1 shadow-sm"
                      >
                        <ExternalLink size={12} />
                        <span>Run Directly in Browser Tab (Bypasses Bot Block)</span>
                      </button>
                    </div>
                  </div>
                )}

                {response.isTruncated && (
                  <div className="text-[11px] bg-[#F59E0B]/15 text-[#F59E0B] p-1.5 rounded border border-[#F59E0B]/30">
                    Response body exceeded maximum size limit and was truncated safely.
                  </div>
                )}

                {responseViewMode === 'headers' ? (
                  <div className="flex-1 overflow-y-auto bg-[#191D24] p-2.5 rounded-lg border border-[#303744] font-mono text-xs space-y-1">
                    {Object.entries(response.headers).map(([key, val]) => (
                      <div key={key} className="flex">
                        <span className="text-[#38BDF8] font-semibold w-1/3 break-all">{key}:</span>
                        <span className="text-[#F5F7FA] flex-1 break-all">{val}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <pre className="flex-1 overflow-y-auto bg-[#191D24] p-2.5 rounded-lg border border-[#303744] font-mono text-xs text-[#F5F7FA] whitespace-pre-wrap break-all">
                    {formatResponseBody(response.body) || (
                      <span className="text-[#9CA3AF] italic">&lt;empty body&gt;</span>
                    )}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
