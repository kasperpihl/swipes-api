export default {
  PostHeaderWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'top'],
    backgroundColor: 'white',
  },
  LeftSide: {
    flex: 'none',
  },
  RightSide: {
    width: '100%',
    _flex: ['column', 'left', 'top'],
    paddingLeft: '18px',
  },
  NameTypeWrapper: {
    _flex: ['row', 'between', 'top'],
    width: '100%',
  },
  NameTitle: {
    color: '$sw1',
    _font: ['15px', '24px', 400],
  },
  Subtitle: {
    color: '$sw2',
    marginTop: '3px',
    _font: ['12px', '18px', 400],
  },
  PostType: {
    marginTop: '3px',
    fontSize: '11px',
    lineHeight: '18px',
    fontWeight: 500,
    textTransform: 'capitalize',
    color: '$information',
    '&:after': {
      content: '',
      display: 'inline-block',
      width: '12px',
      height: '12px',
      transform: 'translateY(2px)',
      marginLeft: '6px',
      borderRadius: '6px',
      backgroundColor: '$information',
    },
  },
}