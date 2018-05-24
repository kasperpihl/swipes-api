import { styleSheet } from 'swiss-react';

export default styleSheet('AutoCompleting', {
  Wrapper: {
    position: 'fixed',
    boxShadow: '0 1px 20px 3px rgba($sw2, .1)',
    zIndex: 9999,
    overflow: 'hidden',
    borderRadius: '3px',
    backgroundColor: 'white',
    visibility: 'hidden',
    pointerEvents: 'none',
    overflowY: 'scroll',
    show: {
      visibility: 'visible',
      pointerEvents: 'all',
    }
  },
  Item: {
    padding: '0 18px',
    selected: {
      backgroundColor: '$blue',
    },
  }
});
