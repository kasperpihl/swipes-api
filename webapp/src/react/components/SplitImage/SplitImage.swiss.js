import { styleSheet } from 'swiss-react';

export default styleSheet('SplitImage', {
  Container: {
    width: get => `${get('size')}px`,
    height: get => `${get('size')}px`,
    position: 'relative'
  },

  Left: {
    _size: '100%',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
    borderRadius: '50%',
    'numberOfImages>1': {
      _size: '67%'
    }
  },

  Right: {
    _size: '67%',
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 1,
    borderRadius: '50%',
    overflow: 'hidden'
  }
});
