import { styleSheet } from 'swiss-react';

export default styleSheet('ButtonExtended', {
  Wrapper: {
    _el: 'a',
    _size: ['auto', '36px'],
    _flex: ['row', 'center', 'center'],
    _textStyle: 'body',
    display: 'inline-flex',
    userSelect: 'none'
  },

  InnerWrapper: {
    _size: '100%',
    _flex: ['row', 'flex-start', 'center'],
    padding: '6px',

    '.Button_Wrapper &:hover': {
      backgroundColor: '$sw3',
      color: '$blue'
    }
  },

  OuterText: {
    _flex: ['row', 'flex-start', 'flex-start']
  },

  BigTitle: {
    _el: 'p',
    _size: '100%'
  },

  SmallTitle: {
    _el: 'p',
    _size: '100%'
  }
});
