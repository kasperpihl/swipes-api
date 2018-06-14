import { styleSheet } from 'swiss-react';

export default styleSheet('DiscussButton', {
  Wrapper: {
    _size: ['auto', '36px'],
    _flex: 'row',
    borderRadius: '18px',
    border: '1px solid $sw3',
    overflow: 'hidden',
  },
  Seperator: {
    width: '1px',
    height: '100%',
    position: 'relative',
    background: '$sw3',
    '&::after': {
      content: '',
      width: '1px',
      height: '24px',
      top: '6px',
      left: 0,
      position: 'absolute',
      background: '$sw3',
    }
  },
  ButtonSide: {
    _size: ['auto', '100%'],
    _flex: ['row', 'center', 'center'],
    padding: '9px 18px',
    color: '$sw1',
    '&:hover': {
      color: '$blue',
      background: '$sw3',
    },
    left: {
      _font: ['12px', '18px', 400],
      borderTopLeftRadius: '18px',
      borderBottomLeftRadius: '18px',
    },
    right: {
      borderTopRightRadius: '18px',
      borderBottomRightRadius: '18px',
      _font: ['12px', '18px', 500],
    }
  },
});
