import { useEffect, useCallback } from 'react';

export default function useProjectKeyboard(stateManager) {
  const handleKeyDown = useCallback(
    e => {
      if (!stateManager) return;
      const localState = stateManager.getLocalState();

      const selectedId = localState.get('selectedId');
      if (!selectedId) return;
      if (e.keyCode === 8) {
        // Backspace
        if (e.target.selectionStart === 0 && e.target.selectionEnd === 0) {
          e.preventDefault();
          stateManager.editHandler.delete(selectedId);
        }
      } else if (e.keyCode === 9) {
        // Tab
        e.preventDefault();
        if (e.shiftKey) stateManager.indentHandler.outdent(selectedId);
        else stateManager.indentHandler.indent(selectedId);
      } else if (e.keyCode === 13) {
        e.preventDefault();
        stateManager.editHandler.enter(selectedId, e.target.selectionStart);
      } else if (e.keyCode === 38) {
        // Up arrow
        e.preventDefault();
        if (e.metaKey || e.ctrlKey) {
          stateManager.expandHandler.collapse(selectedId);
        } else {
          stateManager.selectHandler.selectPrev(e.target.selectionStart);
        }
      } else if (e.keyCode === 40) {
        // Down arrow
        e.preventDefault();
        if (e.metaKey || e.ctrlKey) {
          stateManager.expandHandler.expand(selectedId);
        } else {
          stateManager.selectHandler.selectNext(e.target.selectionStart);
        }
      } else if (e.keyCode === 90 && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) {
          stateManager.undoHandler.redo();
        } else {
          stateManager.undoHandler.undo();
        }
      }
    },
    [stateManager]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
