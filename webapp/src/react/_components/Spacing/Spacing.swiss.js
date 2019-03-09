import { styleSheet } from 'swiss-react';

export default styleSheet('Spacing', {
  Wrapper: {
    flex: 'none',
    height: {
      height: get => `${get('height')}px`,
      '!width': {
        width: '100%'
      }
    },
    width: {
      width: get => `${get('width')}px`,
      '!height': {
        height: '100%'
      }
    }
  }
});
