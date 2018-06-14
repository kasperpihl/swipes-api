import { styleSheet } from 'swiss-react';

export default styleSheet('NotificationItem', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'top'],
    padding: '9px 14px',
    borderBottom: '1px solid $sw3',

    unread: {
      backgroundColor: '$blue5',
    },
  },

  NotificationImage: {
    _size: ['54px'],
    borderRadius: '3px'
  },

  Initials: {
    _size: ['54px'],
    _flex: ['row', 'center', 'center'],
    backgroundColor: '$sw2',
    borderRadius: '3px',
  },

  Content: {
    _size: ['100%', 'auto'],
    paddingLeft: '9px',
    paddingRight: '15px',
  },

  TimeStamp: {
    _font: ['12px', '18px', '500'],
    color: '$sw2',
    paddingTop: '3px',
  },

  Message: {
    overflow: 'hidden',
    maxHeight: '31px',
  },

  Text: {
    _font: ['11px', '15px'],
    color: 'black',
  },

  StyledButton: {
    _font: ['12px', '15px', '500'],
    color: 'black',
  },

})
