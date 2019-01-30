import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('ProjectOverview', {
  Wrapper: {
    // overflowY: 'scroll',
    padding: '0 6px'
  },
  AddButton: {
    _el: Button.Rounded,
    marginLeft: '22px'
  },
  Div: {
    _size: ['500px', 'auto'],
    _flex: ['column', 'center', 'between'],
    position: 'absolute',
    top: '10%',
    left: '20%',
    marginBottom: '50px'
  }
});
