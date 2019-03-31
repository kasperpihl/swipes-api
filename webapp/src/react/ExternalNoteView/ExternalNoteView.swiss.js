import { styleSheet } from 'swiss-react';

export default styleSheet('ExternalNoteView', {
  Wrapper: {
    padding: '0 15px',
    _size: ['100%'],
    flex: 1,
    _flex: ['column', 'center', 'top']
  },
  Loading: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translateY(-50%) translateX(-50%)'
  }
});
