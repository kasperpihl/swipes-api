import { styleSheet } from 'react-swiss';

export default styleSheet('CompatibleHeader',{
  Wrapper: {
    _size: ['100%', 'auto'],
    '& .center': {
      textAlign: 'center',
    },
    '@media $maxH800': {
      paddingTop: '21px',
    }
  },
  TitleContainer: {
    _size: ['100%', 'auto'],
    '@media $maxH800': {
      paddingTop: '21px',
    },
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
      '@media $max600': {
        display: 'block',
        textAlign: 'center',
      },
    },
  },
})