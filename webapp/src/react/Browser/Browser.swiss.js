import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('Browser', {
  BrowserLoader: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translateX(-50%) translateY(-50%)'
  },

  BrowserOverlay: {
    _size: ['100%'],
    overflow: 'hidden'
  },

  BrowserWebView: {
    _size: ['100%', 'calc(100% - 60px)'],
    paddingTop: '5px'
  },

  BrowserNavBar: {
    _size: ['100%', '60px'],
    _flex: ['row', 'center', 'center'],
    background: 'white',
    padding: '0 30px',
    position: 'relative',

    '&:after': {
      _size: ['100%', '1px'],
      background: '$sw2',
      content: '',
      position: 'absolute',
      left: '0',
      top: '0'
    }
  },

  Left: {},

  Right: {},

  BackButton: {
    _el: Button,
    zIndex: '9',
    margin: '0 6px'
  },

  ForwardButton: {
    _el: Button,
    zIndex: '9',
    margin: '0 6px'
  },

  ReloadButton: {
    _el: Button,
    zIndex: '9',
    margin: '0 6px'
  },

  BrowserButton: {
    _el: Button,
    zIndex: '9',
    margin: '0 6px'
  },

  TitleWrapper: {
    _size: ['auto', '100%'],
    _font: ['12px', '15px', '$medium'],
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
      backgroundColor: '$sw3'
    },

    '&:after': {
      content: '',
      _size: ['1px', '30px'],
      position: 'absolute',
      right: '0',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: '$sw3'
    }
  },

  Title: {
    _size: ['100%'],
    _font: ['16px', '18px', '$regular'],
    color: '$sw1',
    margin: ' 20px 0',
    textAlign: 'center',
    pointerEvents: 'none',
    userSelect: 'none'
  }
});
