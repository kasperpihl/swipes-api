import { styleSheet } from 'swiss-react';
import Icon from 'src/react/icons/Icon';

export default styleSheet('AssigneeComponent', {
  Wrapper: {
    _size: ['100px', '24px'],
    _font: ['12px', '18px', '400'],
    _flex: ['row', 'flex-start', 'center']
  },

  Icon: {
    _el: Icon,
    border: '1px solid black',
    borderRadius: '50%',
    marginRight: '12px',
    flexShrink: '0'
  }
});
