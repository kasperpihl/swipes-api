import { styleSheet } from 'swiss-react';

export default styleSheet('SideHeader', {
  Wrapper: {
    paddingBottom: '16px'
  },

  TitleWrapper: {
    _flex: ['row', 'flex-start', 'flex-start'],
    paddingBottom: '8px'
  },

  BigNumber: {
    _textStyle: 'title',
    color: '$dark',
    marginRight: '6px'
  },

  SmallNumber: {
    _textStyle: 'body',
    color: '$dark',
    marginTop: '12px'
  },

  Subtitle: {
    _textStyle: 'caption',
    textTransform: 'uppercase',
    color: '$sw2'
  }
});
