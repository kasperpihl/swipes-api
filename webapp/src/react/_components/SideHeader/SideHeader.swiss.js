import { styleSheet } from 'swiss-react';

export default styleSheet('SideHeader', {
  Wrapper: {
    paddingBottom: '12px'
  },
  TitleWrapper: {
    _flex: ['row', 'flex-start', 'flex-start'],
    paddingBottom: '12px'
  },

  BigNumber: {
    _font: ['43px', '36px', '400']
  },

  Subtitle: {
    _textStyle: 'body',
    color: '$sw2'
  }
});
