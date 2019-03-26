import { styleSheet } from 'swiss-react';

export default styleSheet('StepSlider', {
  InputPackage: {
    _size: ['100%', '24px'],
    _flex: ['row', 'center', 'center'],
    position: 'relative'
  },

  StepCounter: {
    _textStyle: 'caption',
    _flex: ['row', 'center', 'center'],
    border: '1px solid $sw2',
    borderRadius: '2px',
    color: '$sw2',
    padding: '1px 6px',
    userSelect: 'none'
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
        )}%, $sw3 ${get('colorValue')}%, $sw3 100%)`,
      '-webkit-appearance': 'none'
    },

    '&::-webkit-slider-thumb': {
      _size: '13px',
      backgroundColor: '$base',
      borderRadius: '50%',
      border: '1px solid $sw2',
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
