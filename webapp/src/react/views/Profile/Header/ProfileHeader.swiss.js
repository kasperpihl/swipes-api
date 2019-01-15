import { styleSheet } from 'swiss-react';
import Icon from 'src/react/icons/Icon';

export default styleSheet('ProfileHeader', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'flex-start', 'center'],
    _font: ['27px', '27px', '400']
  },

  NameField: {
    _size: 'auto',
    userSelect: 'none'
  },

  ProfileImage: {
    _size: '72px',
    _flex: ['row', 'center', 'center'],
    flex: 'none',
    backgroundColor: 'grey',
    borderRadius: '50%',
    marginRight: '30px',
    overflow: 'hidden',

    '&': {
      _size: '72px',
      borderRadius: '50%'
    }
  },

  Picture: {
    _el: 'img',
    _size: ['72px']
  },

  HeaderInitials: {
    _size: '72px',
    _flex: ['row', 'center', 'center'],
    _font: ['21px', '500'],
    color: 'white',
    borderRadius: '50%'
  },

  HeaderFileInput: {
    _el: 'input',
    _size: ['144px'],
    backgroundColor: '$sw1',
    opacity: '0',
    position: 'absolute',
    top: '-50%',

    '&:hover': {
      opacity: '0.6',
      backgroundColor: 'blue',
      transition: '.25s ease',
      pointerEvents: 'all'
    }
  },

  OverlaySVG: {
    _el: Icon,
    _size: ['24px'],
    _svgColor: 'white',
    opacity: '0',
    position: 'absolute',

    '.fileInput:hover + &': {
      opacity: '1',
      transition: '.25s ease',
      pointerEvents: 'none'
    }
  }
});
