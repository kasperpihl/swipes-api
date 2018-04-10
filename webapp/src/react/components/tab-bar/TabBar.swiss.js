export default {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'top'],
  },
  Item: {
    _flex: 'center',
    _font: ['12px', '18px', 500],
    padding: '6px 0',
    color: '$sw2',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    '&:after': {
      position: 'absolute',
      content: '',
      left: 0,
      bottom: 0,
      height: '1px',
      width: '100%',
      background: '$sw1',
      opacity: 0,
      transition: 'opacity .1s',
    },
    active: {
      color: '$sw1',
      '&:after': {
        opacity: 1,
        transition: 'opacity .25s .1s',
      }
    },
    '&:not(:last-child)': {
      marginRight: '24px',
    }
  }
}