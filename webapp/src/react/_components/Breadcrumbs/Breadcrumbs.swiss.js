import { styleSheet } from 'swiss-react';
import Icon from 'src/react/_components/Icon/Icon';

const navbarH = '36px';

export default styleSheet('Breadcrumbs', {
  Wrapper: {
    _size: ['100%', navbarH],
    _flex: '',
    paddingTop: '12px'
  },

  ButtonWrapper: {
    _flex: ['row', 'left', 'center'],
    flex: 'none',
    marginLeft: 'auto'
  },

  Crumb: {
    _size: ['auto', '100%'],
    _flex: ['row', 'left', 'center'],
    disableClick: {
      pointerEvents: 'none'
    }
  },
  Seperator: {
    _size: ['24px', navbarH],
    _flex: 'center',
    margin: '0 3px'
  },
  CrumbIcon: {
    _el: Icon,
    _svgColor: '$sw2',
    _size: '24px',
    '.crumb:hover &': {
      _svgColor: '$blue'
    },
    disableClick: {
      '.crumb:hover &': {
        _svgColor: '$sw2'
      }
    }
  },
  Title: {
    color: '$sw2',
    _font: ['10px', '24px', '$medium'],
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    '.crumb:hover &': {
      color: '$blue'
    },
    disableClick: {
      '.crumb:hover &': {
        color: '$sw2'
      }
    }
  }
});
