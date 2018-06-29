import { styleSheet } from 'swiss-react';
import Icon from 'Icon';

export default styleSheet('DragAndDrop', {
  Wrapper: {
    _size: '100%',
    _flex: 'column',

    showMenu: {
      backgroundColor: '$sw2',
      opacity: '0.4',
    },
  },

  Overlay: {
    position: 'absolute',
    top: '0',
    left: '0',
    _size: ['100vw', '100vh'],
    pointerEvents: 'none',
    visibility: 'hidden',
    zIndex: '99999999999',
    transition: '.2s ease-in',
    shown: {
      visibility: 'visible',
      backgroundColor: '$sw3',
      opacity: '0.4',
      pointerEvents: 'all',
    },
  },

  MenuWrapper: {
    display: 'none',
    showMenu: {
      display: 'flex',
      _size: ['280px', '200px'],
      _flex: ['column', 'center'],
      backgroundColor: '$sw5',
      transition: '.8s ease-in',
      position: 'fixed',
      top: '50%',
      left: '50%',
      marginTop: '-200px',
      marginLeft: '-100px',
      zIndex: '99999999999',
      borderRadius: '5px',
    },
  },

  MenuList: {
    width: '100%',
    _el: 'ul',
    listStyle: 'none',
  },

  ListItem: {
    _flex: ['row', 'start'],
    width: '100%',
    height: '50px',
    padding: '8px 5px',

    '&:hover': {
      backgroundColor: '$sw4',
    },
  },

  ItemIcon: {
    _el: Icon,
    _size: '36px',
    flexShrink: '0',
    padding: '0 5px',

  },

  Description: {
    _flex: ['column', 'center'],
  },

  Title: {
    _el: 'h3',
    _font: ['16px', '18px'],
    width: '100%',
    color: 'black',
    textAlign: 'left',
  },

  Subtitle: {
    _el: 'span',
    _font: ['12px', '14px'],
    width: '100%',
    color: '$sw2',
  },
})
