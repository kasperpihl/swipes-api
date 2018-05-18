import { styleSheet } from 'react-swiss';

export default styleSheet('GoToWorkspace', {
  Wrapper: {
    _size: ['100%', 'auto'],
  },
  ATag: {
    _size: ['100%', '150px'],
    _borderRadius: '6px',
    marginTop: '15px',
    display: 'block',
    backgroundColor: '$blue5',
    paddingTop: '15px',
    textAlign: 'center',
    transition: '.35s ease',
    '& p': {
      _font: ['12px', '24px', '500'],
      margin: 0,
      padding: 0,
      transition: '.35s ease',
      color: '$blue',
    },
    '&:hover': {
      paddingTop: '9px',
      backgroundColor: '$blue20',
      transition: '.35s ease',
    }
  },
  SVG: {
    _size: ['100px'],
    _svgColor: '$blue60',
    margin: '0',
    padding: '10px',
    transition: '.35s ease',
    '.svg-hover:hover &': {
      _svgColor: '$blue',
      transition: '.35s ease',
    }
  }
});