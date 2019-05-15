import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';
import Icon from 'src/react/_components/Icon/Icon';

export default styleSheet('ProfileHeader', {
  Wrapper: {
    _size: ['calc(100% - 18px)', '100%'],
    _flex: ['row', 'left', 'top'],
    marginLeft: '18px'
  },

  UserInfo: {
    _flex: ['column', 'left', 'top'],
    height: '100%'
  },

  NameField: {
    _textStyle: 'H1',
    fontWeight: 'bold',
    userSelect: 'none',
    cursor: 'pointer'
  },

  Subtitle: {
    _textStyle: 'body',
    color: '$sw2'
  },

  ProfileImage: {
    _size: '60px',
    _flex: ['row', 'center', 'center'],
    flex: 'none',
    backgroundColor: 'grey',
    borderRadius: '50%',
    marginRight: '18px',
    overflow: 'hidden',
    userSelect: 'none',

    '&': {
      _size: '60px',
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
    borderRadius: '50%',

    '&:hover': {
      backgroundColor: '$dark',
      opacity: '0.6',
      transition: '.25s ease',
      cursor: 'pointer'
    }
  },

  OverlaySVG: {
    _el: Icon,
    _size: ['24px'],
    fill: '$base',
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
    marginLeft: 'auto',
    marginTop: '6px'
  },

  ErrorTooltip: {
    _size: ['180px', '60px'],
    _font: ['12px', '18px', '$medium'],
    _flex: ['row', 'center', 'center'],
    borderRadius: '6px',
    color: '$red',
    boxShadow: '0 1px 20px 3px rgba($sw1  ,0.1)',
    backgroundColor: '$sw5',
    overflowY: 'auto',
    padding: '9px 0',
    maxHeight: '400px',
    opacity: '0',
    visibility: 'hidden',
    position: 'absolute',
    top: '0',
    left: '70px',
    zIndex: '999',
    transition: '.25s ease-in',

    show: {
      opacity: '1',
      visibility: 'visible'
    }
  }
});
