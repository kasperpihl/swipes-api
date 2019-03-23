import { styleSheet } from 'swiss-react';

export default styleSheet('Spacing', {
  Wrapper: {
    flex: '1',
    height: {
      height: get => {
        if (typeof get('height') === 'number') {
          return `${get('height')}px`;
        }
        return get('height');
      },
      '!width': {
        flex: 'none',
        width: '100%'
      }
    },
    width: {
      width: get => {
        if (typeof get('width') === 'number') {
          return `${get('width')}px`;
        }
        return get('width');
      },
      '!height': {
        flex: 'none',
        height: '100%'
      }
    }
  }
});
