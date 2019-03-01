import { styleSheet } from 'swiss-react';

export default styleSheet('ProjectList', {
  Wrapper: {
    padding: '0 30px',
    paddingTop: '24px'
  },

  Name: {
    _textStyle: 'caption',
    color: '$sw2',
    width: '100px',
    marginLeft: '60px'
  },

  Team: {
    _textStyle: 'caption',
    color: '$sw2',
    marginLeft: '150px'
  }
});
