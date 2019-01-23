import { styleSheet } from 'swiss-react';

export default styleSheet('AssignMenu', {
  Wrapper: {
    _size: ['300px', '240px'],
    _flex: ['column', 'column', 'flex-start'],
    backgroundColor: '$sw5',
    overflowY: 'scroll',
    minWidth: '200px'
  },

  Text: {
    _el: 'p',
    _font: ['12px', '18px', '400']
  },

  Dropdown: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'center', 'flex-start']
  },

  Row: {
    _size: ['100%', '48px'],
    _flex: ['row', 'flex-start', 'center'],
    flexShrink: '0',
    padding: '0 12px',
    borderBottom: '1px solid $sw4',

    '&:hover': {
      backgroundColor: 'rgba($blue, 0.25)'
    },

    menu: {
      position: 'sticky',
      top: '0',
      backgroundColor: '$sw5',
      zIndex: 2,

      '&:hover': {
        backgroundColor: '$sw5'
      }
    },

    selected: {
      backgroundColor: 'rgba($blue, 0.25)',

      '&:hover': {
        backgroundColor: 'rgba($blue, 0.1)'
      }
    }
  },

  TeamName: {
    _el: 'h3',
    _font: ['16px', '18px', '400'],
    userSelect: 'none'
  },

  UserName: {
    _el: 'p',
    _size: '100%',
    _font: ['12px', '18px', '400'],
    _flex: ['column', 'flex-start', 'center'],
    paddingLeft: '6px',
    userSelect: 'none'
  },

  SelectedAmount: {
    _el: 'p',
    _font: ['16px', '18px', '400'],
    marginLeft: '6px',
    userSelect: 'none'
  }
});
