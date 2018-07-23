import { styleSheet } from 'swiss-react';
import Icon from 'Icon';
import Button from 'src/react/components/button/Button';

export default styleSheet('ResultItem', {
  Wrapper: {
    _size: ['100%', 'auto'],
    minHeight: '54px',
    borderRadius: '3px',
    padding: '9px 0',
    transition: '.2s ease-in-out',
    _flex: ['row', 'left', 'center'],

    '&:before': {
      _size: ['120%', '100%'],
      backgroundColor: 'transparent',
      borderRadius: '3px',
      content: '',
      left: '-10%',
      top: '0',
      position: 'absolute',
      transition: '.15s ease-in-out',
    },

    '.selected > .title': {
      _font: ['15px', '21px'],
      color: '$sw1',
    },

    '.disabled > .title': {
      pointerEvents: 'none',
      _font: ['15px', '21px', '400'],
      color: '$sw3',

      '&:hover': {
        '&:before': {
          backgroundColor: 'transparent',
        },
      },
    },

    '.selected > .subtitle': {
      _font: ['12px', '15px'],
      color: '$sw1',
    },

    '.disabled > .subtitle': {
      pointerEvents: 'none',
      _font: ['12px', '15px'],
      color: '$sw3',

      '&:hover': {
        '&:before': {
          backgroundColor: 'transparent',
        },
      },
    },

    '&:hover': {
      '&:before': {
        backgroundColor: '$blue20',
      },

      '& > .data > .title': {
        color: '$blue',
      },
    },
  },

  Data: {
    _size: ['100%', 'auto'],
    position: 'relative',
    zIndex: '9',
  },

  Title: {
    _font: ['15px', '21px'],
    color: '$sw1',
  },

  Subtitle: {
    _font: ['12px', '15px'],
    color: '$sw2',
  },

  Image: {
    _el: 'img',
    _size: '24px',
    borderRadius: '50%',
  },

  Icon: {
    _el: Icon,
    _size: '24px',
    _svgColor: '$sw2',
    border: 'none',
  },

  Button: {
    _el: Button,
    _size: '30px',
    borderRadius: '50%',

    '&:hover': {
      backgroundColor: '$sw4',
      transition: '.15s',
    },
  },

  Initials: {
    _size: '24px',
    _font: '11px',
    _flex: ['column', 'center', 'center'],
    fontWeight: '300',
    color: '$sw5',
    backgroundColor: '$sw1',
    borderRadius: '50%',
  },

  IconWrapper: {
    _flex: 'none',
    position: 'relative',
    transition: '.15s',
    zIndex: '9',
    marginRight: '15px',

    '.left': {
      marginRight: '15px',
    },

    '.right': {
      marginLeft: '15px'
    },
  },
})
