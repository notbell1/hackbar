/**
 * Multi-format Encoder / Decoder Utility Suite
 * Robust handling of UTF-8, Unicode, and edge cases
 */

export const Encoders = {
  // --- URL ENCODING ---
  urlEncodeStandard(str: string): string {
    return encodeURI(str);
  },

  urlDecodeStandard(str: string): string {
    return decodeURI(str);
  },

  urlEncodeComponent(str: string): string {
    return encodeURIComponent(str).replace(/['()*!~]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
  },

  urlDecodeComponent(str: string): string {
    const withSpaces = str.replace(/\+/g, ' ');
    try {
      return decodeURIComponent(withSpaces);
    } catch {
      return withSpaces.replace(/%([0-9a-fA-F]{2})/g, (_, hex) => {
        try {
          return String.fromCharCode(parseInt(hex, 16));
        } catch {
          return `%${hex}`;
        }
      });
    }
  },

  urlEncodeAll(str: string): string {
    return Array.from(new TextEncoder().encode(str))
      .map((b) => `%${b.toString(16).toUpperCase().padStart(2, '0')}`)
      .join('');
  },

  // --- BASE64 ---
  base64Encode(str: string): string {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  },

  base64Decode(str: string): string {
    const binary = atob(str.trim());
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  },

  // --- HEX ---
  hexEncode(str: string, delimiter = ''): string {
    const bytes = new TextEncoder().encode(str);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(delimiter);
  },

  hexDecode(hex: string): string {
    const cleanHex = hex.replace(/[^0-9a-fA-F]/g, '');
    if (cleanHex.length % 2 !== 0) {
      throw new Error('Hex string has an invalid odd length');
    }
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
    }
    return new TextDecoder().decode(bytes);
  },

  // --- HTML ENTITIES ---
  htmlEntityEncode(str: string): string {
    return str.replace(/[\u00A0-\u9999<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);
  },

  htmlEntityDecode(str: string): string {
    return str
      .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
      .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&apos;/g, "'");
  },

  // --- UNICODE ESCAPES ---
  unicodeEscape(str: string): string {
    return Array.from(str)
      .map((char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`)
      .join('');
  },

  unicodeUnescape(str: string): string {
    return str
      .replace(/(?:\\u|%u)([0-9a-fA-F]{4})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/\\u([0-9a-fA-F]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  },

  // --- BINARY ---
  binaryEncode(str: string): string {
    const bytes = new TextEncoder().encode(str);
    return Array.from(bytes)
      .map((b) => b.toString(2).padStart(8, '0'))
      .join(' ');
  },

  binaryDecode(binStr: string): string {
    const tokens = binStr.trim().split(/\s+/);
    const bytes = new Uint8Array(tokens.length);
    for (let i = 0; i < tokens.length; i++) {
      if (!/^[01]{1,8}$/.test(tokens[i])) {
        throw new Error(`Invalid binary byte at token ${i + 1}: "${tokens[i]}"`);
      }
      bytes[i] = parseInt(tokens[i], 2);
    }
    return new TextDecoder().decode(bytes);
  },

  // --- ASCII CODES ---
  asciiEncode(str: string, delimiter = ','): string {
    const codes: number[] = [];
    for (let i = 0; i < str.length; i++) {
      codes.push(str.charCodeAt(i));
    }
    return codes.join(delimiter);
  },

  asciiDecode(codeStr: string, delimiter = ','): string {
    const parts = codeStr.split(delimiter).map((s) => s.trim()).filter(Boolean);
    return parts.map((n) => String.fromCharCode(Number(n))).join('');
  },

  // --- 0xHEX (SQL Style) ---
  hex0xEncode(str: string): string {
    return '0x' + this.hexEncode(str);
  },

  hex0xDecode(hexStr: string): string {
    const clean = hexStr.trim().replace(/^0x/i, '');
    return this.hexDecode(clean);
  },

  // --- \xHEX (C / JS Escape) ---
  xHexEncode(str: string): string {
    const bytes = new TextEncoder().encode(str);
    return Array.from(bytes)
      .map((b) => '\\x' + b.toString(16).padStart(2, '0'))
      .join('');
  },

  xHexDecode(xHexStr: string): string {
    const clean = xHexStr.replace(/\\x/gi, '');
    return this.hexDecode(clean);
  },

  // --- HTML HEX ENTITIES (&#xHEX;) ---
  htmlHexEntityEncode(str: string): string {
    return Array.from(str)
      .map((c) => `&#x${c.charCodeAt(0).toString(16)};`)
      .join('');
  },

  htmlHexEntityDecode(str: string): string {
    return this.htmlEntityDecode(str);
  },

  // --- BASE64 SPACER ---
  base64Spacer(str: string): string {
    // If str contains spaced characters, unspace it
    if (/^(?:[A-Za-z0-9+/=]\s+)+[A-Za-z0-9+/=]$/.test(str.trim())) {
      return str.replace(/\s+/g, '');
    }
    // If already valid Base64 without spaces, just add spaces
    if (/^[A-Za-z0-9+/=]+$/.test(str.trim()) && str.trim().length % 4 === 0) {
      return str.trim().split('').join(' ');
    }
    // Otherwise encode to base64 first, then space out
    const b64 = this.base64Encode(str);
    return b64.split('').join(' ');
  }
};

