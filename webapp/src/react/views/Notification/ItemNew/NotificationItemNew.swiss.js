import { styleSheet } from 'swiss-react';
import StyledText from 'components/styled-text/StyledText';

export default styleSheet('NotificationItemNew', {
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
    _el: 'img',
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
    lineHeight: 1,
  },

  Text: {
    _el: 'span',
    _font: ['12px', '12px'],
    color: 'black',
  },

  StyledButton: {
    _font: ['12px', '15px', '500'],
    color: 'black',
  },

})
