export default {
  ATag: {
    background: '$sw4',
    maxWidth: '200px',
    borderRadius: '15px',
    paddingLeft: '6px',
    paddingRight: '12px',
    userSelect: 'none',
    _flex: ['row', 'left', 'center'],
    display: 'inline-flex',
    width: 'auto',
    '&:hover': {
      opacity: .7,
    }
  },
  IconContainer: {
    _size: '30px',
    _flex: 'center',
  },
  Icon: {
    _svgColor: '$sw2',
    _size: '24px',
    isContext: {
      _size: '18px',
      hasCloseIcon: {
        _size: '24px',
      }
    },
    '!hasCloseIcon': {
      '.attachment-container:hover &': {    
        _svgColor: '$blue',
      }
    },
    
    hasCloseIcon: {
      '.icon-container:hover &': {
        _svgColor: '$blue',
      }
    }
  },
  Text: {
    color: '$sw2',
    fontSize: '12px',
    lineHeight: '18px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    fontWeight: 400,
    '.attachment-container:hover &': {
      color: '$blue',
    },
    hasCloseIcon: {
      '.icon-container:hover + &': {
        color: '$sw2',
      }
    }
  }
}