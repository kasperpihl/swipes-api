import { styleSheet } from 'swiss-react';
import Button from 'src/react/components/Button/Button';

export default styleSheet('Invitation', {
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
      _flex: ['column', 'center', 'center']
    }
  },

  PopupWrapper: {
    _size: '100%',
    backgroundColor: 'rgba($sw1, .5)',
    position: 'absolute',
    zIndex: '999999'
  },

  Title: {
    _size: ['100%', 'auto'],
    _font: ['16px', '21px'],
    color: '$sw1',
    fontFamily: 'Aktiv-Grotesk',
    padding: '30px 0',
    paddingTop: '45px',

    displayActions: {
      paddingTop: '0'
    }
  },

  Paragraph: {
    _font: ['15px', '18px'],
    color: '$sw1',
    paddingBottom: '15px'
  },

  Actions: {
    _size: '100%',
    _flex: ['row', 'right', 'center'],

    displayActions: {
      display: 'none'
    }
  },

  Button: {
    _el: Button.Rounded,

    '&:not(:last-child)': {
      marginRight: '20px'
    }
  }
});
