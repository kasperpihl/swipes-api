import { styleSheet } from 'swiss-react';
import Button from 'src/react/components/Button/Button';

export default styleSheet('trial', {
  Wrapper: {
    _size: ['100%', 'auto'],
    userSelect: 'none',
    position: 'absolute',
    show: {
      _size: '100%',
    },
  },

  Popup: {
    pointerEvents: 'all',
    _size: ['500px', '300px'],
    _flex: ['column'],
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    backgroundColor: '$sw5',
    borderRadius: '3px',
    borderShadow: '0 1px 20px 3px rbga(#003782, .1)',
    padding: '0 30px',
    paddingBottom: '30px',

    displayActions: {
      paddingBottom: '0',
      _flex: ['column', 'center', 'center'],
    },
  },

  Indicator: {
    _flex: ['row', 'right', 'center'],
    _size: ['100%', '38px'],
    padding: '0 15px',
    position: 'absolute',
    left: '0',
    top: '0',
    pointerEvents: 'none',
  },

  Label: {
    pointerEvents: 'all',
    _font: '15px',
    fontWeight: '400',
    color: '$sw5',

    '&:hover': {
      textDecoration: 'underline',
    },
  },

  PopupWrapper: {
    _size: '100%',
    backgroundColor: 'rgba($sw1, .5)',
    position: 'absolute',
    zIndex: '999999',
  },

  PreTitle: {
    _size: ['100%', 'auto'],
    _font: ['17px', '20px', '500'],
    color: '$sw3',
    padding: '15px 0',
    paddingTop: '30px',
  },

  Title: {
    _size: ['100%', 'auto'],
    _font: ['16px', '21px'],
    color: '$sw1',
    fontFamily: 'Aktiv-Grotesk',
    padding: '30px 0',
    paddingTop: '45px',

    displayActions: {
      paddingTop: '0',
    },
  },

  Paragraph: {
    _font: ['15px', '18px'],
    color: '$sw1',
    paddingBottom: '15px',
  },

  Actions: {
    _size: '100%',
    _flex: ['row', 'right', 'center'],

    displayActions: {
      display: 'none',
    },
  },

  Button: {
    _el: Button,

    '&:not(:last-child)': {
      marginRight: '20px',
    },
  },
});
