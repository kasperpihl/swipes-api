import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('OrganizationHeader', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'flex-start', 'center']
  },

  Title: {
    _el: 'h1',
    _textStyle: 'H1'
  },

  Button: {
    _el: Button,
    marginLeft: 'auto'
  }
});
