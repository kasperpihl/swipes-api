import { styleSheet } from 'swiss-react';
import InputToggle from '_shared/Input/Toggle/InputToggle';

export default styleSheet('ModalCreate', {
  Wrapper: {
    _size: ['450px', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start']
  },

  CheckboxWrapper: {
    _flex: ['row', 'left', 'center'],
    padding: '6px 9px',
    checked: {
      backgroundColor: '$green4'
    },

    disabled: {
      opacity: '0.5',
      pointerEvents: 'none',
      userSelect: 'none'
    }
  },

  Input: {
    _el: 'input',
    _size: '0',
    opacity: '0'
  },

  CheckboxValue: {
    _textStyle: 'body',
    userSelect: 'none'
  },

  ToggleWrapper: {
    _flex: ['row', 'left', 'flex-end'],
    height: '25px',
    marginRight: 'auto'
  },

  InputWrapper: {
    marginLeft: '12px'
  }
});
