import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';
import TabBar from 'src/react/_components/TabBar/TabBar';

export default styleSheet('Organization', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row'],
    flexWrap: 'wrap'
  },

  UsersWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start']
  },

  TabBar: {
    _el: TabBar,
    margin: '24px 0'
  },

  Button: {
    _el: Button.Rounded,
    border: '1px solid $sw3',
    borderRadius: '300px',
    overflow: 'hidden',
    marginLeft: '12px'
  }
});