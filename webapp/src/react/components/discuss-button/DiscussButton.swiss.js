export default {
  Wrapper: {
    _size: ['auto', '36px'],
    _flex: 'row',
    borderRadius: '18px',
    overflow: 'hidden',
  },
  Seperator: {
    width: '1px',
    height: '100%',
    position: 'relative',
    background: '$sw4',
    '&::after': {
      content: '',
      width: '1px',
      height: '24px',
      top: '6px',
      left: 0,
      position: 'absolute',
      background: '$sw2',  
    }
  },
  ButtonSide: {
    _size: ['auto', '100%'],
    _flex: ['row', 'center', 'center'],
    padding: '9px 18px',
    background: '$sw4',
    color: '$sw2',
    '&:hover': {
      color: '$blue',
      opacity: .7,
    },
    left: {
      _font: ['12px', '18px', 400],
      borderTopLeftRadius: '18px',
      borderBottomLeftRadius: '18px',
    },
    right: {
      borderTopRightRadius: '18px',
      borderBottomRightRadius: '18px',
      _font: ['12px', '18px', 600],
    }
  },
}