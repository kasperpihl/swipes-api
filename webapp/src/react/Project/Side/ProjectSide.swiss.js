import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('ProjectSide', {
  Wrapper: {
    _size: ['180px', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    flex: 'none'
  },

  ButtonWrapper: {
    _flex: ['column', 'left', 'top'],
    width: '100%',
    padding: '36px 0 12px 0',
    borderBottom: '1px solid $sw4'
  },

  Button: {
    _el: Button,

    '&:first-child': {
      marginBottom: '6px'
    }
  }
});
