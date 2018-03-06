export default {
  ATag: {
    background: '$light',
    maxWidth: '200px',
    borderRadius: '15px',
    paddingLeft: '6px',
    paddingRight: '12px',
    userSelect: 'none',
    _flex: ['row', 'left', 'center'],
    display: 'inline-flex',
    width: 'auto',
  },
  IconContainer: {
    _size: '30px',
    _flex: 'center',
    '.attachment-container:hover &': {
      // background: 'yellow',
    },
  },
  Icon: {
    _svgColor: '$middle',
    _size: '24px',
    '.attachment-container:hover &': {
    },
  },
  Text: {
    paddingTop: '1px',
    color: '$middle',
    fontSize: '12px',
    lineHeight: '18px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    fontWeight: 400,
    '.attachment-container:hover &': {
      
    },
  }
}