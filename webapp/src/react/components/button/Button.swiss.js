export default {
  ATag: {
    userSelect: 'none',
    _flex: ['row', 'left', 'center'],
    display: 'inline-flex',
    width: 'auto',
  },
  IconContainer: {
    background: '$sw4',
    _size: '36px',
    _flex: 'center',
    borderRadius: '18px',
    '!compact': {
      '.gl-button:hover &': {
        opacity: .7,
      },    
    },
    compact: {
      background: 'none',
      borderRadius: 0,
    },

  },
  Icon: {
    _svgColor: '$sw2',
    _size: '24px',
    '.gl-button:hover &': {
      _svgColor: '$blue',
    },
  },
  Text: {
    paddingTop: '1px',
    paddingLeft: '6px',
    color: '$sw2',
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: 400,
    compact: {
      paddingLeft: 0,
    },
    '.gl-button:hover &': {
      color: '$blue',
    },
  }
}