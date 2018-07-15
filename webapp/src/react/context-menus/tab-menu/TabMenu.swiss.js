import {styleSheet} from 'swiss-react';
import Button from 'src/react/components/button/Button';

export default styleSheet('TabMenu', {
  Wrapper: {
    _size: ['360px', '450px'],
    _flex: 'column',
    backgroundColor: '$sw5',
    borderRadius: '6px',
    boxShadow: '0 1px 20px 3px rgba(00,37,82, .1)',
    overflow: 'hidden',
    padding: '21px 21px 0 21px',
    zIndex: '999',

    dynamicHeight: {
      _size: ['360px', 'auto'],
      maxHeight: '450px',
      paddingBottom: '10px',
      paddingTop: '10px',
    },

    searching: {
      '& > .tabBar': {
        maxHeigth: '0px',
        transition: '.5s ease',
      },

      '& > .close': {
        opacity: '1',
        pointerEvents: 'all',
        transition: '.15s ease',
      },
    },
  },

  Header: {
    _size: ['100%', 'auto'],
  },

  Footer: {
    _size: ['100%', '60px'],
    _flex: ['row', 'left', 'center'],
    borderTop: '1px solid $sw3',
    padding: '0 15px',
  },

  Status: {
    _size: ['100%', 'auto'],
    _font: ['12px', '18px', '500'],
    color: '$sw2',
  },

  Search: {
    _size: ['100%', 'auto'],
    borderBottom: '1px solid $sw3',
  },

  Input: {
    _el: 'input',
    _size: ['calc(100% - 36px)', '52px'],
    _font: ['18px', '24px', '400'],
    color: '$sw1',
    paddingBottom: '9px',
    paddingTop: '12px',

    '&::-webkit-input-placeholder': {
      color: '$sw2',
    },

    '&:focus': {
      outline: 'none',
    },
  },

  Close: {
    _el: Button,
    position: 'absolute',
    right: '0',
    top: 'calc(50% - 18px)',
    opacity: '0',
    pointerEvents: 'none',
    transition: '.15s ease',
  },

  Section: {
    transition: '.25s ease',
  },

  Actions: {
    paddingLeft: '15px',
  },

  List: {
    _size: ['calc(100% + 42px)', '100%'],
    borderRadius: '0px 0px 6px 6px',
    backgroundColor: '$sw5',
    left: 'calc(-1 * 21px)',
    top: 'auto',
    overflowY: 'auto',
    padding: '0 16px 0 16px',
    transition: '.25s ease-in-out',
    zIndex: '12',
  },
})
