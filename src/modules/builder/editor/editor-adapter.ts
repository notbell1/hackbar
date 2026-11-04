import { EditorTargetAdapter } from '../types/template';
import { cursorManager } from './cursor-manager';
import { calculateInsertion } from './insertion-handler';

/**
 * Creates a standard EditorTargetAdapter for an HTMLTextAreaElement / React state pair
 */
export function createTextareaAdapter(
  id: string,
  name: string,
  textareaRef: { current: HTMLTextAreaElement | null },
  getValue: () => string,
  setValue: (val: string) => void
): EditorTargetAdapter {
  return {
    id,
    name,
    getValue: () => {
      // Prioritize live DOM value to avoid stale React closures
      if (textareaRef.current) {
        return textareaRef.current.value;
      }
      return getValue();
    },
    setValue,
    getSelection: () => {
      const el = textareaRef.current;
      if (!el) {
        const val = getValue();
        return { start: val.length, end: val.length };
      }
      return { start: el.selectionStart, end: el.selectionEnd };
    },
    setSelection: (start: number, end: number) => {
      const el = textareaRef.current;
      if (el) {
        el.setSelectionRange(start, end);
      }
      cursorManager.updateSelection(start, end);
    },
    focus: () => {
      textareaRef.current?.focus();
    }
  };
}

/**
 * Inserts content into the currently active or specified editor target
 */
export function insertContentIntoEditor(
  content: string,
  target?: EditorTargetAdapter | null
): boolean {
  const active = target || cursorManager.getActiveTarget();
  if (!active) {
    return false;
  }

  // Always fetch current live text
  const currentText = active.getValue();
  const selection = active.getSelection();

  // Clamp selection range to current text bounds (prevents resurrecting deleted text)
  const safeStart = Math.max(0, Math.min(selection.start, currentText.length));
  const safeEnd = Math.max(safeStart, Math.min(selection.end, currentText.length));

  const { updatedText, newCursorPosition } = calculateInsertion(
    currentText,
    content,
    safeStart,
    safeEnd
  );

  active.setValue(updatedText);

  // Immediately clear block selection and collapse cursor position to avoid residual block highlights
  active.setSelection(newCursorPosition, newCursorPosition);
  cursorManager.updateSelection(newCursorPosition, newCursorPosition);

  // Focus and restore cursor asynchronously
  setTimeout(() => {
    active.focus();
    active.setSelection(newCursorPosition, newCursorPosition);
    cursorManager.updateSelection(newCursorPosition, newCursorPosition);
  }, 10);

  return true;
}

