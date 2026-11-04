/**
 * XEOO HACKBAR — Security Testing & HTTP Inspection Chrome Extension
 * 
 * @module DiosGenerator
 * @author Zone Xploiter / ZXMarchia
 * @license MIT
 * @description DIOS Signature & Query Generator: dynamically builds hex-encoded watermarks and injects them into MySQL DIOS payloads.
 */

export type DiosSignatureColor = 'green' | 'red' | 'cyan' | 'gold' | 'ascii' | 'none';

export interface DiosSignatureOption {
  id: DiosSignatureColor;
  label: string;
  colorCode: string;
  isHtml: boolean;
}

export const DIOS_SIGNATURE_OPTIONS: DiosSignatureOption[] = [
  { id: 'green', label: 'Neon Green Glow', colorCode: '#A3FF70', isHtml: true },
  { id: 'red', label: 'Neon Red Fire', colorCode: '#FF3344', isHtml: true },
  { id: 'cyan', label: 'Cyber Cyan Glow', colorCode: '#00FFFF', isHtml: true },
  { id: 'gold', label: 'Electric Gold', colorCode: '#FFE600', isHtml: true },
  { id: 'ascii', label: 'Classic ASCII Frame', colorCode: '#F5F7FA', isHtml: false },
  { id: 'none', label: 'No Signature (Plain)', colorCode: '#9CA3AF', isHtml: false }
];

/**
 * Converts a string to MySQL 0x... hex literal format.
 */
export function stringToHex0x(str: string): string {
  if (!str) return '0x00';
  let hex = '0x';
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * Generates the preview string and the hex code for a signature.
 */
export function generateDiosHeader(
  authorName: string = 'ZXMarchia',
  style: DiosSignatureColor = 'green'
): { rawText: string; hex: string; htmlPreview: string } {
  const cleanAuthor = authorName.trim() || 'ZXMarchia';

  if (style === 'none') {
    return {
      rawText: '',
      hex: '0x00',
      htmlPreview: '(Standard DIOS without signature header)'
    };
  }

  if (style === 'ascii') {
    const raw = `\n=== [ Injected by ${cleanAuthor} - Xeoo Hackbar ] ===\n`;
    return {
      rawText: raw,
      hex: stringToHex0x(raw),
      htmlPreview: raw
    };
  }

  const option = DIOS_SIGNATURE_OPTIONS.find((o) => o.id === style) || DIOS_SIGNATURE_OPTIONS[0];
  const color = option.colorCode;
  const rawHtml = `<font color=${color}><b>[ Injected by ${cleanAuthor} - Xeoo Hackbar ]</b></font><br>`;

  return {
    rawText: rawHtml,
    hex: stringToHex0x(rawHtml),
    htmlPreview: rawHtml
  };
}

/**
 * Injects a hex header into a MySQL DIOS query template.
 * Replaces the initial null/empty initialization with the signature hex.
 */
export function injectDiosSignature(
  templateContent: string,
  authorName: string = 'ZXMarchia',
  style: DiosSignatureColor = 'green'
): string {
  const { hex } = generateDiosHeader(authorName, style);

  // If style is none or hex is 0x00, keep original initialization
  if (style === 'none' || hex === '0x00') {
    return templateContent;
  }

  // 1. Replace explicit {header_hex} placeholder if present
  if (templateContent.includes('{header_hex}')) {
    return templateContent.replace(/\{header_hex\}/g, hex);
  }

  // 2. Replace standard variable initialization: @:=0x00, @x:=0x00, @a:=0x00, etc.
  let modified = templateContent.replace(
    /(@[a-zA-Z0-9_]*:=)0x00/g,
    `$1${hex}`
  );

  // 3. Replace @:=0x0a... or existing header hex if modifying a signature template
  if (modified === templateContent) {
    modified = templateContent.replace(
      /(@[a-zA-Z0-9_]*:=)0x[0-9a-fA-F]+/i,
      `$1${hex}`
    );
  }

  return modified;
}

