import { styleSheet } from 'swiss-react';

export default styleSheet('CreateTeamModal', {
  CTContainer: {
    _size: ['500px', 'auto'],
    _flex: ['column', 'center', 'top'],
    background: '$base',
    borderRadius: '2px',
    boxShadow: '$popupShadow',
    padding: '24px 48px'
  },

  CTTitle: {
    _el: 'h1',
    _textStyle: 'H2',
    fontWeight: '$medium'
  },

  CTText: {
    _el: 'p',
    _textStyle: 'body'
  }
});
