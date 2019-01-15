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

  ProfileWrapper: {
    _size: ['432px', 'auto'],
    zIndex: '2'
  },

  // Headers

  Header: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'stretch'],
    marginBottom: 'calc(81px - 33px)'
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

  HeaderLoading: {
    _size: ['72px'],
    _flex: ['row', 'center', 'center'],
    backgroundColor: 'rgba($sw1, .6)',
    borderRadius: '50%',
    opacity: '0',
    pointerEvents: 'none',
    position: 'absolute',
    left: '0',
    top: '0',

    isLoading: {
      opacity: '1'
    }
  },

  HeaderForm: {
    _size: ['100%'],
    _flex: ['column']
  },

  HeaderRow: {
    _size: ['100%', '40px'],
    borderRadius: '3px, 3px, 0px, 0px',
    transition: '.2s ease'
  },

  HeaderLoader: {
    _size: ['36px'],
    _flex: ['row', 'center', 'center'],
    position: 'absolute',
    right: '36px',
    top: '0px'
  },

  HeaderInput: {
    _el: 'input',
    _size: ['100%', 'auto'],
    _font: ['27px', '36px', '800'],
    color: 'black',
    backgroundColor: '$sw3',
    padding: '0',
    paddingLeft: '15px',
    transition: '.2s ease',

    '&:disabled': {
      pointerEvents: 'all !important',
      backgroundColor: 'transparent',
      transition: '.2s ease'
    }
  }
});
