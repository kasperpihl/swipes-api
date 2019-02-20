import { styleSheet } from 'swiss-react';

export default styleSheet('PlanSideAlert', {
  Wrapper: {
    _flex: ['column', 'top', 'left'],
    borderRadius: '2px',
    padding: '12px',
    width: '160px',
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
    _textStyle: 'body',
    'type=draft': {
      backgroundColor: '$yellow',
      color: '$sw1'
    },
    'type=overdue': {
      backgroundColor: '$red',
      color: '$sw5'
    },
    'type=completed': {
      backgroundColor: '$green1',
      color: '$sw5'
    }
  }
});
