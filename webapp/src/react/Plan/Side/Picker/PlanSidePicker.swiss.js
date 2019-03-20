import { styleSheet } from 'swiss-react';
import Icon from 'src/react/_components/Icon/Icon';

export default styleSheet('PlanSidePicker', {
  Wrapper: {},
  Title: {
    _textStyle: 'caption',
    color: '$sw2',
    textTransform: 'uppercase'
  },
  Day: {
    _textStyle: 'body',
    _flex: ['row', 'left', 'center'],
    _size: ['100%', '30px'],
    border: '1px solid $sw3'
  },

  Dropdown: {
    _size: ['210px', 'auto'],
    _flex: ['column', 'left', 'top'],
    background: 'white',
    position: 'absolute',
    top: '30px',
    left: '0',
    opacity: '0',
    zIndex: '999',
    visibility: 'hidden',
    show: {
      opacity: '1',
      visibility: 'visible'
    },
    boxShadow: '$popupShadow'
  },

  DropdownRow: {
    _size: ['100%', '42px'],
    _flex: ['row', 'left', 'center'],

    '&:not(:last-child)': {
      borderBottom: '1px solid $sw4'
    },

    '&:hover': {
      background: '$green2'
    }
  },

  Icon: {
    _el: Icon,
    marginLeft: 'auto',

    show: {
      transform: 'rotate(180deg)'
    }
  },

  WeekNumber: {
    _size: '30px',
    _textStyle: 'caption',
    _flex: ['row', 'center', 'center'],
    color: '$dark',
    margin: '6px 6px 6px 9px',
    background: '$sw3',

    compact: {
      margin: '0 6px 0 0 '
    }
  },

  RowText: {
    _textStyle: 'body'
  },

  InputContainer: {
    _flex: ['row', 'left', 'center'],
    _size: ['100%', '30px']
  },

  InputWrapper: {
    _flex: ['row', 'center', 'center'],
    width: '66px',
    height: '100%',
    border: '1px solid $sw4',
    padding: '6px',
    flex: 'none',

    '&:first-child': {
      borderRadius: '2px 0 0 2px',
      borderRight: 'none'
    },

    '&:not(:first-child)': {
      borderRadius: '0 2px 2px 0',
      borderLeft: 'none'
    },

    checked: {
      background: '$dark'
    }
  },

  Input: {
    _el: 'input',
    position: 'absolute',
    opacity: '0',
    width: '0'
  },

  InputText: {
    _textStyle: 'body',
    fontWeight: '$medium',

    checked: {
      color: 'white'
    }
  }
});
