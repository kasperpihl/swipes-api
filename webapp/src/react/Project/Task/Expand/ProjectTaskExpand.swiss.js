import { styleSheet } from 'swiss-react';
import Icon from 'src/react/_components/Icon/Icon';

export default styleSheet('ProjectTaskExpand', {
  Wrapper: {
    _size: ['24px', '30px'],
    _flex: ['row', 'center', 'center'],
    flex: 'none',
    cursor: 'pointer',
    opacity: 0.8,
    '&:hover': {
      opacity: 1
    }
  },
  ExpandIcon: {
    _el: Icon,
    _size: '24px',
    _svgColor: '$sw2',
    pointerEvents: 'none',
    expanded: {
      transform: 'rotate(90deg)'
    }
  }
});
