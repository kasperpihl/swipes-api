import { styleSheet } from 'swiss-react';
import Icon from 'src/react/_components/Icon/Icon';

export default styleSheet('Dropdown', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'center', 'center']
  },

  Background: {
    _size: ['100%', '30px'],
    _flex: ['row', 'between', 'center'],
    borderRadius: '2px',
    '&:hover': {
      border: '1px solid $sw3'
    }
  },

  Text: {
    _textStyle: 'body',
    fontWeight: '$medium',
    padding: '6px 9px'
  },

  Icon: {
    _el: Icon,

    arrow: {
      show: {
        transform: 'rotate(180deg)'
      }
    }
  },

  DropdownBox: {
    _size: ['100%', '0'],
    backgroundColor: '$base',
    overflowY: 'hidden',
    position: 'absolute',
    borderRadius: '2px',
    left: '1px',
    top: '30px',

    show: {
      _size: ['calc(100% - 2px)', 'auto'],
      boxShadow: '$popupShadow',
      zIndex: '999'
    }
  },

  Row: {
    _size: ['100%', '30px'],
    _flex: ['row', 'flex-start', 'center'],
    padding: '6px 9px',
    flexWrap: 'nowrap',

    '&:hover': {
      backgroundColor: '$green4',

      selected: {
        backgroundColor: '$green3'
      }
    },

    selected: {
      backgroundColor: '$green4'
    }
  },

  RowText: {
    _el: 'p',
    _textStyle: 'body',
    fontWeight: '$medium',
    overflow: 'hidden'
  }
});
