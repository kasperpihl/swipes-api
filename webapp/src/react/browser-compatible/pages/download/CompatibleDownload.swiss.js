import { styleSheet } from 'react-swiss';

export default styleSheet('CompatibleDownload', {
  Wrapper: {
    padding: '30px 0',
  },
  Section: {
    marginTop: '51px',
  },
  SectionTitle: {
    _font: ['12px', '15px', 500],
    color: '$sw1',
    padding: '9px 0',
    borderBottom: '1px solid $sw1',
  },
  DeviceWrapper: {
    _size: ['100%', 'auto'],
    marginTop: '24px',
    textAlign: 'center',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    '@media $max600': {
      flexDirection: 'column',
    },
  },
  Device: {
    _size: '150px',
    _borderRadius: '6px',
    backgroundColor: '$blue5',
    display: 'inline-block',
    paddingTop: '15px',
    transition: '.35s ease',
    marginLeft: '3%',
    '&:first-child': {
      marginLeft: '0',
    },
    '&:hover': {
      backgroundColor: '$blue20',
      transition: '.35s ease',
    },
    '&>p': {
      _font: ['12px', '24px', 500],
      color: '$blue',
      margin: 0,
      padding: 0,
      transition: '.35s ease',
    },
    '@media $max600': {
      _size: ['100%', 'auto'],
      boxSizing: 'border-box',
      padding: '0 9px',
      paddingBottom: '15px',
      marginBottom: '15px',
      marginLeft: '0',
    },
  },
  DeviceSVG: {
    _size: '100px',
    _svgColor: '$blue60',
    margin: '0',
    padding: '0',
    transition: '.35s ease',
    '.device-hover:hover &': {
        _svgColor: '$blue',
        transition: '.35s ease',
    }
  }
});