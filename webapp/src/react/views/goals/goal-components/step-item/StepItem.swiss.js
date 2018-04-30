import { styleSheet } from 'react-swiss';

export default styleSheet('StepItem', {
  Wrapper: {
    _flex: ['row', 'left', 'center'],
    padding: '0 6px',
    '&:hover': {
      background: '$sw4',
    },
  },
  Title: {
    _font: ['15px', '24px'],
    padding: '12px 6px 12px 18px',
    width: '100%',
    color: '$sw1',
  }
});