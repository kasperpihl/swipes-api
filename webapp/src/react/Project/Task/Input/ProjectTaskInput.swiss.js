import { styleSheet } from 'swiss-react';
import TextareaAutosize from 'react-textarea-autosize';

export default styleSheet('ProjectTaskInput', {
  Input: {
    _el: TextareaAutosize,
    _textStyle: 'H3',
    width: '100%',
    minHeight: '26px',
    borderRadius: '3px',
    padding: '4px 6px',
    paddingBottom: 0,
    resize: 'none',
    border: 'none',
    outline: 'none',
    boxShadow: 'none',
    overflowY: 'hidden',
    isAttachment: {
      pointerEvents: 'none',
      '.ProjectTask_Wrapper:hover &': {
        '&:not(:focus)': {
          color: '$blue'
        }
      }
    },
    isCompleted: {
      opacity: '0.5'
    }
  }
});
