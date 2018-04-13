import { styleSheet } from 'react-swiss';

export default styleSheet({
  FloatingInputWrapper: {
    _size: ['100%', 'auto'],
    padding: '15px 0',
    paddingBottom: '0',
    '& > input': {
      _size: ['inherit', 'auto'],
      _font: ['16px', '27px', '400'],
      color: '$sw1',
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: '1px solid $sw4',
      padding: '5px 0',
      paddingTop: '27px',
      transition: '.2s ease-in-out',
      '&:focus': {
        outline: 'none',
      },
      '& label': {
        _font: ['15px', '21px', '400'],
        position: 'absolute',
        left: '0',
        top: '46px',
        transition: '.2s ease-in-out',
        userSelect: 'none',
        cursor: 'text',
      },
      standBy: {
        transition: '.2s ease-in-out',
        '& label': {
          _font: ['11px'],
          color: '$sw3',
          top: '25px',
          transition: '.2s ease-in-out',
        }
      },
      active: {
        borderBottom: '1px solid $blue',
        transition: '.2s ease-in-out',
        '& label': {
          _font: ['11px'],
          color: '$blue',
          top: '25px',
          transition: '.2s ease-in-out',
        }
      }
    }
  }
})