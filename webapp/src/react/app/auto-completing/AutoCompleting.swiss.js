import { styleSheet } from 'swiss-react';

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
    showOnTop: {},
    boundingRect: {},
    show: {
      visibility: 'visible',
      pointerEvents: 'all',
      width: '360px',
      height: '250px',
      top: get => {
        if (get('showOnTop')) {
          return `${get('boundingRect').top - 250}px`;
        }

        return `${get('boundingRect').bottom}px`;
      },
      left: get => {
        return `${get('boundingRect').left}px`;
      }
    }
  },
  Item: {
    padding: '0 18px',
    selected: {
      backgroundColor: '$sw3'
    }
  }
});
