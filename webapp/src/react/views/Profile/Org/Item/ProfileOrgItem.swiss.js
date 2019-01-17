import { styleSheet } from 'swiss-react';

export default styleSheet('ProfileOrgItem', {
  Wrapper: {
    _size: ['100%', '50px'],
    _flex: ['row', 'flex-start', 'center'],
    borderBottom: '1px solid $sw3'
  },

  OrgName: {
    _el: 'h1',
    _textStyle: 'item',
    marginRight: 'auto'
  },

  Options: {
    _flex: ['row', 'center', 'center'],
    marginLeft: 'auto'
  },

  UserAmount: {
    _el: 'p',
    _textStyle: 'labelDark',
    marginRight: '12px'
  }
});
