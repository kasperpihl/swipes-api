import { styleSheet } from 'swiss-react';

export default styleSheet('DiscussOverview', {
  Wrapper: {
    _flex: ['row', 'left', 'top'],
    _size: '100%',
    paddingLeft: '18px',
    borderTop: '1px solid $sw3',
  },
  SidebarWrapper: {
    _size: ['160px', '100%'],
    minHeight: '100%',
    paddingRight: '6px',
    paddingTop: '12px',
    borderRight: '1px solid $sw3',
  },
  ContentWrapper: {
    _size: '100%',
  },
  Section: {
    _font: ['12px', '18px', 500],
    color: '$sw2',
    padding: '6px 12px',
    '&:not(:first-child)': {
      marginTop: '12px',
    }
  },
  Item: {
    padding: '6px 6px 6px 12px',
    _font: ['14px', '18px', 400],
    _flex: ['row', 'between', 'center'],
    borderRadius: '15px',
    '!active': {
      '&:hover': {
        background: '$sw3',
      },
    },
    active: {
      background: '$sw3',
    },
    unread: {
      // fontWeight: 600,
    },
  },
  Notification: {
    display: ({ children }) => children ? 'block': 'none',
    height: '18px',
    textAlign: 'center',
    borderRadius: '9px',
    background: '$red',
    color: '$sw5',
    _font: ['12px', '18px', 500],
    minWidth: '18px',
  }
});