import { styleSheet } from 'swiss-react';

export default styleSheet('DiscussionList', {
  Wrapper: {
    _size: '100%',
    overflowX: 'hidden',
    paddingBottom: '55px',

    '&::-webkit-scrollbar': {
      '-webkit-appearance': 'none',
      width: '6px',
      backgroundColor: 'transparent',
    },

    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '$sw3',
      borderRadius: '3px',
    }
  }
});
