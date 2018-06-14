import { styleSheet } from 'swiss-react';
import Icon from 'Icon';
import { Link } from 'react-router-dom';

export default styleSheet('DownloadForDevice', {
  Wrapper: {
    _size: ['100%', 'auto'],
    marginTop: '24px',
    textAlign: 'center',
    overflow: 'hidden',
  },
  Device: {
    _el: 'a',
    _size: ['100%', '150px'],
    _borderRadius:'6px',
    backgroundColor: '$blue5',
    cursor: 'pointer',
    display: 'inline-block',
    paddingTop: '15px',
    transition: '.35s ease',
    '& p': {
      _font: ['12px', '24px', '500'],
      margin: '0',
      padding: '0',
      transition: '.35s ease',
    },
    '&:hover': {
      backgroundColor: '$blue20',
      paddingTop: '9px',
      transition: '.35s ease',
    },
  },
  DeviceSVG: {
    _el: Icon,
    _size: '100px',
    _svgColor: '$blue60',
    margin: '0',
    padding: '0',
    transition: '.35s ease',
    '.svg-hover:hover &': {
      _svgColor: '$blue',
      transition: '.35s ease',
    },
  },
  AllDevices: {
    _el: 'p',
    paddingTop: '15px',
  },
  AllDevicesLink: {
    _el: Link,
    _font: ['12px', '$blue'],
    cursor: 'pointer',
  },
});