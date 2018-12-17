import { styleSheet } from 'swiss-react';

export default styleSheet('AssigneeContextMenu', {
  Wrapper: {
    _size: ['auto', '240px'],
    _flex: ['column', 'column', 'flex-start'],
    boxShadow: '0 1px 20px 3px rgba(00,37,82, .1)', // TODO: REMOVE IF READY
    overflowY: 'scroll',
    minWidth: '200px',
  },

  Text: {
    _el: 'p',
    _font: ['12px', '18px', '400'],
  },

  Dropdown: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'center', 'flex-start'],
  },

  Row: {
    _size: ['100%', '48px'],
    _flex: ['row', 'flex-start', 'center'],
    flexShrink: '0',
    padding: '0 12px',

    '&:hover': {
      backgroundColor: '$sw2',
    },

    menu: {
      position: 'sticky',
      top: '0',
      backgroundColor: 'white',
      zIndex: 2,

      '&:hover': {
        backgroundColor: 'initial',
      }
    },

    selected: {
      backgroundColor: '$sw3',
    }
  },

  TeamName: {
    _el: 'h3',
    _font: ['16px', '18px', '400'],
  },

  UserName: {
    _el: 'p',
    _size: '100%',
    _font: ['12px', '18px', '400'],
    _flex: ['column', 'flex-start', 'center'],
  },

  Button: {
    _size: '30px',
    cursor: 'pointer',
    marginLeft: 'auto',

    '&:before': {
      _size: ['17px', '2px'],
      cursor: 'pointer',
      backgroundColor: 'black',
      content: '',
      position: 'absolute',
      top: '50%',
      left: '50%', 
      transform: 'translateY(-50%) translateX(-50%) rotate(45deg)',
    },

    '&:after': {
      _size: ['17px', '2px'],
      cursor: 'pointer',
      backgroundColor: 'black',
      content: '',
      position: 'absolute',
      top: '50%',
      left: '50%', 
      transform: 'translateY(-50%) translateX(-50%) rotate(-45deg)',
    },

    user: {
      '&:before': {
        _size: ['15px', '1px'],
        cursor: 'pointer',
        backgroundColor: 'black',
        content: '',
        position: 'absolute',
        top: '50%',
        left: '50%', 
        transform: 'translateY(-50%) translateX(-50%)',
      },
  
      '&:after': {
        _size: ['15px', '1px'],
        cursor: 'pointer',
        backgroundColor: 'black',
        content: '',
        position: 'absolute',
        top: '50%',
        left: '50%', 
        transform: 'translateY(-50%) translateX(-50%) rotate(-90deg)',
      },

      selected: {
        '&:before': {
          transform: 'translateY(-50%) translateX(-50%) rotate(45deg)',
        },

        '&:after': {
          transform: 'translateY(-50%) translateX(-50%) rotate(-45deg)',
        },
      }
    }
  },

  SelectedAmount: {
    _el: 'p',
    _font: ['16px', '18px', '400'],
    marginLeft: '12px',
  }
})