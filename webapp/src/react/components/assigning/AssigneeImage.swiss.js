import { styleSheet } from 'swiss-react';

export default styleSheet('AssigneeImage', {
  Wrapper: {
    _size: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '50%',
  },
  Image: {
    _el: 'img',
    _size: '100%',

    blackAndWhite: {
      filter: 'grayscale(100%)',
    },
  },

  Initials: {
    _size: ['100%'],
    _font: ['10px', '18px', 500],
    _flex: 'center',
    'size>=30': {
      _font: ['12px', '18px', 500],
    },
    textTransform: 'uppercase',
    color: '$sw5',
    backgroundColor: '$sw1',
  },

  Text: {
    _el: 'span',

    'numberOfImages=3': {
      top: {
        paddingTop: '5px',
      },
      bottom: {
        paddingBottom: '5px',
      },
    },
  },
});
