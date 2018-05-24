import { styleSheet } from 'swiss-react';

export default styleSheet('PlanListItem', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'center'],
    padding: '12px',
    borderBottom: '1px solid $sw4',
  },
  TextWrapper: {
    _flex: ['column', 'left', 'top'],
    marginLeft: '24px',
    width: '100%',
  },
  Title: {
    _font: ['15px', '24px', 300],
    color: '$sw1',
    '.hover-class:hover &': {
      color: '$blue',
    }
  },
  ProgressBar: {
    _size: ['120px', '18px'],
    background: 'rgba($green, 0.1)',
    borderRadius: '12px',
    overflow: 'hidden',
    '.hover-class:hover &': {
      opacity: .9
    },
    '&:before': {
      content: '',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '18px',
      background: '$green',
      zIndex: 2,
      width: ({ goalPercentage }) => `${goalPercentage}%`,
    },
    '&:after': {
      content: '',
      position: 'absolute',
      zIndex: 1,
      bottom: 0,
      left: 0,
      width: ({ stepPercentage, goalPercentage }) => {
        if(!stepPercentage) return '0%';
        const remainingPercentage = 100 - goalPercentage;
        const extraWidth = (remainingPercentage / 100) * stepPercentage;
        return `${goalPercentage + extraWidth}%`;
      },
      height: '18px',
      background: 'rgba($green, 0.3)',
    }
  },
});