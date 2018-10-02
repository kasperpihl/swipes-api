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

  SplitImageWrapper: {
    flex: 'none',
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
})
