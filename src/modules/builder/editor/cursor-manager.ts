import { EditorSelectionRange, EditorTargetAdapter } from '../types/template';

class CursorManager {
  private activeTarget: EditorTargetAdapter | null = null;
  private lastSavedRange: EditorSelectionRange = { start: 0, end: 0 };
  private listeners: Set<(target: EditorTargetAdapter | null) => void> = new Set();
  private selectionListeners: Set<(range: EditorSelectionRange) => void> = new Set();

  setActiveTarget(target: EditorTargetAdapter | null) {
    this.activeTarget = target;
    if (target) {
      this.lastSavedRange = target.getSelection();
      this.notifySelection();
    }
    this.notify();
  }

  updateSelection(start: number, end: number) {
    this.lastSavedRange = { start, end };
    this.notifySelection();
  }

  getActiveTarget(): EditorTargetAdapter | null {
    return this.activeTarget;
  }

  getSavedRange(): EditorSelectionRange {
    return this.lastSavedRange;
  }

  subscribe(listener: (target: EditorTargetAdapter | null) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  onSelectionChange(listener: (range: EditorSelectionRange) => void): () => void {
    this.selectionListeners.add(listener);
    return () => this.selectionListeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.activeTarget));
  }

  private notifySelection() {
    this.selectionListeners.forEach((listener) => listener(this.lastSavedRange));
  }
}

export const cursorManager = new CursorManager();

