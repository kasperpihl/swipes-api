import { styleSheet } from 'swiss-react';

export default styleSheet('SideHeader', {
  Wrapper: {
    _flex: ['row', 'left', 'center'],
    height: '35px',
    userSelect: 'none'
  },

  TitleWrapper: {
    _flex: ['column', 'left', 'top'],
    height: '100%',
    marginTop: '3px'
  },

  BigNumber: {
    _textStyle: 'title',
    color: '$dark',
    marginRight: '6px'
  },

  SmallNumber: {
    _textStyle: 'body',
    color: '$dark'
  },

  Subtitle: {
    _textStyle: 'caption',
    textTransform: 'uppercase',
    color: '$sw2'
  }
});
