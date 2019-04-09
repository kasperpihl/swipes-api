import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('Team', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'center', 'top'],
    flexWrap: 'wrap'
  },

  UsersWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    margin: '0px 18px 0 36px'
  },

  Button: {
    _el: Button,
    border: '1px solid $sw3',
    borderRadius: '300px',
    overflow: 'hidden',
    marginLeft: '12px'
  }
});
