import { styleSheet } from 'swiss-react';

export default styleSheet('Browser', {
  BrowserLoader: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
  },

  BrowserOverlay: {
    _size: ['100%'],
    overflow: 'hidden',
  },

  WebViewContainer: {
    height: 'calc(100% - 60px)',
    _size: ['100%', '60px'],
    paddingTop: '5px',
  },

  BrowserNav: {
    _size: ['100%', '60px'],
    _flex: ['center', 'between'],
    background: 'white',
    padding: '0 30px',
    position: 'relative',

    '&:after': {
      _size: ['100%', '1px'],
      background: '$sw2',
      content: '',
      position: 'absolute',
      left: '0',
      top: '0',
    },
  },

  Left: {

  },

  Right: {

  },

  Btn: {
    zIndex: '9',
    margin: '0 6px',
  },

  Title: {
    _size: ['auto', '100%'],
    _font: ['12px', '15px', '500'],
    color: '$sw2',
    minWidth: '300px',
    padding: '0 30px',
    position: 'relative',

    '&:before': {
      content: '',
      _size: ['1px', '30px'],
      position: 'absolute',
      left: '0',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: '$sw3',
    },

    '&:after': {
      content: '',
      _size: ['1px', '30px'],
      position: 'absolute',
      right: '0',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: '$sw3',
    },

    '&:hover': {
      color: 'black',
    },
  },
})
