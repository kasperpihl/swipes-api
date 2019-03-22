import { styleSheet } from 'swiss-react';

export default styleSheet('ResetPassword', {
  Wrapper: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    _size: ['70%', 'auto'],
    transform: 'translateY(-50%) translateX(-50%)',
    maxWidth: '720px',

    '@media $min600': {
      minWidth: '560px'
    }
  },

  Form: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start']
  },

  FormTitle: {
    _el: 'h6',
    _font: ['24px', '36px', '400'],
    color: '$sw1',
    paddingBottom: '36px',

    '@media $max600': {
      _font: ['18px', '24px', '300']
    }
  }
});
