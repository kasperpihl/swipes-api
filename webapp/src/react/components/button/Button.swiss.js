export default {
  ATag: {
    userSelect: 'none',
    _flex: ['row', 'left', 'center'],
    display: 'inline-flex',
    width: 'auto',
  },
  Background: {
    _flex: ['row', 'left', 'center'],
    background: '$sw4',
    borderRadius: '18px',
    '!compact': {
      '.gl-button:hover &': {
        opacity: .7,
      },
    },
    compact: {
      background: 'none',
    },
  },
  IconContainer: {
    _size: '36px',
    _flex: 'center',
    compact: {
      _size: '30px',
    }
  },
  Icon: {
    _svgColor: '$sw2',
    _size: '24px',
    '.gl-button:hover &': {
      _svgColor: '$blue',
    },
  },
  Title: {
    _font: ['12px', '18px', 400],
    color: '$sw2',
    padding: '9px 18px',
    hasIcon: {
      paddingLeft: '0px',
    },
    '.gl-button:hover &': {
      color: '$blue',
    },
  },
  SideLabel: {
    _font: ['12px', '18px', 400],
    paddingTop: '1px',
    paddingLeft: '12px',
    color: '$sw2',
    compact: {
      paddingLeft: 0,
    },
    '.gl-button:hover &': {
      color: '$blue',
    },
  }
}