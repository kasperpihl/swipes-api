import { styleSheet } from 'swiss-react';

export default styleSheet('LogoutButton', {
  Wrapper: {
    _size: ['auto', '36px'],
    _borderRadius: '18px',
    border: '1px solid $sw3',
    float: 'right',
    marginTop: '30px',
    transition: '.2s ease',
    loading: {
      border: 'none',
    },
    '!loading': {
      '&:hover': {
        backgroundColor: '$sw3',
        transition: '.2s ease',
      }
    }
  },
  Label: {
    _font: ['13px', '34px'],
    color: '$sw2',
    padding: '0 15px',
    loading: {
      border: 'none',
      display: 'none',
    }
  },
  Loader: {
    _size: ['36px'],
    display: 'none',
    loading: {
      border: 'none',
      display: 'block',
    }
  }
})