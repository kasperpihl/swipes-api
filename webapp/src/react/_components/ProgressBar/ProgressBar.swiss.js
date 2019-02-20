import { styleSheet } from 'swiss-react';

export default styleSheet('ProgressBar', {
  Wrapper: {
    _size: ['130px', '6px'],
    overflow: 'hidden',
    borderRadius: '3px'
  },

  BackgroundLayer: {
    _size: '100%',
    backgroundColor: '$green',
    opacity: '0.5'
  },

  Bar: {
    width: get => `${get('progress')}%`,
    height: '100%',
    backgroundColor: '$green',
    borderRadius: '3px',
    position: 'absolute',
    top: '0',
    left: '0'
  }
});
