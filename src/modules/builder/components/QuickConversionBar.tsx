import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Encoders } from '@/core/encoding';
import { applyEditorTransformation } from '../editor/transform-handler';
import { useAppStore } from '@/stores/appStore';

interface ConversionItem {
  id: string;
  label: string;
  decodeTitle?: string;
  encodeTitle?: string;
  onDecode?: () => void;
  onEncode?: () => void;
  singleDirection?: boolean;
}

export const QuickConversionBar: React.FC = () => {
  const { isSyncWithTab } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState<8 | 4 | 2>(4);

  // ResizeObserver to detect exact container width and smoothly wrap rows
  useEffect(() => {
    if (!containerRef.current) return;

    const updateColumns = (width: number) => {
      if (width >= 780) {
        setCols(8);
      } else if (width >= 390) {
        setCols(4);
      } else {
        setCols(2);
      }
    };

    // Initial measure
    updateColumns(containerRef.current.clientWidth);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        updateColumns(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleTransform = (transformFn: (str: string) => string) => {
    applyEditorTransformation(transformFn);
  };

  const activeColor = isSyncWithTab ? 'text-[#A3FF70]' : 'text-[#EF4444]';
  const hoverColor = isSyncWithTab ? 'hover:text-[#B6FF8F]' : 'hover:text-[#FF7070]';
  const borderColor = isSyncWithTab ? 'border-[#A3FF70]' : 'border-[#EF4444]';
  const divideColor = isSyncWithTab ? 'divide-[#1D3624]' : 'divide-[#3E1A22]';
  const glowShadow = isSyncWithTab
    ? 'drop-shadow-[0_0_3px_rgba(163,255,112,0.6)]'
    : 'drop-shadow-[0_0_3px_rgba(239,68,68,0.6)]';

  // 3D metallic retro hackbar button style for chevrons
  const buttonStyle = `inline-flex items-center justify-center p-0.5 rounded-[2px] bg-gradient-to-b from-[#2E3544] via-[#1A1F2B] to-[#0E121A] border border-[#3E4759]/60 hover:border-[#6B7280] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.8)] active:translate-y-px active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)] cursor-pointer shrink-0 transition-all`;

  // Prevent blurring the active input/textarea when clicking conversion controls
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const ITEMS: ConversionItem[] = [
    {
      id: '0xhex',
      label: '0xHEX',
      decodeTitle: '0xHEX Decode (Convert 0x... hex literal to plaintext)',
      encodeTitle: '0xHEX Encode (Convert plaintext to 0x... hex literal)',
      onDecode: () => handleTransform((str) => Encoders.hex0xDecode(str)),
      onEncode: () => handleTransform((str) => Encoders.hex0xEncode(str))
    },
    {
      id: 'url',
      label: '%URL',
      decodeTitle: 'URL Decode (Decode %XX and + to plaintext)',
      encodeTitle: 'URL Encode Component (Encode characters including quotes & symbols)',
      onDecode: () => handleTransform((str) => Encoders.urlDecodeComponent(str)),
      onEncode: () => handleTransform((str) => Encoders.urlEncodeComponent(str))
    },
    {
      id: 'base64',
      label: 'BASE64',
      decodeTitle: 'Base64 Decode',
      encodeTitle: 'Base64 Encode',
      onDecode: () => handleTransform((str) => Encoders.base64Decode(str)),
      onEncode: () => handleTransform((str) => Encoders.base64Encode(str))
    },
    {
      id: '0bbinary',
      label: '0bBINARY',
      decodeTitle: 'Binary Decode (Convert 8-bit stream to text)',
      encodeTitle: 'Binary Encode (Convert text to 8-bit stream)',
      onDecode: () => handleTransform((str) => Encoders.binaryDecode(str)),
      onEncode: () => handleTransform((str) => Encoders.binaryEncode(str))
    },
    {
      id: 'unicode',
      label: '\\UNIC00DE',
      decodeTitle: 'Unicode Unescape (Convert \\uXXXX or %uXXXX to text)',
      encodeTitle: 'Unicode Escape (Convert all characters to \\uXXXX)',
      onDecode: () => handleTransform((str) => Encoders.unicodeUnescape(str)),
      onEncode: () => handleTransform((str) => Encoders.unicodeEscape(str))
    },
    {
      id: 'xhex',
      label: '\\xHEX',
      decodeTitle: '\\xHEX Decode (Convert \\xXX sequence to text)',
      encodeTitle: '\\xHEX Encode (Convert text to \\xXX sequence)',
      onDecode: () => handleTransform((str) => Encoders.xHexDecode(str)),
      onEncode: () => handleTransform((str) => Encoders.xHexEncode(str))
    },
    {
      id: 'htmlhex',
      label: '&#xHEX;',
      decodeTitle: 'HTML Hex Entity Decode (Convert &#xHH; or &#NN; to text)',
      encodeTitle: 'HTML Hex Entity Encode (Convert text to &#xHH;)',
      onDecode: () => handleTransform((str) => Encoders.htmlHexEntityDecode(str)),
      onEncode: () => handleTransform((str) => Encoders.htmlHexEntityEncode(str))
    },
    {
      id: 'base64spacer',
      label: 'Base64 spacer',
      encodeTitle: 'Base64 Spacer (Toggle spaced Base64 for WAF testing)',
      singleDirection: true,
      onEncode: () => handleTransform((str) => Encoders.base64Spacer(str))
    }
  ];

  const renderCell = (item: ConversionItem) => (
    <div
      key={item.id}
      className="flex items-center justify-center space-x-1 px-1 py-1 min-w-0"
    >
      {!item.singleDirection && item.onDecode && (
        <button
          type="button"
          title={item.decodeTitle}
          onMouseDown={handleMouseDown}
          onClick={item.onDecode}
          className={`${buttonStyle} ${activeColor} ${hoverColor}`}
        >
          <ChevronLeft size={11} className={`stroke-[3] ${glowShadow}`} />
        </button>
      )}
      <span
        className={`font-mono text-[10px] min-[420px]:text-[11px] font-bold ${activeColor} px-1 tracking-tight truncate drop-shadow-sm select-none`}
      >
        {item.label}
      </span>
      {item.onEncode && (
        <button
          type="button"
          title={item.encodeTitle}
          onMouseDown={handleMouseDown}
          onClick={item.onEncode}
          className={`${buttonStyle} ${activeColor} ${hoverColor}`}
        >
          <ChevronRight size={11} className={`stroke-[3] ${glowShadow}`} />
        </button>
      )}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`w-full bg-[#07090D] border-t border-b ${borderColor} transition-colors duration-200 select-none z-30`}
    >
      {cols === 8 ? (
        /* Wide display: Single row with all 8 items */
        <div className={`grid grid-cols-8 divide-x ${divideColor} px-0.5 py-0.5`}>
          {ITEMS.map(renderCell)}
        </div>
      ) : cols === 4 ? (
        /* Standard sidepanel: 2 rows with 4 items each, cleanly divided */
        <div className={`flex flex-col divide-y ${divideColor}`}>
          <div className={`grid grid-cols-4 divide-x ${divideColor} px-0.5 py-0.5`}>
            {ITEMS.slice(0, 4).map(renderCell)}
          </div>
          <div className={`grid grid-cols-4 divide-x ${divideColor} px-0.5 py-0.5`}>
            {ITEMS.slice(4, 8).map(renderCell)}
          </div>
        </div>
      ) : (
        /* Very compact display: 4 rows with 2 items each */
        <div className={`flex flex-col divide-y ${divideColor}`}>
          <div className={`grid grid-cols-2 divide-x ${divideColor} px-0.5 py-0.5`}>
            {ITEMS.slice(0, 2).map(renderCell)}
          </div>
          <div className={`grid grid-cols-2 divide-x ${divideColor} px-0.5 py-0.5`}>
            {ITEMS.slice(2, 4).map(renderCell)}
          </div>
          <div className={`grid grid-cols-2 divide-x ${divideColor} px-0.5 py-0.5`}>
            {ITEMS.slice(4, 6).map(renderCell)}
          </div>
          <div className={`grid grid-cols-2 divide-x ${divideColor} px-0.5 py-0.5`}>
            {ITEMS.slice(6, 8).map(renderCell)}
          </div>
        </div>
      )}
    </div>
  );
};
