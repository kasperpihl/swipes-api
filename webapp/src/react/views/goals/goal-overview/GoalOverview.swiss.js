export default {
  Footer: {
    _size: ['100%', '54px'],
    borderTop: '1px solid $sw4',
    _flex: ['row', 'right', 'center'],
    padding: '9px 12px',
    '& > *:not(:last-child)': {
      marginRight: '12px',
    },
    '& > *:not(.spacer)': {
      flex: 'none',
    },
  },
  Spacer: {
    width: '100%',
  },
}