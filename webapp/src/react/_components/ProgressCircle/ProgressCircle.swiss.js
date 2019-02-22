import { styleSheet } from 'swiss-react';

export default styleSheet('ProgressCircle', {
  RadialCircle: {
    _size: '24px',
    backgroundColor: '#D5EDD1',
    borderRadius: '50%'
  },

  Progress: {
    _size: '24px',
    backgroundColor: '#D5EDD1',
    position: 'absolute',
    borderRadius: '50%'
  },

  Mask: {
    _size: '24px',
    backgroundColor: '#D5EDD1',
    position: 'absolute',
    borderRadius: '50%',
    clip: 'rect(0px, 24px, 24px, 12px)',
    transform: get => `rotate(${get('prog')}deg)`,

    left: {
      clip: 'rect(0px, 24px, 24px, 12px)',
      transform: 'none'
    }
  },

  Fill: {
    _size: '24px',
    backgroundColor: '$green1',
    position: 'absolute',
    borderRadius: '50%',
    transform: get => `rotate(${get('prog')}deg)`,
    clip: 'rect(0px, 12px, 24px, 0px)',

    fix: {
      transform: get => `rotate(${get('prog') * 2}deg)`
    }
  }
});
