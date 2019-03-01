import { styleSheet } from 'swiss-react';

export default styleSheet('PlanSidePicker', {
  Wrapper: {
    padding: '12px 0'
  },
  Title: {
    _textStyle: 'caption',
    color: '$sw2',
    textTransform: 'uppercase'
  },
  Day: {
    height: '30px',
    margin: '8px 0 18px 0'
  },

  InputContainer: {
    _flex: ['row', 'left', 'center'],
    _size: ['100%', '30px'],
    margin: '8px 0 32px 0 '
  },

  InputWrapper: {
    _flex: ['row', 'center', 'center'],
    width: '66px',
    height: '100%',
    border: '1px solid $sw4',
    padding: '6px',
    flex: 'none',

    '&:first-child': {
      borderRadius: '2px 0 0 2px',
      borderRight: 'none'
    },

    '&:not(:first-child)': {
      borderRadius: '0 2px 2px 0',
      borderLeft: 'none'
    },

    checked: {
      background: '$dark'
    }
  },

  Input: {
    _el: 'input',
    position: 'absolute',
    opacity: '0',
    width: '0'
  },

  InputText: {
    _textStyle: 'body',
    fontWeight: 'bold',

    checked: {
      color: 'white'
    }
  }
});
