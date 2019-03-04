import { styleSheet } from 'swiss-react';
import Icon from 'src/react/_components/Icon/Icon';

export default styleSheet('Dropdown', {
  Wrapper: {
    _size: ['120px', 'auto'],
    _flex: ['column', 'center', 'center']
  },

  Background: {
    _size: ['100%', '24px'],
    _flex: ['row', 'between', 'center'],
    boxShadow: '0 0 0 1px $sw3',
    transition: '.4s ease-in-out all',

    rounded: {
      borderRadius: '18px'
    }
  },

  Text: {
    _font: ['12px', '18px', '$regular'],
    color: '$sw1',
    padding: '9px 12px',
    hasIcon: {
      paddingLeft: '0px'
    }
  },

  Icon: {
    _el: Icon,

    arrow: {
      transform: 'rotate(-90deg)',
      transition: '.2s ease-in-out all',

      show: {
        transform: 'rotate(90deg)'
      }
    },

    row: {
      // marginRight: '6px',
    }
  },

  DropdownBox: {
    _size: ['100%', '0'],
    overflowY: 'hidden',
    transition: '.4s ease-in-out all',

    show: {
      _size: ['auto', '216px'],
      minWidth: '100%',
      overflowY: 'scroll',
      boxShadow: '0 6px 12px 1px rgba(0,12,47,0.3)'
    }
  },

  Row: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'flex-start', 'center'],
    minHeight: '36px',
    padding: '0 6px',
    flexWrap: 'nowrap',

    '&:hover': {
      backgroundColor: '$sw3'
    },

    selected: {
      backgroundColor: '$sw3'
    }
  },

  RowText: {
    _el: 'p',
    _font: ['12px', '18px', '$regular'],
    color: 'black',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }
});
