import { styleSheet } from 'swiss-react';
import AssigneeImage from '../assigning/AssigneeImage';

export default styleSheet('SplitImage', {
  Container: {
    _size: ['50px'],
    _flex: ['row', 'center'],
    backgroundColor: 'white',
    borderRadius: '50px',
    border: 'none',
    marginLeft: '100px',
    overflow: 'hidden',
  },

  Left: {
    _size:'100%',
    overflow: 'hidden',
    'numberOfImages>1': {
      borderRight: '1px solid $sw5',
    },
    'numberOfImages<3': {
      _size: ['50%', '100%'],
    },
    'numberOfImages=3': {
      _size: ['75%', '100%'],
    },
  },

  Right: {
    _size: ['50%', '100%'],
    _flex: ['column', 'center'],
    overflow: 'hidden',
  },

  ImageBox: {
    _size: '25px',
    _flex: ['center'],
    'numberOfImages<3': {
      _size: '100%',
    },

    border: {
      borderTop: '1px solid $sw5',
    },
  },

  Image: {
    _el: AssigneeImage,
    backgroundColor: '$sw1',
    objectFit: 'cover',
  },
})
