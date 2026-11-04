import { cursorManager } from './cursor-manager';
import { useAppStore } from '@/stores/appStore';

/**
 * Applies a string transform (encode/decode) to the active editor target.
 * If text is selected, transforms only the selection and keeps it selected.
 * If no text is selected, transforms the entire text.
 * Falls back to Target URL store if no editor target is focused.
 */
export function applyEditorTransformation(transform: (input: string) => string): boolean {
  const active = cursorManager.getActiveTarget();

  if (active) {
    const fullText = active.getValue();
    let sel = active.getSelection();

    // Check if browser lost selection range on blur but cursorManager saved it
    if (sel.start === sel.end) {
      const saved = cursorManager.getSavedRange();
      if (saved && saved.start !== saved.end && saved.end <= fullText.length) {
        sel = saved;
      }
    }

    const hasSelection = sel.start !== sel.end;

    if (hasSelection) {
      const safeStart = Math.max(0, Math.min(sel.start, sel.end, fullText.length));
      const safeEnd = Math.max(0, Math.min(Math.max(sel.start, sel.end), fullText.length));
      const selectedText = fullText.substring(safeStart, safeEnd);

      try {
        const transformed = transform(selectedText);
        const newText = fullText.substring(0, safeStart) + transformed + fullText.substring(safeEnd);
        active.setValue(newText);

        setTimeout(() => {
          active.focus();
          const newEnd = safeStart + transformed.length;
          active.setSelection(safeStart, newEnd);
          cursorManager.updateSelection(safeStart, newEnd);
        }, 10);
        return true;
      } catch (err) {
        console.warn('Transformation error on selection:', err);
        return false;
      }
    } else {
      try {
        const transformed = transform(fullText);
        active.setValue(transformed);

        setTimeout(() => {
          active.focus();
          active.setSelection(0, transformed.length);
          cursorManager.updateSelection(0, transformed.length);
        }, 10);
        return true;
      } catch (err) {
        console.warn('Transformation error on full text:', err);
        return false;
      }
    }
  }

  // Fallback to URL in store
  const { url, setUrl } = useAppStore.getState();
  try {
    const transformed = transform(url);
    setUrl(transformed);
    return true;
  } catch (err) {
    console.warn('Transformation fallback error:', err);
    return false;
  }
}
