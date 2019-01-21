import { styleSheet } from 'swiss-react';

export default styleSheet('AttachButton', {
  HiddenInput: {
    _el: 'input',
    width: '0.1px',
    height: '0.1px',
    opacity: '0',
    overflow: 'hidden',
    position: 'absolute',
    zIndex: '-1',
    pointerEvents: 'none',
  }
});
