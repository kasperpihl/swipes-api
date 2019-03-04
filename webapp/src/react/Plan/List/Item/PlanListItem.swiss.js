import { styleSheet } from 'swiss-react';

export default styleSheet('PlanListItem', {
  Wrapper: {
    _flex: ['row', 'left', 'center'],
    width: '50%',
    padding: '12px',
    borderRadius: '4px',

    '&:hover': {
      backgroundColor: '$green3'
    }
  },
  TextWrapper: {
    _flex: ['column', 'left', 'top'],
    marginLeft: '16px'
  },
  Title: {
    _textStyle: 'H2',
    marginBottom: '6px'
  },
  Subtitle: {
    _textStyle: 'caption'
  }
});
