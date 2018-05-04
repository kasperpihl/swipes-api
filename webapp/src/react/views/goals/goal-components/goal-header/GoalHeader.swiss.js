import { styleSheet } from 'react-swiss';

export default styleSheet('GoalHeader', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'top'],
    showLine: {
      borderBottom: '1px solid $sw3',
    }
  }
});