/**
 * Utility for formatting template tooltips cleanly.
 * Wraps long SQL clauses and descriptions into max ~45 characters per line
 * so native tooltips remain compact, readable, and never stretch to touch the right screen edge.
 */

export function wrapTooltipLine(str: string, maxLen = 45): string[] {
  if (!str) return [];
  if (str.length <= maxLen) return [str];

  const lines: string[] = [];
  let remaining = str;

  while (remaining.length > maxLen) {
    // Search for natural break points (spaces, commas, closing parens, operators)
    let breakIdx = -1;

    // Check for natural delimiters between 20 and maxLen
    for (let i = maxLen; i >= 20; i--) {
      const ch = remaining[i];
      if (ch === ' ' || ch === ',' || ch === ')' || ch === '(' || ch === '+' || ch === '=') {
        breakIdx = i + (ch === ' ' ? 0 : 1);
        break;
      }
    }

    if (breakIdx <= 15) {
      breakIdx = maxLen;
    }

    lines.push(remaining.slice(0, breakIdx).trimEnd());
    remaining = remaining.slice(breakIdx).trimStart();
  }

  if (remaining.length > 0) {
    lines.push(remaining);
  }

  return lines;
}

export function formatTemplateTooltip(description?: string, content?: string): string {
  const sections: string[] = [];

  if (description) {
    const wrappedDesc = wrapTooltipLine(description, 45).join('\n');
    sections.push(`Deskripsi:\n${wrappedDesc}`);
  }

  if (content) {
    // Break on major SQL clause keywords to avoid long unbroken strings
    const preformatted = content
      .replace(/\b(WHERE|FROM|AND|OR|LIMIT|UNION SELECT)\b/gi, '\n  $1')
      .split('\n');

    const formattedLines: string[] = [];
    for (const part of preformatted) {
      if (!part.trim()) continue;
      formattedLines.push(...wrapTooltipLine(part, 45));
    }

    sections.push(`Query:\n${formattedLines.join('\n')}`);
  }

  return sections.join('\n\n');
}

