import React, { useState } from 'react';
import { Encoders } from '@/core/encoding';
import { ArrowUpDown, Copy, Check, Trash2 } from 'lucide-react';

type TransformAction =
  | 'url_encode'
  | 'url_decode'
  | 'url_encode_all'
  | 'base64_encode'
  | 'base64_decode'
  | 'hex_encode'
  | 'hex_decode'
  | 'html_encode'
  | 'html_decode'
  | 'unicode_encode'
  | 'unicode_decode'
  | 'binary_encode'
  | 'binary_decode'
  | 'ascii_encode'
  | 'ascii_decode';

export const EncoderPage: React.FC = () => {
  const [input, setInput] = useState<string>('Hello World! 🚀');
  const [output, setOutput] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<TransformAction>('url_encode');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const executeTransform = (action = selectedAction, text = input) => {
    setError(null);
    try {
      let res = '';
      switch (action) {
        case 'url_encode':
          res = Encoders.urlEncodeComponent(text);
          break;
        case 'url_decode':
          res = Encoders.urlDecodeComponent(text);
          break;
        case 'url_encode_all':
          res = Encoders.urlEncodeAll(text);
          break;
        case 'base64_encode':
          res = Encoders.base64Encode(text);
          break;
        case 'base64_decode':
          res = Encoders.base64Decode(text);
          break;
        case 'hex_encode':
          res = Encoders.hexEncode(text);
          break;
        case 'hex_decode':
          res = Encoders.hexDecode(text);
          break;
        case 'html_encode':
          res = Encoders.htmlEntityEncode(text);
          break;
        case 'html_decode':
          res = Encoders.htmlEntityDecode(text);
          break;
        case 'unicode_encode':
          res = Encoders.unicodeEscape(text);
          break;
        case 'unicode_decode':
          res = Encoders.unicodeUnescape(text);
          break;
        case 'binary_encode':
          res = Encoders.binaryEncode(text);
          break;
        case 'binary_decode':
          res = Encoders.binaryDecode(text);
          break;
        case 'ascii_encode':
          res = Encoders.asciiEncode(text);
          break;
        case 'ascii_decode':
          res = Encoders.asciiDecode(text);
          break;
      }
      setOutput(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Transformation failed');
    }
  };

  const handleActionChange = (action: TransformAction) => {
    setSelectedAction(action);
    executeTransform(action, input);
  };

  const handleSwap = () => {
    setInput(output);
    setOutput(input);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#111318]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#F5F7FA]">Encoder / Decoder Engine</h2>
          <p className="text-xs text-[#9CA3AF]">Lossless multi-format transformation with UTF-8 support.</p>
        </div>

        <button
          onClick={() => {
            setInput('');
            setOutput('');
            setError(null);
          }}
          className="text-xs text-[#9CA3AF] hover:text-[#EF4444] flex items-center space-x-1"
        >
          <Trash2 size={12} />
          <span>Clear</span>
        </button>
      </div>

      {/* Preset Action Buttons Grid */}
      <div className="bg-[#191D24] p-2.5 rounded border border-[#303744] space-y-2">
        <label className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
          Encoding Operations
        </label>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {[
            { id: 'url_encode', label: 'URL Encode' },
            { id: 'url_decode', label: 'URL Decode' },
            { id: 'url_encode_all', label: 'URL Encode All (%xx)' },
            { id: 'base64_encode', label: 'Base64 Encode' },
            { id: 'base64_decode', label: 'Base64 Decode' },
            { id: 'hex_encode', label: 'HEX Encode' },
            { id: 'hex_decode', label: 'HEX Decode' },
            { id: 'html_encode', label: 'HTML Entity Encode' },
            { id: 'html_decode', label: 'HTML Entity Decode' },
            { id: 'unicode_encode', label: 'Unicode Escape' },
            { id: 'unicode_decode', label: 'Unicode Unescape' },
            { id: 'binary_encode', label: 'Binary (8-bit)' },
            { id: 'binary_decode', label: 'Binary to Text' },
            { id: 'ascii_encode', label: 'ASCII Decimals' },
            { id: 'ascii_decode', label: 'Decimals to ASCII' }
          ].map((op) => (
            <button
              key={op.id}
              onClick={() => handleActionChange(op.id as TransformAction)}
              className={`px-2 py-1 rounded text-left transition-colors font-mono text-[11px] ${
                selectedAction === op.id
                  ? 'bg-[#A3FF70] text-[#111318] font-bold'
                  : 'bg-[#202630] text-[#F5F7FA] hover:bg-[#303744]'
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
          <span>Input Text</span>
          <span>{input.length} chars</span>
        </div>
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            executeTransform(selectedAction, e.target.value);
          }}
          rows={5}
          placeholder="Enter text to encode/decode..."
          className="w-full bg-[#191D24] border border-[#303744] rounded p-2 text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#A3FF70] resize-none"
        />
      </div>

      {/* Swap Controls */}
      <div className="flex justify-center space-x-2">
        <button
          onClick={handleSwap}
          className="flex items-center space-x-1.5 px-3 py-1 bg-[#202630] hover:bg-[#303744] text-[#A3FF70] text-xs font-medium rounded border border-[#303744] transition-colors"
        >
          <ArrowUpDown size={13} />
          <span>Swap Input & Output</span>
        </button>
      </div>

      {/* Output Field */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
          <span>Output Result</span>
          <div className="flex items-center space-x-2">
            <span>{output.length} chars</span>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="text-[#A3FF70] hover:underline flex items-center space-x-1 disabled:opacity-40"
            >
              {copied ? <Check size={12} className="text-[#22C55E]" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
        <textarea
          value={output}
          readOnly
          rows={5}
          placeholder="Result will appear here..."
          className="w-full bg-[#191D24] border border-[#303744] rounded p-2 text-xs font-mono text-[#A3FF70] focus:outline-none resize-none"
        />
      </div>

      {error && (
        <div className="p-2.5 rounded bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444]">
          {error}
        </div>
      )}
    </div>
  );
};
