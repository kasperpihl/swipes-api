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
    _flex: ['row', 'left', 'center'],
    marginTop: '12px',
    borderTop: '1px solid $light',
    '& > *:not(:last-child)': {
      marginRight: '10px',
    },
    '& .button': {
      flex: 'none',
    }
  },
  ActionSpacer: {
    width: '100%',
  },
  PostAttachments: {
    _flex: ['row', 'left', 'center'],
    flexWrap: 'wrap',
    marginTop: '6px',
    '& > *': {
      marginTop: '6px',
    },
    '& > *:not(:last-child)': {
      marginRight: '6px',
    }
  },

}