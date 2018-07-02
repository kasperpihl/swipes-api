import { styleSheet } from 'swiss-react';

export default styleSheet('CompatibleHeader',{
  Wrapper: {
    _size: ['100%', 'auto'],
    paddingTop: '21px',

    'center': {
      textAlign: 'center',
    },

    '@media $maxH800': {
      paddingTop: '21px',
    },
  },
  TitleContainer: {
    _size: ['100%', 'auto'],
    '& h1': {
      _font: ['36px', '48px', '300'],
      color: '$sw1',
      '@media $max600': {
        _font: ['30px', '39px', 300],
        display: 'block',
        textAlign: 'center',
      },
    },
    '& h3': {
      _font: ['15px', '24px', '400'],
      color: '$sw2',
      marginTop: '10px',

      '@media $max600': {
        display: 'block',
        textAlign: 'center',
      },
    },
  },
})
