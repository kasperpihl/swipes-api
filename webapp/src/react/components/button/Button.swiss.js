// darkGrey
// lightGray
// grey

export default {
  ATag: {
    userSelect: 'none',
    _flex: ['row', 'left', 'center'],
    display: 'inline-flex',
    width: 'auto',
  },
  IconContainer: {
    background: '$light',
    _size: '36px',
    _flex: 'center',
    borderRadius: '18px',
    compact: {
      background: 'none',
      borderRadius: 0,
    },
    '.gl-button:hover &': {
      // background: 'yellow',
    },
  },
  Icon: {
    _svgColor: '$middle',
    _size: '24px',
    '.gl-button:hover &': {
    },
  },
  Text: {
    paddingTop: '1px',
    paddingLeft: '6px',
    color: '$middle',
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: 400,
    compact: {
      paddingLeft: 0,
    },
    '.gl-button:hover &': {
      
    },
  }
}