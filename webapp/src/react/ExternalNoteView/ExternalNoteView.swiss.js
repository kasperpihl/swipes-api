import { styleSheet, addGlobalStyles } from 'swiss-react';

addGlobalStyles({
  'body, html': {
    height: 'auto !important',
    overflow: 'auto !important'
  }
});

export default styleSheet('ExternalNoteView', {
  Wrapper: {
    padding: '0 15px',
    _size: ['100%']
  },
  Loading: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translateY(-50%) translateX(-50%)'
  }
});
