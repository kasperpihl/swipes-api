import { styleSheet } from 'swiss-react';
import Icon from '_shared/Icon/Icon';

export default styleSheet('ProjectTask', {
  Icon: {
    _el: Icon,
    _size: '24px',
    flex: 'none',
    pointerEvents: 'none',
    '.ProjectTask_Wrapper:hover &': {
      fill: '$blue'
    }
  },
  ButtonWrapper: {
    _flex: ['row', 'center', 'center'],
    height: '26px',
    opacity: '0',
    visbility: 'hidden',
    '.ProjectTask_Wrapper:hover &': {
      opacity: '1',
      visbility: 'visible'
    }
  },
  Wrapper: {
    _flex: ['row', 'left', 'top'],
    width: '100%',
    paddingLeft: get => `${get('indention') * 24}px`,
    paddingRight: '6px',
    isSelected: {
      backgroundColor: '$green4',
      opacity: 1
    },
    isFocused: {
      backgroundColor: '$green2',
      opacity: 1
    },
    '&:hover': {
      opacity: 1
    },
    cursor: 'pointer',
    borderRadius: '4px'
    // flex: 'none'
  }
});
