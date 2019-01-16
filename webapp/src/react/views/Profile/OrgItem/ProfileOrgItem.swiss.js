import { styleSheet } from 'swiss-react';

export default styleSheet('ProfileOrgItem', {
  Wrapper: {
    _size: ['100%', '50px'],
    _flex: ['row', 'flex-start', 'center'],
    borderBottom: '1px solid $sw3'
  },

  OrgName: {
    _el: 'h1',
    _font: ['18px', '18px', '400'],
    marginRight: 'auto'
  },

  Options: {
    _flex: ['row', 'center', 'center'],
    marginLeft: 'auto'
  },

  UserAmount: {
    _el: 'p',
    _font: ['14px', '18px', '400']
  }
});
