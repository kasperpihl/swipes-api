import {styleSheet} from 'swiss-react';

export default styleSheet('Invite', {
  Wrapper: {
    padding: '30px 0'
  },

  FormWrapper: {
    paddingTop: '30px',
  },

  Hint: {
    _font: ['15px', '24px', '400'],
    color: '$blue20',
    marginTop: '12px',
    fontStyle: 'italic',
  },

  SendButton: {
    display: 'inline-block',
    float: 'right',
    marginTop: '9px',

    '@media $max600': {
      width: '100%',
      margin: '9px auto',
    }
  }
})
