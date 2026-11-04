import { TemplateParameter, TextTemplate } from '../types/template';
import { Encoders } from '@/core/encoding';

/**
 * Builds the initial React state dictionary from a template's parameter definitions.
 */
export function createInitialParameterValues(
  parameters?: TemplateParameter[]
): Record<string, string> {
  if (!parameters || parameters.length === 0) {
    return {};
  }

  return parameters.reduce<Record<string, string>>((acc, param) => {
    acc[param.id] = '';
    return acc;
  }, {});
}

/**
 * Updates a single parameter value immutably.
 */
export function updateParameterValue(
  currentValues: Record<string, string>,
  paramId: string,
  newValue: string
): Record<string, string> {
  return {
    ...currentValues,
    [paramId]: newValue
  };
}

/**
 * Resets a specific parameter back to its configured defaultValue.
 */
export function resetParameterValue(
  currentValues: Record<string, string>,
  parameters: TemplateParameter[] | undefined,
  paramId: string
): Record<string, string> {
  if (!parameters) return currentValues;
  const target = parameters.find((p) => p.id === paramId);
  if (!target) return currentValues;

  return {
    ...currentValues,
    [paramId]: ''
  };
}

/**
 * Resets all parameters back to their configured default values.
 */
export function resetAllParameterValues(
  parameters?: TemplateParameter[]
): Record<string, string> {
  return createInitialParameterValues(parameters);
}

/**
 * Converts a plain string into 0x-prefixed lowercase hexadecimal (e.g. "ADMIN()" -> "0x41444d494e2829").
 */
export function toHex0x(value: string): string {
  if (/^0x[0-9a-fA-F]+$/.test(value)) {
    return value;
  }
  return `0x${Encoders.hexEncode(value)}`;
}

/**
 * Replaces matching tokens case-insensitively while preserving surrounding context.
 */
function replaceToken(source: string, targetToken: string, replacement: string): string {
  if (!targetToken) return source;
  const regex = new RegExp(targetToken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  return source.replace(regex, replacement);
}

/**
 * Synchronizes a template's stored content with the current user parameter state:
 * - If no parameters are configured or all parameters equal their defaultValue,
 *   returns `template.content` untouched.
 * - Handles:
 *   1. Column Category (`WHERE TABLE_NAME=0x7461626c655f6e616d65`):
 *      Replaces default hex `0x7461626c655f6e616d65` with hex of new table name.
 *   2. Data Category (`FROM TABLE_NAME` or `FROM(TABLE_NAME)`):
 *      Replaces token `TABLE_NAME` with current table name input.
 *   3. `column_name`:
 *      Replaces default column tokens with custom comma-separated list.
 *   4. `database`:
 *      Replaces `DATABASE()` / `database()` with 0xhex if modified.
 */
export function resolveTemplateContent(
  template: TextTemplate,
  paramValues: Record<string, string>
): string {
  if (!template.content || !template.parameters || template.parameters.length === 0) {
    return template.content;
  }

  let resolved = template.content;

  for (const param of template.parameters) {
    const rawValue = paramValues[param.id];
    const currentValue = rawValue !== undefined && rawValue !== '' ? rawValue : param.defaultValue;
    const hasExplicitPlaceholder = resolved.includes(`{${param.id}}`);

    // When default value is selected (or input is empty), preserve stored content as-is,
    // unless the content literally contains an explicit placeholder token like `{table_name}` or `{content}`
    if ((currentValue === param.defaultValue || currentValue.trim() === '') && !hasExplicitPlaceholder) {
      continue;
    }

    const valueToInsert = currentValue.trim() !== '' ? currentValue : (param.defaultValue ?? '');

    if (param.id === 'table_name') {
      const defaultHexValue = param.defaultValue ? toHex0x(param.defaultValue) : '';

      if (hasExplicitPlaceholder) {
        resolved = resolved.split(`{${param.id}}`).join(valueToInsert);
      } else if (defaultHexValue && resolved.includes(defaultHexValue)) {
        // In Column templates: TABLE_NAME=0x7461626c655f6e616d65 -> TABLE_NAME=0x<hex>
        resolved = resolved.split(defaultHexValue).join(toHex0x(valueToInsert));
      } else if (resolved.includes('TABLE_NAME')) {
        // In Data templates: FROM TABLE_NAME / FROM(TABLE_NAME)
        resolved = replaceToken(resolved, 'TABLE_NAME', valueToInsert);
      } else if (param.defaultValue && resolved.includes(param.defaultValue)) {
        resolved = resolved.split(param.defaultValue).join(valueToInsert);
      }
    } else if (param.id === 'column_name') {
      if (hasExplicitPlaceholder) {
        resolved = replaceToken(resolved, '{column_name}', valueToInsert);
      } else {
        resolved = replaceToken(resolved, '{column_name}', valueToInsert);
        resolved = replaceToken(resolved, 'column_1,0x3a,column_2,0x3a,column_3', valueToInsert);
        resolved = replaceToken(resolved, 'column_1,column_2,column_3', valueToInsert);
      }
    } else if (param.id === 'database') {
      // In Tables & Data templates: if user changes database, convert to 0xhex
      const encodedDb = toHex0x(valueToInsert);
      resolved = replaceToken(resolved, '{database}', encodedDb);
      resolved = replaceToken(resolved, 'database()', encodedDb);
      resolved = replaceToken(resolved, 'DATABASE()', encodedDb);
    } else {
      const defaultHexValue = param.defaultValue ? toHex0x(param.defaultValue) : '';
      if (hasExplicitPlaceholder) {
        resolved = resolved.split(`{${param.id}}`).join(valueToInsert);
      } else if (defaultHexValue && resolved.includes(defaultHexValue)) {
        resolved = resolved.split(defaultHexValue).join(toHex0x(valueToInsert));
      } else if (param.defaultValue && resolved.includes(param.defaultValue)) {
        resolved = resolved.split(param.defaultValue).join(valueToInsert);
      }
    }
  }

  return resolved;
}
