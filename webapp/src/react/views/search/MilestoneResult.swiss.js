import { styleSheet } from 'swiss-react';
import Icon from 'Icon';

export default styleSheet('MilestoneResult', {
  Wrapper: {
    _size: ['100%', '61px'],
    _flex: ['row', 'left', 'center'],
    padding: '0 6px',
    transition:'.2s ease',

    '&:hover': {
      backgroundColor: '$blue5',
      transition: '.2s ease',
    },

    '&:hover > .title': {
      color: '$blue',
      transition: '.2s ease',
    },
  },

  IconWrapper: {
    _size: '36px',
    _flex: ['row', 'center','center'],
    backgroundColor: '$sw3',
    borderRadius: '5px',
  },

  Icon: {
    _el: Icon,
    _size: '18px',
    _svgColor: '$sw1',
  },

  Title: {
    _size: ['100%', 'auto'],
    _font: ['15px', '24px'],
    color: '$sw1',
    paddingLeft: '12px',
    paddingRight: '6px',
    transition: '.2s ease',
  },
})
