import { styleSheet } from 'swiss-react';

export default styleSheet('TakeAction', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column'],
    animation: 'fadeList .6s ease forwards',
    zIndex: '3',
    paddingBottom: '30px',
  },

  Header: {
    _size: ['100%', 'auto'],
  },
})
