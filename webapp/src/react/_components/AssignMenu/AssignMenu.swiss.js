import { styleSheet } from 'swiss-react';

export default styleSheet('AssignMenu', {
  Wrapper: {
    _size: ['300px', 'auto'],
    _flex: ['column', 'column', 'flex-start'],
    backgroundColor: '$sw5'
  },

  Text: {
    _el: 'p',
    _font: ['12px', '18px', '$regular']
  },

  Dropdown: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'center', 'flex-start'],
    overflowY: 'auto',
    maxHeight: '192px'
  },

  OptionsRow: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'left', 'top'],
    minHeight: '48px',
    flexShrink: '0',
    padding: '16px 24px 24px 12px',
    borderTop: '1px solid $sw4',
    borderBottom: '1px solid $sw4',
    backgroundColor: '$sw5',

    row: {
      _flex: ['row', 'between', 'center']
    }
  },

  ButtonWrapper: {
    _flex: ['row', 'center', 'center'],

    right: {
      marginLeft: 'auto'
    }
  },

  Row: {
    _size: ['100%', '48px'],
    _flex: ['row', 'flex-start', 'center'],
    flexShrink: '0',
    padding: '0 12px',

    '&:not(:first-child)': {
      borderBottom: '1px solid $sw4'
    },

    '&:hover': {
      backgroundColor: '$green4'
    },

    selected: {
      backgroundColor: '$green4',

      '&:hover': {
        backgroundColor: '$green3'
      }
    },

    hideRow: {
      display: 'none'
    },

    excludeMe: {
      display: 'none'
    }
  },

  TeamName: {
    _el: 'h3',
    _font: ['16px', '18px', '$regular'],
    userSelect: 'none'
  },

  UserName: {
    _el: 'p',
    _size: '100%',
    _font: ['12px', '18px', '$regular'],
    _flex: ['column', 'flex-start', 'center'],
    paddingLeft: '6px',
    userSelect: 'none'
  },

  SelectedAmount: {
    _el: 'p',
    _font: ['16px', '18px', '$regular'],
    marginLeft: '6px',
    marginRight: 'auto',
    userSelect: 'none'
  },

  NudgeText: {
    _el: 'p',
    _textStyle: 'body',
    width: '100%',
    color: '$sw2'
  }
});
