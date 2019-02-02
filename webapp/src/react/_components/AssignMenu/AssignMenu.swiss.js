import { styleSheet } from 'swiss-react';

export default styleSheet('AssignMenu', {
  Wrapper: {
    _size: ['300px', 'auto'],
    _flex: ['column', 'column', 'flex-start'],
    backgroundColor: '$sw5'
  },

  Text: {
    _el: 'p',
    _font: ['12px', '18px', '400']
  },

  Dropdown: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'center', 'flex-start'],
    overflowY: 'auto',
    maxHeight: '192px'
  },

  OptionsRow: {
    _size: ['100%', '48px'],
    _flex: ['row', 'between', 'center'],
    flexShrink: '0',
    padding: '0 12px',
    borderBottom: '1px solid $sw4',
    backgroundColor: '$sw5'
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

    selected: {
      backgroundColor: 'rgba($blue, 0.5)',

      '&:hover': {
        backgroundColor: 'rgba($blue, 0.75)'
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
    marginRight: 'auto',
    userSelect: 'none'
  }
});