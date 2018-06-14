import { styleSheet } from 'swiss-react';
import Icon from 'Icon';

const navbarH = '48px';

export default styleSheet('BreadCrumbs', {
  Wrapper: {
    _size: ['100%', navbarH],
    _flex: '',
    paddingTop: '4px',
  },
  Crumb: {
    _size: ['auto', '100%'],
    _flex: ['row', 'left', 'center'],
    disableClick: {
      pointerEvents: 'none',
    },
  },
  Seperator: {
    _size: ['24px', navbarH],
    _flex: 'center',
    margin: '0 3px',
  },
  CrumbIcon: {
    _el: Icon,
    _svgColor: '$sw2',
    _size: '24px',
    '.crumb:hover &': {
      _svgColor: '$blue',
    },
    disableClick: {
      '.crumb:hover &': {
        _svgColor: '$sw2',
      },
    }
  },
  Title: {
    color: '$sw2',
    _font: ['10px', '24px', 500],
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    '.crumb:hover &': {
      color: '$blue',
    },
    disableClick: {
      '.crumb:hover &': {
        color: '$sw2',
      },
    }
  },
});
