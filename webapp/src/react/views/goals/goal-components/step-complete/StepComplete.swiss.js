import { styleSheet } from 'swiss-react';
import Icon from 'Icon';

export default styleSheet('StepComplete', {
  Wrapper: {
    flex: 'none',
    _size: '36px',
    borderRadius: '18px',
    _flex: 'center',
    isComplete: {
      background: '$green',
      '&:hover': {
        background: 'rgba($green, .7)',
      },
    },
    '!isComplete': {
      background: '$sw5',
      '#{hoverClass}:hover &, &:hover': {
        border: '1px solid $sw3',
      },
      '&:hover': {
        background: '$sw3',
      }
    },
  },
  Text: {
    _font: ['12px', '18px', 400],
    color: '$sw1',
    isComplete: {
      color: '$sw5',
    },
    '#{hoverClass}:hover &, .sc-wrapper:hover &': {
      display: 'none',
    },

  },
  Icon: {
    _el: Icon,
    display: 'none',
    _size: '24px',
    _svgColor: '$sw1',
    '#{hoverClass}:hover &, .sc-wrapper:hover &': {
      display: 'block',
    },
    isComplete: {
      _svgColor: '$sw5',
    },
    '!isComplete': {
      '.sc-wrapper:hover &': {
        _svgColor: '$blue',
      }
    }
  },
});
