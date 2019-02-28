import { styleSheet } from 'swiss-react';

export default styleSheet('StepSlider', {
  InputPackage: {
    _size: ['100%', '24px'],
    _flex: ['row', 'center', 'center'],
    position: 'relative'
  },

  InputButton: {
    _el: 'button',
    _size: '25px',
    cursor: 'pointer',
    flex: 'none',

    '&:before': {
      content: '',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translateX(-50%) translateY(-50%)',
      width: '8px',
      height: '1px',
      backgroundColor: '$dark'
    },

    right: {
      _size: '25px',
      flex: 'none',

      '&:before': {
        content: '',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%) translateY(-50%)',
        width: '8px',
        height: '1px',
        backgroundColor: '$dark'
      },

      '&:after': {
        content: '',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%) translateY(-50%)',
        height: '8px',
        width: '1px',
        backgroundColor: '$dark'
      },

      deactivated: {
        '&:before': {
          opacity: '0.5'
        },

        '&:after': {
          opacity: '0.5'
        }
      }
    },

    deactivated: {
      '&:before': {
        opacity: '0.5'
      }
    }
  },

  Input: {
    _el: 'input',
    height: '1px',
    width: '100%',
    '-webkit-appearance': 'none',
    '-moz-appearance': 'none',
    backgroundColor: '$sw3',
    boxSizing: 'border-box',
    fontSize: '5px',
    border: 'none',
    cursor: 'pointer',
    margin: '0 6px',

    '&:focus': {
      outline: 'none'
    },

    '&::-webkit-slider-container': {
      backgroundColor: '$sw3',
      '-webkit-appearance': 'none'
    },

    '&::-webkit-slider-runnable-track': {
      _flex: ['row', 'left', 'center'],
      height: '3px',
      backgroundColor: '$dark',
      borderRadius: '1.5px',
      background: get =>
        `linear-gradient(to right, $dark 0%, $dark ${get(
          'colorValue'
        )}%, $sw4 ${get('colorValue')}%, $sw4 100%)`,
      '-webkit-appearance': 'none'
    },

    '&::-webkit-slider-thumb': {
      _size: '13px',
      backgroundColor: '$base',
      borderRadius: '50%',
      border: '1px solid $sw3',
      '-webkit-appearance': 'none'
    },

    '&::-moz-range-track': {
      width: '100%',
      backgroundColor: '#C7C6C5'
    },

    '&::-moz-range-track:before': {
      content: '',
      position: 'absolute',
      top: '7px',
      left: '7px',
      right: '7px',
      bottom: '7px'
    },

    '&::-moz-range-thumb': {
      _size: '13px',
      backgroundColor: '$base',
      borderRadius: '50%',
      border: '1px solid $sw3',
      '-webkit-appearance': 'none'
    },

    '&::-moz-focus-outer': {
      border: '0'
    }
  }
});
