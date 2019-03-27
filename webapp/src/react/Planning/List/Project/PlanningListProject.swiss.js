import { styleSheet } from 'swiss-react';

export default styleSheet('PlanningListProject', {
  Wrapper: {
    paddingBottom: '30px'
  },
  Title: {
    _el: 'span',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
});
