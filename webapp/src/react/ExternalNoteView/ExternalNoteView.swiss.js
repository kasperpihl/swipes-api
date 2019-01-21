import { styleSheet } from 'swiss-react';

export default styleSheet('ExternalNoteView', {
  Wrapper: {
    padding: '0 15px',
    width: '100%',
  },
  Loading: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translateY(-50%) translateX(-50%)',
  },
});