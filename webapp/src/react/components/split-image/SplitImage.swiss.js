import { styleSheet } from 'swiss-react';
import AssigneeImage from '../assigning/AssigneeImage';

export default styleSheet('SplitImage', {
  Container: {
    _size: ['#{size=50}px'],
    _flex: ['row', 'center'],
    backgroundColor: '$sw5',
    borderRadius: props => `${(props.size || 50)/2}px`,
    border: 'none',
    overflow: 'hidden',
  },

  Left: {
    _size:'100%',
    overflow: 'hidden',
    'numberOfImages>1': {
      borderRight: '1px solid $sw5',
    },
    'numberOfImages=2': {
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
    _size: props => `${(props.size || 50)/2}px`,
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
