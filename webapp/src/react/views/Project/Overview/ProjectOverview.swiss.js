import { styleSheet } from 'swiss-react';
import Button from 'src/react/components/button/Button';

export default styleSheet('ProjectOverview', {
  Wrapper: {
    // overflowY: 'scroll',
  },
  Header: {
    _flex: ['row', 'between', 'center'],
    padding: '12px 24px',
  },
  AddButton: {
    _el: Button,
    marginLeft: '22px',
  },
  HeaderTitle: {
    _el: 'h1',
  },
  Div: {
    _size: ['500px', 'auto'],
    _flex: ['column', 'center', 'between'],
    position: 'absolute', 
    top: '10%',
    left: '20%',
    marginBottom: '50px',
  }
});