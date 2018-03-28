export default {
  PostMessage: {
    _size: ['100%', 'auto'],
    _font: ['15px', '24px', 300],
    marginTop: '12px',
    maxWidth: '420px',
    color: '$sw1'
  },
  PostActions: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'center'],
    paddingLeft: '9px',
    marginTop: '12px',
    borderTop: '1px solid $sw4',
    '& > *:not(:last-child)': {
      marginRight: '10px',
    },
    '& .gl-button': {
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