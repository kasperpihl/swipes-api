import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';
export default styleSheet('PlanSideRunning', {
  Wrapper: {
    _size: ['180px', 'auto'],
    _flex: ['column', 'left', 'top'],
    flex: 'none',
    marginRight: '48px'
  },
  ButtonWrapper: {
    _flex: ['column', 'left', 'top'],
    width: '100%',
    borderBottom: '1px solid $sw4'
  },

  Button: {
    _el: Button,
  }
});
