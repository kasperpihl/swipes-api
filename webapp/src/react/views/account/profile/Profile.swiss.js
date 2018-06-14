import { styleSheet } from 'swiss-react';
import ReactTextarea from 'react-textarea-autosize';
import Icon from 'Icon';

export default styleSheet('Profile', {
  MainWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'center', 'top'],
    paddingTop: '30px',
  },

  ProfileWrapper: {
    _size: ['432px', 'auto'],
    zIndex: '2',
  },

  // Headers

  Header: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'stretch'],
    marginBottom: 'calc(81px - 33px)',
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
      borderRadius: '50%',
    },
  },

  Picture: {
    _el: 'img',
  },

  OverlaySVG: {
    _size: ['24px'],
    _svgColor: 'white',
    opacity: '0',
    position: 'absolute',

    '.fileInput:hover + &': {
      opacity: '1',
      transition: '.25s ease',
      pointerEvents: 'none',
    },
  },

  HeaderInitials: {
    _size: '72px',
    _flex: ['row', 'center', 'center'],
    _font: ['21px', '500'],
    color: 'white',
    borderRadius: '50%',
  },

  HeaderFileInput: {
    _el: 'input',
    _size: ['144px'],
    backgroundColor: '$blue',
    opacity: '0',
    position: 'absolute',
    top: '-50%',

    '&:hover': {
      opacity: '0.6',
      transition: '.25s ease',
      pointerEvents: 'cursor',
    },
  },

  HeaderLoading: {
    _size: ['72px'],
    _flex: ['row', 'center', 'center'],
    backgroundColor: 'rgba($blue, .6)',
    borderRadius: '50%',
    opacity: '0',
    pointerEvents: 'none',
    position: 'absolute',
    left: '0',
    top: '0',

    isLoading: {
      opacity: '1',
    },
  },

  HeaderForm: {
    _size: ['100%'],
    _flex: ['column'],
  },

  HeaderRow: {
      _size: ['100%', '40px'],
      borderRadius: '3px, 3px, 0px, 0px',
      transition: '.2s ease',
  },

  HeaderLoader: {
    _size: ['36px'],
    _flex: ['row', 'center', 'center'],
    position: 'absolute',
    right: '36px',
    top: '0px',
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
      transition: '.2s ease',
    },
  },

  // Profile Form

  Form: {
    _size: ['100%', 'auto'],
  },

  FormRow: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'top'],
    paddingTop: '33px',
  },

  FormLoader: {
     _size: ['36px'],
     _flex: ['row', 'center', 'center'],
     position: 'absolute',
     right: '-42px',
     top: '33px',
  },

  FormTitle: {
    _size: ['102px', '36px'],
    _flex: ['row', 'right', 'center'],
    _font: ['11px', '18px', 'bold'],
    paddingRight: '30px',
  },

  FormInput: {
    _el: 'input',
    _size: ['100%', '36px'],
    _font: ['12px', '18px'],
    backgroundColor: '$sw3',
    color: 'black',
    borderRadius: '3px',
    padding: '0 15px',
    transition: '.2s ease',

    '&:disabled': {
      backgroundColor: 'transparent',
      transition: '.2s ease',
    },
  },

  FormTextArea: {
    _el: ReactTextarea,
    _size: ['100%', 'auto'],
    _font: ['12px', '18px'],
    color: 'black',
    boxShadow: 'content-box',
    backgroundColor: '$sw3',
    borderRadius: '3px',
    padding: '9px 15px',
    paddingBottom: '33px',
    resize: 'none',
    cursor: 'text',
    transition: '.2s ease',

    disabled: {
      backgroundColor: 'transparent',
      transition: '.2s ease',
    },
  },

  EmailField: {
    _size: ['100%', '36px'],
    _font: ['12px', '18px'],
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  FormCounter: {
    _font: ['11px', '18px', 'bold'],
    position: 'absolute',
    color: '$sw2',
    right: '15px',
    bottom: '9px',
    transition: '.2s ease',

    disabled: {
      opacity: '0',
      transition: '.2s ease',
    },
  },

  EditButton: {
    _size:['calc((100% - 432px) / 2)', 'auto'],
    _flex:['row', 'right', 'top'],
    _font:['12px', '18px', '500'],
    position: 'absolute',
    right: '0',
    paddingRight: '60px',
  },

  ErrorIcon: {
    _size: ['36px'],
    _flex: ['row', 'center', 'center'],
    border: '2px solid $red',
    borderRadius: '50%',
    animation: 'fadeLabelOut .5s ease reverse forwards',

    '&:after': {
      _font: ['12px', '16px'],
      color: 'white',
      content: 'attr(data-error)',
      position: 'absolute',
      top: '-14px',
      left: '50%',
      backgroundColor: '$red',
      transform: 'translateX(-50%), translateY(-100%)',
      padding: '6px 9px',
      borderRadius: '3px',
      whiteSpace: 'nowrap',
      animation: 'fadeLabelOut .5s 3s ease forwards',
    },

    '&:before': {
      _size: ['12px'],
      content: '',
      position: 'absolute',
      top: '-22px',
      left: '50%',
      transform: 'translateX(-50%), rotate(45deg)',
      backgroundColor: '$red',
      animation: 'fadeLabelOut .5s 3s ease forwards',
    },

    '@keyframes fadeLableOut': {
      'from': {
        opacity: '1',
      },
      'to': {
        opacity: '0',
      },
    }
  },

  ErrorSVG: {
    _el: Icon,
    _size: ['24px'],
    _svgColor: '$red',
  },

  SuccessIcon: {
    _size: ['36px'],
    _flex: ['row', 'center', 'center'],
    animation: 'fadeLabelOut .5s ease reverse forwards',
  },

  SuccessSVG: {
    _el: Icon,
    _size: ['24px'],
    _svgColor: '$green',
  },

  Spinner: {
    _el: 'svg',
    _size: ['24px'],
    _svgColor: '$blue',
    animation: 'rotateSpinner 2s linear infinite',

    '@keyframes rotateSpinner': {
      '100%': {
        transform: 'rotate(360deg)',
      }
    }
  },

  LoadingIcon: {
    _size: ['50px'],
    _svgColor: '$blue',
    animation: 'rotateSpinner 2s linear infinite',

    '@keyframes rotateSpinner': {
      '100%': {
        transform: 'rotate(360deg)',
      }
    }
  },

  SpinnerPath: {
    _el: 'circle',
    strokeLinecap: 'round',
    animation: 'dashSpinner 1.5s ease infinite',
    strokeWidth: '4',

    '@keyframes dashSpinner': {
      '0%': {
        strokeDasharray: '1, 150',
        strokeDashoffset: '0',
      },
      '50%:': {
        strokeDasharray: '90, 150',
        strokeDashoffset: '-35',
      },
      '100%': {
        strokeDasharray: '90, 150',
        strokeDashoffset: '-124',
      }
    }
  },
})
