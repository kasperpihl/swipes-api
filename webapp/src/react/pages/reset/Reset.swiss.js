import { styleSheet } from 'swiss-react';


export default styleSheet('Reset', {
  Wrapper: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    _size: ['70%', 'auto'],
    transform: 'translateY(-50%) translateX(-50%)',
    maxWidth: '720px',

    '@media $min600': {
      minWidth: '560px',
    }
  },

  Loading: {
    textAlign: 'center',
  },

  Form: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
  },

  FormTitle: {
    _el: 'h6',
    _font: ['36px', '48px', '300'],
    color: '$sw1',
    paddingBottom: '36px',

    '@media $max600': {
      _font: ['18px', '24px', '300'],
    },
  },

  Button: {
    marginTop: '24px',
    _size: ['auto', '36px'],
    _font: ['12px', '36px', '500'],
    color: 'white',
    backgroundColor: '$blue',
    borderRadius: '100px',
    padding: '0 12px',
    float: 'right',
    cursor: 'pointer',
    zIndex: '2',
    alignSelf: 'flex-end',

    '&:hover': {
      backgroundColor: '$blue80',
    },
  },
});
