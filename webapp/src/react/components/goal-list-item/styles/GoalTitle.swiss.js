import { element } from 'react-swiss';

export default element({
  _font: ['15px', '$deepBlue90', '24px', '400'],
  padding: '0 18px',
  transition: '.2s ease',

  inTakeAction: {
    _font: ['15px', '$deepBlue90', '24px', '500'],
  },

  '#{hoverRef}:hover &': {
    color: '$blue100',
    transition: '.2s ease'
  }
})
