import { styleSheet } from 'swiss-react';

export default styleSheet('PlanAlert', {
  Wrapper: {
    _flex: ['column', 'top', 'left'],
    width: '100%',
    borderRadius: '2px',
    padding: '12px',
    'type=draft': {
      backgroundColor: '$yellow'
    },
    'type=overdue': {
      backgroundColor: '$red'
    },
    'type=completed': {
      backgroundColor: '$green1'
    }
  },
  Title: {
    _textStyle: 'caption',
    textTransform: 'uppercase',
    color: '$sw5',
    'type=draft': {
      color: '$sw1'
    }
  },
  Message: {
    _textStyle: 'body',
    paddingTop: '6px',
    color: '$sw5',
    'type=draft': {
      color: '$sw1'
    }
  }
});
