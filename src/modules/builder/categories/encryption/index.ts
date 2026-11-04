import { TemplateCategory } from '../../types/template';

export const encryptionCategory: TemplateCategory = {
  id: 'encryption',
  label: 'Encryption',
  description: 'Cryptographic hashes, URL/XHTML transformations, ciphers, and security token formats',
  iconName: 'Lock',
  subcategories: [
    {
      id: 'url-hex-encrypt',
      label: 'URL & Hex Obfuscation',
      description: 'URL percent-encoding variants, double/triple encoding, and hexadecimal escapes',
      templates: [
        {
          id: 'enc-url-standard',
          name: 'Standard URL Percent Encode',
          description: 'Standard percent-encoded character placeholder (%20, %27, %3C)',
          content: '%{hex_code}',
          parameters: [
            { id: 'hex_code', label: 'Hex Code (e.g. 20, 27, 3c)', defaultValue: '20', inputType: 'text' }
          ]
        },
        {
          id: 'enc-url-full-hex',
          name: 'Full URL Percent Encrypt',
          description: 'Percent encode all characters sequence representation',
          content: '%{hex_string}',
          parameters: [
            { id: 'hex_string', label: 'Hex String', defaultValue: '61646d696e', inputType: 'text' }
          ]
        },
        {
          id: 'enc-url-double',
          name: 'Double URL Percent Encrypt (%25XX)',
          description: 'Double percent-encoded characters for multi-tier reverse proxy bypass',
          content: '%25{hex_code}',
          parameters: [
            { id: 'hex_code', label: 'Hex Code', defaultValue: '27', inputType: 'text' }
          ]
        },
        {
          id: 'enc-url-triple',
          name: 'Triple URL Percent Encrypt (%2525XX)',
          description: 'Triple URL percent encoding for nested decoding pipeline analysis',
          content: '%2525{hex_code}',
          parameters: [
            { id: 'hex_code', label: 'Hex Code', defaultValue: '27', inputType: 'text' }
          ]
        },
        {
          id: 'enc-url-unicode-16',
          name: '16-Bit Unicode URL Encrypt (%u00XX)',
          description: 'Legacy IIS / ASP.NET 16-bit Unicode URL escape format',
          content: '%u00{hex_code}',
          parameters: [
            { id: 'hex_code', label: 'Hex Code', defaultValue: '27', inputType: 'text' }
          ]
        },
        {
          id: 'enc-url-overlong-utf8',
          name: 'UTF-8 Overlong Encrypt (%c0%af)',
          description: 'Historical UTF-8 overlong 2-byte representation of slash / separator',
          content: '%c0%ae%c0%ae%c0%af'
        },
        {
          id: 'enc-hex-0x',
          name: 'SQL 0x Hex String Literal',
          description: 'SQL raw hexadecimal string literal format (bypasses quotes)',
          content: '0x{hex_payload}',
          parameters: [
            { id: 'hex_payload', label: 'Hex Payload', defaultValue: '61646d696e', inputType: 'text' }
          ]
        },
        {
          id: 'enc-hex-escape',
          name: 'C / JS Hex Escape (\\xXX)',
          description: 'Two-digit hexadecimal escape notation used in C, Python, and JavaScript',
          content: '\\x{hex_code}',
          parameters: [
            { id: 'hex_code', label: 'Hex Code', defaultValue: '41', inputType: 'text' }
          ]
        }
      ]
    },
    {
      id: 'xhtml-xml-encrypt',
      label: 'XHTML & XML Entities',
      description: 'XHTML CDATA encapsulation, SVG/MathML wrappers, and numeric character references',
      templates: [
        {
          id: 'enc-xhtml-cdata',
          name: 'XHTML CDATA Block Encrypt',
          description: 'XHTML Unparsed Character Data block (prevents XML parser tokenization)',
          content: '<![CDATA[{payload}]]>',
          parameters: [
            { id: 'payload', label: 'Payload', defaultValue: 'alert(1)', inputType: 'text' }
          ]
        },
        {
          id: 'enc-xhtml-svg-desc',
          name: 'XHTML SVG Container Encrypt',
          description: 'XHTML XML namespace SVG description encapsulation',
          content: '<svg xmlns="http://www.w3.org/2000/svg"><desc><![CDATA[{payload}]]></desc></svg>',
          parameters: [
            { id: 'payload', label: 'Payload', defaultValue: 'test_node', inputType: 'text' }
          ]
        },
        {
          id: 'enc-xhtml-mathml',
          name: 'XHTML MathML CDATA Encrypt',
          description: 'MathML namespace text container with CDATA wrapper',
          content: '<math xmlns="http://www.w3.org/1998/Math/MathML"><mtext><![CDATA[{payload}]]></mtext></math>',
          parameters: [
            { id: 'payload', label: 'Payload', defaultValue: 'test_node', inputType: 'text' }
          ]
        },
        {
          id: 'enc-html-decimal',
          name: 'HTML Decimal Entity (&#NNN;)',
          description: 'Standard decimal HTML character reference entity format',
          content: '&#{decimal_code};',
          parameters: [
            { id: 'decimal_code', label: 'Decimal ASCII Code', defaultValue: '97', inputType: 'text' }
          ]
        },
        {
          id: 'enc-html-hex',
          name: 'HTML Hex Entity (&#xHH;)',
          description: 'Standard hexadecimal HTML character reference entity format',
          content: '&#x{hex_code};',
          parameters: [
            { id: 'hex_code', label: 'Hex Code', defaultValue: '61', inputType: 'text' }
          ]
        },
        {
          id: 'enc-html-padded-dec',
          name: 'HTML Padded Decimal (&#00000NNN;)',
          description: 'Zero-padded decimal entity to test parser normalization',
          content: '&#00000{decimal_code};',
          parameters: [
            { id: 'decimal_code', label: 'Decimal ASCII Code', defaultValue: '97', inputType: 'text' }
          ]
        },
        {
          id: 'enc-html-padded-hex',
          name: 'HTML Padded Hex (&#x0000HH;)',
          description: 'Zero-padded hexadecimal entity format',
          content: '&#x0000{hex_code};',
          parameters: [
            { id: 'hex_code', label: 'Hex Code', defaultValue: '61', inputType: 'text' }
          ]
        },
        {
          id: 'enc-xml-ncr-full',
          name: 'XML / XHTML Full Numeric Character Reference',
          description: 'Hex entity obfuscated markup wrapper',
          content: '&#x3C;&#x73;&#x63;&#x72;&#x69;&#x70;&#x74;&#x3E;{payload}&#x3C;&#x2F;&#x73;&#x63;&#x72;&#x69;&#x70;&#x74;&#x3E;',
          parameters: [
            { id: 'payload', label: 'Inner Content', defaultValue: '/*safe_test*/', inputType: 'text' }
          ]
        }
      ]
    },
    {
      id: 'crypto-hashes',
      label: 'Cryptographic Hashes',
      description: 'Standard cryptographic digest placeholders and checksum formats',
      templates: [
        {
          id: 'enc-hash-md5',
          name: 'MD5 128-Bit Hash (32 hex chars)',
          description: 'Standard 32-character hexadecimal MD5 hash placeholder',
          content: 'd41d8cd98f00b204e9800998ecf8427e'
        },
        {
          id: 'enc-hash-sha1',
          name: 'SHA-1 160-Bit Hash (40 hex chars)',
          description: 'Standard 40-character hexadecimal SHA-1 hash placeholder',
          content: 'da39a3ee5e6b4b0d3255bfef95601890afd80709'
        },
        {
          id: 'enc-hash-sha224',
          name: 'SHA-224 Hash (56 hex chars)',
          description: 'Standard 56-character hexadecimal SHA-224 hash placeholder',
          content: 'd14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f'
        },
        {
          id: 'enc-hash-sha256',
          name: 'SHA-256 Hash (64 hex chars)',
          description: 'Standard 64-character hexadecimal SHA-256 hash placeholder',
          content: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        },
        {
          id: 'enc-hash-sha384',
          name: 'SHA-384 Hash (96 hex chars)',
          description: 'Standard 96-character hexadecimal SHA-384 hash placeholder',
          content: '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b'
        },
        {
          id: 'enc-hash-sha512',
          name: 'SHA-512 Hash (128 hex chars)',
          description: 'Standard 128-character hexadecimal SHA-512 hash placeholder',
          content: 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e'
        },
        {
          id: 'enc-hash-sha3-256',
          name: 'SHA3-256 (Keccak) Hash',
          description: 'Keccak 256-bit cryptographic digest placeholder',
          content: 'a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a'
        },
        {
          id: 'enc-hash-ripemd160',
          name: 'RIPEMD-160 Hash (40 hex chars)',
          description: 'Standard 40-character RIPEMD-160 cryptographic hash',
          content: '9c1185a5c5f9fc54612808977ee8f548b2258d31'
        },
        {
          id: 'enc-hash-crc32',
          name: 'CRC32 Checksum (8 hex chars)',
          description: 'Cyclic redundancy check 32-bit checksum format',
          content: '00000000'
        }
      ]
    },
    {
      id: 'auth-password-hashes',
      label: 'Authentication & Password Hashes',
      description: 'Operating system and database password hash structures',
      templates: [
        {
          id: 'enc-pwd-ntlm',
          name: 'NTLM Password Hash Format',
          description: 'Windows NT LAN Manager 32-hex character hash placeholder',
          content: '31d6cfe0d16ae931b73c59d7e0c089c0'
        },
        {
          id: 'enc-pwd-mysql-native',
          name: 'MySQL 4.1+ Native Password (*SHA1(SHA1))',
          description: 'MySQL asterisks-prefixed double SHA-1 password hash format',
          content: '*2470C0C06DEE42FD1618BB99005ADCA2EC9D1E19'
        },
        {
          id: 'enc-pwd-mysql-old',
          name: 'MySQL Old Password Hash (16 hex chars)',
          description: 'Legacy MySQL pre-4.1 password hash format',
          content: '6f8c67ce3b486455'
        },
        {
          id: 'enc-pwd-bcrypt',
          name: 'Bcrypt (Blowfish) $2y$ Hash Skeleton',
          description: 'Standard 60-character Bcrypt modular crypt format',
          content: '$2y$12$e8r40W932h1vU6e1gH9/8uR5P7Z3y2A1b0C9d8E7F6G5H4I3J2K1L'
        },
        {
          id: 'enc-pwd-argon2',
          name: 'Argon2id Hash Format Skeleton',
          description: 'Argon2id password hashing competition winner string format',
          content: '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ${hash_signature}',
          parameters: [
            { id: 'hash_signature', label: 'Hash Signature (Base64)', defaultValue: '9Z0x8y7w6v5u4t3s2r1q', inputType: 'text' }
          ]
        },
        {
          id: 'enc-pwd-pbkdf2',
          name: 'PBKDF2 HMAC-SHA256 Hash Skeleton',
          description: 'Django / NIST standard PBKDF2 iterated password hash string',
          content: 'pbkdf2:sha256:600000${salt}${hash}',
          parameters: [
            { id: 'salt', label: 'Salt Value', defaultValue: 'random_salt', inputType: 'text' },
            { id: 'hash', label: 'Derived Key Hash', defaultValue: 'abcdef0123456789', inputType: 'text' }
          ]
        }
      ]
    },
    {
      id: 'ciphers-encoding',
      label: 'Ciphers & Classical Obfuscation',
      description: 'Caesar shifts, multi-base data representations, and bitwise transforms',
      templates: [
        {
          id: 'enc-cipher-rot13',
          name: 'ROT13 Caesar Shift Wrapper',
          description: 'Rotate alphabet by 13 positions functional expression',
          content: 'rot13("{plaintext}")',
          parameters: [
            { id: 'plaintext', label: 'Plaintext', defaultValue: 'admin', inputType: 'text' }
          ]
        },
        {
          id: 'enc-cipher-rot47',
          name: 'ROT47 Printable ASCII Shift',
          description: 'Rotate printable ASCII characters by 47 positions notation',
          content: 'rot47("{printable_text}")',
          parameters: [
            { id: 'printable_text', label: 'Printable Text', defaultValue: 'admin', inputType: 'text' }
          ]
        },
        {
          id: 'enc-cipher-base64',
          name: 'Base64 Data Stream Wrapper',
          description: 'RFC 2397 Data URI scheme with Base64 payload',
          content: 'data:text/plain;base64,{base64_payload}',
          parameters: [
            { id: 'base64_payload', label: 'Base64 Payload', defaultValue: 'YWRtaW4=', inputType: 'text' }
          ]
        },
        {
          id: 'enc-cipher-base32',
          name: 'Base32 Encoded String',
          description: 'RFC 4648 Base32 alphabet placeholder (A-Z, 2-7)',
          content: '{base32_payload}',
          parameters: [
            { id: 'base32_payload', label: 'Base32 Payload', defaultValue: 'MFRGGZDF', inputType: 'text' }
          ]
        },
        {
          id: 'enc-cipher-base58',
          name: 'Base58 Bitcoin Alphabet Format',
          description: 'Base58 alphabet representation without easily confused characters',
          content: '{base58_payload}',
          parameters: [
            { id: 'base58_payload', label: 'Base58 Payload', defaultValue: '6h8c3u9', inputType: 'text' }
          ]
        },
        {
          id: 'enc-cipher-base85',
          name: 'Ascii85 / Base85 Encapsulation (<~...~>)',
          description: 'Adobe PostScript / Ascii85 wrapped block format',
          content: '<~{ascii85_data}~>',
          parameters: [
            { id: 'ascii85_data', label: 'Ascii85 Data', defaultValue: '@<;L1', inputType: 'text' }
          ]
        },
        {
          id: 'enc-cipher-xor',
          name: 'Single-Byte XOR Expression',
          description: 'Bitwise exclusive-OR expression with single-byte key',
          content: '({raw_byte} ^ 0x5A)',
          parameters: [
            { id: 'raw_byte', label: 'Input Byte / Integer', defaultValue: '0x41', inputType: 'text' }
          ]
        },
        {
          id: 'enc-cipher-atbash',
          name: 'Atbash Reverse Alphabet Cipher',
          description: 'Classical Hebrew substitution cipher (A <-> Z, B <-> Y)',
          content: 'atbash("{plaintext}")',
          parameters: [
            { id: 'plaintext', label: 'Plaintext', defaultValue: 'admin', inputType: 'text' }
          ]
        }
      ]
    },
    {
      id: 'tokens-crypto',
      label: 'Tokens & Symmetric / Asymmetric Cryptography',
      description: 'JSON Web Tokens, Fernet encrypted envelopes, and public key skeletons',
      templates: [
        {
          id: 'enc-jwt-hs256',
          name: 'JWT HS256 Standard Structure',
          description: 'Header.Payload.Signature standard HMAC-SHA256 JWT format',
          content: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.{base64_payload}.{signature}',
          parameters: [
            { id: 'base64_payload', label: 'Base64 Payload', defaultValue: 'eyJ1c2VyIjoiYWRtaW4ifQ', inputType: 'text' },
            { id: 'signature', label: 'Signature', defaultValue: 's4mple_s1gn4tur3', inputType: 'text' }
          ]
        },
        {
          id: 'enc-jwt-none',
          name: 'JWT None Algorithm Structure',
          description: 'Alg=none unsigned JWT token format for signature validation testing',
          content: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.{base64_payload}.',
          parameters: [
            { id: 'base64_payload', label: 'Base64 Payload', defaultValue: 'eyJ1c2VyIjoiYWRtaW4ifQ', inputType: 'text' }
          ]
        },
        {
          id: 'enc-crypto-fernet',
          name: 'Fernet Symmetric Encrypted Token',
          description: 'Cryptography Fernet URL-safe base64-encoded encrypted envelope',
          content: 'gAAAAAB{timestamp_iv_ciphertext_hmac}',
          parameters: [
            { id: 'timestamp_iv_ciphertext_hmac', label: 'Encrypted Token Body', defaultValue: 'mH4sZ...', inputType: 'text' }
          ]
        },
        {
          id: 'enc-crypto-aes-cbc',
          name: 'AES-256-CBC Encrypted Block Skeleton',
          description: 'Common IV + Ciphertext transmission serialization format',
          content: '{iv_16_bytes_hex}:{ciphertext_base64}',
          parameters: [
            { id: 'iv_16_bytes_hex', label: '16-Byte IV (Hex)', defaultValue: '0102030405060708090a0b0c0d0e0f10', inputType: 'text' },
            { id: 'ciphertext_base64', label: 'Ciphertext (Base64)', defaultValue: 'k7F...', inputType: 'text' }
          ]
        },
        {
          id: 'enc-crypto-aes-gcm',
          name: 'AES-256-GCM AEAD Tagged Skeleton',
          description: 'Galois/Counter Mode Nonce + Ciphertext + Auth Tag format',
          content: '{nonce_12_bytes}:{ciphertext_base64}:{auth_tag_16_bytes}',
          parameters: [
            { id: 'nonce_12_bytes', label: '12-Byte Nonce (Hex)', defaultValue: '0102030405060708090a0b0c', inputType: 'text' },
            { id: 'ciphertext_base64', label: 'Ciphertext (Base64)', defaultValue: 'q8M...', inputType: 'text' },
            { id: 'auth_tag_16_bytes', label: 'Auth Tag (Hex)', defaultValue: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d', inputType: 'text' }
          ]
        },
        {
          id: 'enc-crypto-rsa-pem',
          name: 'RSA Public Key PEM Skeleton (PKCS#8)',
          description: 'Standard X.509 / PKCS#8 PEM public key envelope',
          content: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA{modulus}IDAQAB\n-----END PUBLIC KEY-----',
          parameters: [
            { id: 'modulus', label: 'Base64 RSA Modulus', defaultValue: '3g8...', inputType: 'text' }
          ]
        }
      ]
    }
  ]
};
