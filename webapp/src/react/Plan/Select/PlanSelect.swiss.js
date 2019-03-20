import { styleSheet } from 'swiss-react';
import Icon from 'src/react/_components/Icon/Icon';
import SectionHeader from 'src/react/_components/SectionHeader/SectionHeader';

export default styleSheet('PlanSelect', {
  Wrapper: {
    _flex: ['row', 'flex-start', 'flex-start'],
    padding: '30px 30px 0 30px'
  },
  Content: {
    width: '100%'
  },
  SectionHeader: {
    _el: SectionHeader,
    cursor: 'pointer',
    userSelect: 'none'
  },
  Icon: {
    _el: Icon,
    _size: '24px',
    fill: '$sw2',
    pointerEvents: 'none',
    transform: 'rotate(90deg)',
    transition: '.1s',
    expanded: {
      transform: 'rotate(270deg)'
    }
  }
});
