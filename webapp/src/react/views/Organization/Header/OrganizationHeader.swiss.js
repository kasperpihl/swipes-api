import { styleSheet } from 'swiss-react';

export default styleSheet('OrganizationHeader', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'flex-start', 'center']
  },

  Title: {
    _el: 'h1',
    _textStyle: 'cardTitle'
  },

  SubscriptionStatus: {
    _flex: ['row', 'center', 'center'],
    _textStyle: 'labelDark',
    marginLeft: 'auto',
    flexShrink: '0'
  },

  Container: {
    _flex: ['row', 'center', 'center']
  },

  Indicator: {
    _size: '10px',
    borderRadius: '50%',
    backgroundColor: get => get('color') || '$sw3',
    flexShrink: '0',
    margin: '0 4px'
  }
});
