import { styleSheet } from 'react-swiss';

export default styleSheet('StepComplete', {
  Wrapper: {
    _size: '36px',
    borderRadius: '18px',
    _flex: 'center',
    '#{hoverClass}:hover &, &:hover': {
      border: '1px solid $sw3',
    },
    '&:hover': {
      background: '$sw3',
    }
  },
  Text: {
    _font: ['13px', '18px'],
    color: '$sw1',
    '!isComplete': {
      '#{hoverClass}:hover &, .sc-wrapper:hover &': {
        display: 'none',
      },
    }
    
  },
  Icon: {
    display: 'none',
    _size: '24px',
    _svgColor: '$sw1',
    '!isComplete': {
      '#{hoverClass}:hover &, .sc-wrapper:hover &': {
        display: 'block',
      },
    },
  }
});