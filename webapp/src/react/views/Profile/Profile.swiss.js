import { styleSheet } from 'swiss-react';
import Button from 'src/react/components/button/Button';

export default styleSheet('Account', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row'],
    flexWrap: 'wrap',
    padding: '15px'
  },

  Button: {
    _el: Button,
    marginLeft: 'auto',
    borderRadius: '300px',
    border: '1px solid $sw3',
    overflow: 'hidden'
  }
});
