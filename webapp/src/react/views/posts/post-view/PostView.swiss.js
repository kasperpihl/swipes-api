export default {
  PostMessage: {
    _size: ['100%', 'auto'],
    _font: ['15px', '24px', 300],
    marginTop: '12px',
    maxWidth: '420px',
    color: '$dark'
  },
  PostActions: {
    _size: ['100%', 'auto'],
    marginTop: '12px',
    borderTop: '1px solid $light',
  },
  PostAttachments: {
    _flex: ['row', 'left', 'center'],
    marginTop: '12px',
    '& > *:not(:last-child)': {
      marginRight: '6px',
    }
  }
}