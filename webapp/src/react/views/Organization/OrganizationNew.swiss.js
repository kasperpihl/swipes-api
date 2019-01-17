import { styleSheet } from 'swiss-react';
import Button from 'src/react/components/Button/Button';
import TabBar from 'src/react/components/tab-bar/TabBar';

export default styleSheet('OrganizationNew', {
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
    marginTop: '24px'
  },

  Button: {
    _el: Button,
    border: '1px solid $sw3',
    borderRadius: '300px',
    overflow: 'hidden',
    marginLeft: '12px'
  }
});
