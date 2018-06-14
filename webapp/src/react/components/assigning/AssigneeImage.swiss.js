import { styleSheet } from 'swiss-react';

export default styleSheet('AssigneeImage', {
  Image: {
    _el: 'img',
    _size: '100%',
    blackAndWhite: {
      filter: 'grayscale(100%)',
    }
  },
  Initials: {
    _font: ['10px', '18px', 500],
    'size>=30': {
      _font: ['12px', '18px', 500],
    },
    color: '$sw5',
    textTransform: 'uppercase',
  },
})