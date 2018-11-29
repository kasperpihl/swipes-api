import { styleSheet, addGlobalStyles } from 'swiss-react';
import Icon from 'Icon';
addGlobalStyles({
  '@keyframes button-loader': {
    '0%': {
      WebkitTransform: 'scale(0)',
    },
    '100%': {
      WebkitTransform: 'scale(1.0)',
      opacity: 0,
    }
  }
})
export default styleSheet('Button', {
  ATag: {
    _el: 'a',
    _size: ['auto', '36px'],
    _flex: ['row', 'left', 'center'],
    display: 'inline-flex',
    flex: 'none',
    'status=loading|success|error': {
      pointerEvents: 'none',
    },
    userSelect: 'none',
    'rounded=false': {
      _size: ['auto', '30px'],
    }
  },
  Background: {
    _flex: ['row', 'left', 'center'],
    selected: {
      background: '$sw2',
    },
    '.gl-button:hover &': {
      background: '$sw3',
    },
    'rounded': {
      borderRadius: '18px',
      boxShadow: '0 0 0 1px $sw3',
    },
  },
  IconContainer: {
    _size: '36px',
    _flex: 'center',
    'rounded=false': {
      _size: '30px',
    }
  },
  IconComp: {
    _el: Icon,
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
    padding: '9px 12px',
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
    'size=small': {
      display: 'none',
    },
    'rounded=false': {
      padding: '0',
      paddingRight: '12px',
    },
    'textOutside=true': {
      display: 'initial',
      padding: '0 12px',

      '.gl-button:hover &': {
        color: 'initial',
      },
    },
    'textOutside=false': {
      display: 'none',
    }
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
    '.gl-button:hover &': {
      color: '$blue',
    },
    'size=small': {
      display: 'none',
    }
  },
  LoaderCircle: {
    _size: '30px',
    backgroundColor: '$sw1',
    borderRadius: '100%',
    animation: 'button-loader 1.0s infinite ease-in-out',
  },
  PopupBox: {
    display: 'none',
    _size: ['120px', 'auto'],
    background: 'white',
    boxShadow: '0 6px 12px 1px rgba(0, 12, 47, 0.3)',
    padding: '0 12px',
    show: {
      _flex: ['row', 'center', 'center'],
      position: 'absolute',
      top: (props) => `calc(-${props.numberOfLines}*18px - 18px)`,
      left: '50%',
      transform: 'translateX(-50%)',

      rounded: {
        borderRadius: '18px',
      }
    },
  },
  PopupText: {
    _el: 'p',
    _font: ['12px', '18px', 400],
  }
});
