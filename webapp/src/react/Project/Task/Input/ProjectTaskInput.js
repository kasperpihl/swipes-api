import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  useContext,
  memo
} from 'react';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';
import useUnmountedRef from 'src/react/_hooks/useUnmountedRef';
import { ProjectContext } from 'src/react/contexts';

import SW from './ProjectTaskInput.swiss';

export default memo(ProjectTaskInput);

function ProjectTaskInput({ taskId, onClick, isCompleted }) {
  const stateManager = useContext(ProjectContext);
  const unmountedRef = useUnmountedRef();
  const inputRef = useRef();
  const [isFocused, setIsFocused] = useState(false);

  const [title, isSelected, selectionStart] = useProjectSlice(
    stateManager,
    (clientState, localState) => [
      clientState.getIn(['tasks_by_id', taskId, 'title']),
      localState.get('selectedId') === taskId,
      localState.get('selectedId') === taskId &&
        localState.get('selectionStart')
    ]
  );

  const handleFocus = useCallback(() => {
    stateManager.selectHandler.select(taskId);

    setIsFocused(true);
  });

  const handleBlur = useCallback(() => {
    stateManager.selectHandler.deselect(taskId);
    !unmountedRef.current && setIsFocused(false);
  });

  const handleChange = useCallback(e => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
    stateManager.editHandler.updateTitle(taskId, e.target.value.substr(0, 255));
  });

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (isSelected && !isFocused) {
        inputRef.current.focus();
        if (typeof selectionStart === 'number') {
          const selI = Math.min(title.length, selectionStart);

          inputRef.current.setSelectionRange(selI, selI);
        }
      } else if (!isSelected && isFocused) {
        inputRef.current.blur();
      }
    }, 1);
    return () => {
      clearTimeout(timerId);
    };
  });

  return (
    <SW.Input
      onClick={onClick}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder="Write a task"
      value={title}
      isCompleted={isCompleted}
      inputRef={c => (inputRef.current = c)}
    />
  );
}
