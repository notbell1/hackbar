import { useEffect, useCallback, useRef } from 'react';
import { EditorTargetAdapter } from '../types/template';
import { cursorManager } from '../editor/cursor-manager';
import { createTextareaAdapter, insertContentIntoEditor } from '../editor/editor-adapter';

export function useEditorInsertion(
  targetId: string,
  targetName: string,
  getValue: () => string,
  setValue: (val: string) => void
) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const getValueRef = useRef(getValue);
  const setValueRef = useRef(setValue);
  getValueRef.current = getValue;
  setValueRef.current = setValue;

  const getAdapter = useCallback((): EditorTargetAdapter => {
    return createTextareaAdapter(
      targetId,
      targetName,
      textareaRef,
      () => getValueRef.current(),
      (val) => setValueRef.current(val)
    );
  }, [targetId, targetName]);

  // Handle focus and selection tracking
  const handleFocus = useCallback(() => {
    cursorManager.setActiveTarget(getAdapter());
  }, [getAdapter]);

  const handleSelect = useCallback(() => {
    if (textareaRef.current) {
      cursorManager.updateSelection(
        textareaRef.current.selectionStart,
        textareaRef.current.selectionEnd
      );
    }
  }, []);

  const handleKeyUp = useCallback(() => {
    handleSelect();
  }, [handleSelect]);

  const handleMouseUp = useCallback(() => {
    handleSelect();
  }, [handleSelect]);

  useEffect(() => {
    // If no active target is registered yet or active target matches this targetId, refresh it
    const current = cursorManager.getActiveTarget();
    if (!current || current.id === targetId) {
      cursorManager.setActiveTarget(getAdapter());
    }
  }, [getAdapter, targetId]);

  const insertText = useCallback(
    (content: string) => {
      return insertContentIntoEditor(content, getAdapter());
    },
    [getAdapter]
  );

  return {
    textareaRef,
    handleFocus,
    handleSelect,
    handleKeyUp,
    handleMouseUp,
    insertText
  };
}

