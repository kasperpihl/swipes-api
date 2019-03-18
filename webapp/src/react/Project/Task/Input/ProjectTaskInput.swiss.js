import { styleSheet } from 'swiss-react';
import TextareaAutosize from 'react-textarea-autosize';

export default styleSheet('ProjectTaskInput', {
  Input: {
    _el: TextareaAutosize,
    _textStyle: 'H3',
    width: '100%',
    minHeight: '18px',
    borderRadius: '3px',
    paddingLeft: '6px',
    resize: 'none',
    border: 'none',
    outline: 'none',
    boxShadow: 'none'
  }
});
