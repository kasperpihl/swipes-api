import { styleSheet } from 'swiss-react';

export default styleSheet('ProjectListItem', {
  Wrapper: {
    _flex: ['row', 'left', 'center'],
    '&:hover': {
      background: '$green4'
    },
    borderRadius: '6px',
    userSelect: 'none'
  },
  TextWrapper: {
    _flex: ['row', 'left', 'center']
  },
  Title: {
    _textStyle: 'H3',
    width: '250px'
  },
  Subtitle: {
    _textStyle: 'body',
    width: '160px',
    color: '$sw2',
    '&:hover': {
      textDecoration: 'underline'
    },
    isFiltered: {
      textDecoration: 'underline',
      '&:hover': {
        textDecoration: 'line-through'
      }
    }
  },
  LeftSideWrapper: {
    _size: ['60px', '54px'],
    _flex: 'center'
  },
  HoverLabel: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    background: '$green4',
    borderRadius: '6px',
    color: '$sw1',
    _flex: 'center',
    _textStyle: 'caption',
    display: 'none',
    '.ProjectListItem_Wrapper:hover &': {
      display: 'flex'
    }
  },

  DateOpened: {
    _flex: ['row', 'left', 'center'],
    _textStyle: 'body',
    color: '$sw2'
  },

  Label: {
    _el: 'span',
    padding: '3px 9px',
    borderRadius: '2px',
    backgroundColor: '$blue',
    color: '$base',
    textTransform: 'uppercase'
  }
});
