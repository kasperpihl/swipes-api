import { styleSheet } from 'swiss-react';

export default styleSheet('ExternalNoteView', {
  Wrapper: {
    padding: '0 15px',
    _size: ['100%'],
    overflowY: 'auto'
  },
  Loading: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translateY(-50%) translateX(-50%)'
  }
});
