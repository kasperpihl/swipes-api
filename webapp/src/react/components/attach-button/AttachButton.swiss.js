import { styleSheet } from 'react-swiss';

export default styleSheet('AttachButton', {
  HiddenInput: {
    width: '0.1px',
    height: '0.1px',
    opacity: '0',
    overflow: 'hidden',
    position: 'absolute',
    zIndex: '-1',
    pointerEvents: 'none',
  }
});