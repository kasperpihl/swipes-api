import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';
import Icon from 'src/react/_components/Icon/Icon';

export default styleSheet('ProfileHeader', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'flex-start', 'center'],
    _font: ['27px', '27px', '$regular']
  },

  NameField: {
    _size: 'auto',
    userSelect: 'none',
    cursor: 'pointer'
  },

  ProfileImage: {
    _size: '72px',
    _flex: ['row', 'center', 'center'],
    flex: 'none',
    backgroundColor: 'grey',
    borderRadius: '50%',
    marginRight: '18px',
    overflow: 'hidden',
    userSelect: 'none',

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
    _font: ['21px', '$medium'],
    color: 'white',
    borderRadius: '50%'
  },

  HeaderFileInput: {
    _el: 'input',
    backgroundColor: '$sw1',
    opacity: '0',
    overflow: 'hidden',
    position: 'absolute',
    zIndex: '-1'
  },

  ButtonWrapper: {
    _size: '100%',
    _flex: 'center',
    position: 'absolute',
    top: '0',
    left: '0',
    backgroundColor: 'transparent',

    '&:hover': {
      backgroundColor: '$blue',
      opacity: '0.6',
      transition: '.25s ease',
      cursor: 'pointer'
    }
  },

  OverlaySVG: {
    _el: Icon,
    _size: ['24px'],
    _svgColor: 'white',
    opacity: '0',
    position: 'absolute',

    '.ProfileHeader_ButtonWrapper:hover &': {
      opacity: '1',
      transition: '.25s ease',
      pointerEvents: 'none'
    }
  },

  OptionsButton: {
    _el: Button,
    marginLeft: 'auto'
  }
});
