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
      background: '$sw3',
    }
  },
  IconContainer: {
    _size: '30px',
    _flex: 'center',
  },
  Icon: {
    _svgColor: '$sw2',
    _size: '24px',
  },
  Text: {
    paddingTop: '1px',
    color: '$sw2',
    fontSize: '12px',
    lineHeight: '18px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    fontWeight: 400,
  }
}