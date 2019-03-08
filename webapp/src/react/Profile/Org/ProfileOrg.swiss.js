import { styleSheet } from 'swiss-react';

export default styleSheet('ProfileOrg', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'flex-start', 'center'],
    _textStyle: 'body',
    fontWeight: '$medium',
    color: '$sw1',
    borderBottom: '1px solid $sw3',
    padding: '12px 0',

    '&:first-child': {
      padding: '0px 0px 12px 0px'
    },

    '&:hover': {
      backgroundColor: '$green2'
    }
  },

  OrgName: {
    _el: 'h1',
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'center'],
    _textStyle: 'body'
  },

  Options: {
    _size: ['160px', 'auto'],
    _flex: ['row', 'flex-end', 'center'],
    flexShrink: '0'
  },

  OrganizationInfo: {
    _el: 'p',
    _textStyle: 'body',
    color: '$sw2',
    flexShrink: '0',

    error: {
      color: '$red'
    },

    right: {
      _size: ['50px', 'auto'],
      _flex: ['row', 'flex-end', 'center'],
      marginLeft: '12px'
    }
  }
});
