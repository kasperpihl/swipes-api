import { styleSheet } from 'swiss-react';

export default styleSheet('StepSlider', {
  InputPackage: {
    _size: ['calc(100% - 48px)', '24px'],
    _flex: ['row', 'center', 'center'],
    position: 'relative'
  },

  InputButton: {
    _el: 'button',
    position: 'absolute',
    left: '-24px',
    top: '0px',
    _size: '24px',
    cursor: 'pointer',

    '&:before': {
      content: '',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translateX(-50%) translateY(-50%)',
      width: '12px',
      height: '2px',
      backgroundColor: '#2E2E2D'
    },

    right: {
      position: 'absolute',
      right: '-24px',
      top: '0px',
      left: 'initial',
      _size: '24px',

      '&:before': {
        content: '',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%) translateY(-50%)',
        width: '12px',
        height: '2px',
        backgroundColor: '#2E2E2D'
      },

      '&:after': {
        content: '',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%) translateY(-50%)',
        height: '12px',
        width: '2px',
        backgroundColor: '#2E2E2D'
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
    height: '2px',
    width: '100%',
    '-webkit-appearance': 'none',
    '-moz-appearance': 'none',
    backgroundColor: '$sw3',
    boxSizing: 'border-box',
    fontSize: '5px',
    border: 'none',
    cursor: 'pointer',

    '&:focus': {
      outline: 'none'
    },

    '&::-webkit-slider-container': {
      '-webkit-appearance': 'none',
      backgroundColor: '$sw3'
    },

    '&::-webkit-slider-runnable-track': {
      '-webkit-appearance': 'none'
    },

    '&::-webkit-slider-thumb': {
      '-webkit-appearance': 'none',
      backgroundColor: '$sw1',
      width: '5px',
      height: '14px'
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
      backgroundColor: '#121317',
      width: '3px',
      height: '15px',
      borderRadius: '0px'
    },

    '&::-moz-focus-outer': {
      border: '0'
    }
  }
});
