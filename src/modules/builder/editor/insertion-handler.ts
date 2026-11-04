export interface InsertionResult {
  updatedText: string;
  newCursorPosition: number;
}

/**
 * Calculates text replacement/insertion at cursor position while preserving
 * characters before and after the selection.
 */
export function calculateInsertion(
  originalText: string,
  insertContent: string,
  selectionStart: number,
  selectionEnd: number
): InsertionResult {
  const safeStart = Math.max(0, Math.min(selectionStart, originalText.length));
  const safeEnd = Math.max(safeStart, Math.min(selectionEnd, originalText.length));

  const textBefore = originalText.slice(0, safeStart);
  const textAfter = originalText.slice(safeEnd);

  const updatedText = textBefore + insertContent + textAfter;
  const newCursorPosition = textBefore.length + insertContent.length;

  return {
    updatedText,
    newCursorPosition
  };
}

