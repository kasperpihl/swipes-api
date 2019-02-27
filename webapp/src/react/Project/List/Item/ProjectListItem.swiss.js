import { styleSheet } from 'swiss-react';

export default styleSheet('ProjectListItem', {
  Wrapper: {
    _flex: ['row', 'left', 'center'],
    '&:hover': {
      background: '$sw4'
    },
    borderRadius: '6px',
    margin: '0 12px'
  },
  TextWrapper: {
    _flex: ['column', 'left', 'top']
  },
  Title: {
    _textStyle: 'item'
  },
  Subtitle: {
    _textStyle: 'labelLight'
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
    background: '$sw4',
    borderRadius: '6px',
    color: '$sw1',
    _flex: 'center',
    _textStyle: 'tabActive',
    display: 'none',
    '.ProjectListItem_Wrapper:hover &': {
      display: 'flex'
    }
  }
});
