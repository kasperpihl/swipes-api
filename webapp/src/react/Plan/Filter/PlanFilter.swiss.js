import { styleSheet } from 'swiss-react';
import Icon from 'src/react/_components/Icon/Icon';
import SectionHeader from 'src/react/_components/SectionHeader/SectionHeader';

export default styleSheet('PlanFilter', {
  Wrapper: {
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
    _svgColor: '$sw2',
    pointerEvents: 'none',
    transform: 'rotate(90deg)',
    transition: '.1s',
    expanded: {
      transform: 'rotate(270deg)'
    }
  }
});
