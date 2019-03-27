import { styleSheet } from 'swiss-react';
import TextareaAutosize from 'react-textarea-autosize';

export default styleSheet('ProjectTaskInput', {
  Input: {
    _el: TextareaAutosize,
    _textStyle: 'H3',
    width: '100%',
    borderRadius: '3px',
    padding: '0 6px',
    resize: 'none',
    border: 'none',
    outline: 'none',
    boxShadow: 'none',
    overflowY: 'hidden',

    isCompleted: {
      opacity: '0.5'
    }
  }
});
