import { styleSheet } from 'swiss-react';

export default styleSheet('TeamPendingInvites', {
  Wrapper: {
    _size: ['100%', 'auto'],
    display: 'none',
    margin: '24px 18px 0 36px',

    show: {
      _flex: ['column', 'flex-start', 'flex-start']
    }
  },

  PendingInvites: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start']
  },

  InviteItem: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'flex-end', 'center']
  },

  InviteEmail: {
    _textStyle: 'body',
    color: '$sw2',
    marginRight: 'auto'
  },

  ButtonWrapper: {
    '&:not(:last-child)': {
      marginRight: '12px'
    }
  }
});
