import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('ProjectOverview', {
  Wrapper: {
    _flex: ['row', 'flex-start', 'flex-start'],
    padding: '0 30px'
  },
  TasksWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start']
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
