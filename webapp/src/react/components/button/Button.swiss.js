import { styleSheet } from 'swiss-react';

export default styleSheet('Button', {
  GlobalStyles: {
    '@keyframes button-loader': {
      '0%': {
        WebkitTransform: 'scale(0)',
      },
      '100%': {
        WebkitTransform: 'scale(1.0)',
        opacity: 0,
      }
    }
  },
  ATag: {
    userSelect: 'none',
    _flex: ['row', 'left', 'center'],
    display: 'inline-flex',
    width: 'auto',
    'status=loading|success|error': {
      pointerEvents: 'none',
    },
  },
  Background: {
    _flex: ['row', 'left', 'center'],
    borderRadius: '18px',
    '!compact': {
      border: '1px solid $sw3',
      '.gl-button:hover &': {
        background: '$sw3',
      },
    },
    compact: {
      background: 'none',
    },
  },
  IconContainer: {
    _size: '36px',
    _flex: 'center',
    compact: {
      _size: '30px',
    },
  },
  Icon: {
    _svgColor: '$sw1',
    'status=success': {
      _svgColor: '$green'
    },
    'status=error': {
      _svgColor: '$red'
    },
    _size: '24px',
    '.gl-button:hover &': {
      _svgColor: '$blue',
    },
  },
  Title: {
    _font: ['12px', '18px', 400],
    color: '$sw1',
    padding: '9px 18px',
    'status=success': {
      color: '$green'
    },
    'status=error': {
      color: '$red'
    },
    hasIcon: {
      paddingLeft: '0px',
    },
    '.gl-button:hover &': {
      color: '$blue',
    },
  },
  SideLabel: {
    _font: ['12px', '18px', 400],
    paddingTop: '1px',
    paddingLeft: '12px',
    color: '$sw1',
    'status=success': {
      color: '$green'
    },
    'status=error': {
      color: '$red'
    },
    compact: {
      paddingLeft: 0,
    },
    '.gl-button:hover &': {
      color: '$blue',
    },
  },
  LoaderCircle: {
    _size: '30px',
    backgroundColor: '$sw1',
    borderRadius: '100%',
    animation: 'button-loader 1.0s infinite ease-in-out',
  },
});
