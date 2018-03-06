export default {
  Container: {
    _flex: ['row', 'left', 'top'],
    marginTop: '12px',
    width: '100%',
  },
  Picture: {
    flex: 'none',
    _size: '36px',
  },
  Content: {
    _flex: ['column', 'left', 'top'],
    width: '100%',
    paddingLeft: '12px',
    paddingRight: '12px',
  },
  Actions: {
    _flex: ['column', 'center', 'top'],
  },
  Name: {
    _font: ['12px', '18px', 500],
    color: '$dark',
  },
  Timestamp: {
    _font: ['12px', '18px', 400],
    color: '$middle',
  },
  Message: {
    _font: ['12px', '18px', 300],
    color: '$dark',
  },
  Attachments: {
    marginTop: '6px',
  },
}