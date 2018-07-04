import { styleSheet } from 'swiss-react';
import Icon from 'Icon';

export default styleSheet('Onboarding', {
  Wrapper: {
    _size: ['100%', 'auto'],
    borderTop: '1px solid',
  },

  Item: {
    _size:['100%', '85px'],
    _flex: ['row', 'left', 'center', ],
    transition: '.1s ease',

    '&:not(:last-child)': {
      borderBottom: '1px solid $blue5',
    },

    '&:hover': {
      backgroundColor: '$blue5',
      transition: '.1s ease',
    },
  },

  Progress: {
    _size: ['66px'],
    _flex:['row', 'center', 'center'],
    borderRadius: '50%',

    '&:after':{
      content: '',
      position: 'absolute',
      left: '2px',
      top: '2px',
      _size: ['62px'],
      borderRadius: '50%',
      border: '2px solid $blue5',
    },

    completed: {
      '&:after': {
        borderColor: 'transparent',
        transition: '.1s cubic-bezier(.7,.07,.42,1.68)',
      },
    },
  },

  ProgressNumber: {
    _font: ['15px', '20px', '500'],
    color: '$sw2',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50% ,-50%)',

    completed: {
      color: 'white',
    }
  },

  Splash: {
    _size: ['66px'],
    backgroundColor: '$green',
    borderRadius: '50%',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    willChange: 'width height',
    transition: '.3s all ease-in-out',
    clipPath: 'circle(0% at 50% 50%)',

    completed: {
      clipPath: 'circle(100% at 50% 50%)',
      transition: '.7s cubic-bezier(.7,.07,.42,1.68)',
    },
  },

  ProgressBar: {
    _el: Icon,
    _size: ['66px'],
    _svgColor: '$green',
    transform: 'rotate(-90deg)',
    opacity: '1',
    transition: '.3s ease',
    zIndex: '2',
  },

  Indicator: {
    _size: ['36px'],
    _flex: ['row', 'center', 'center'],
    backgroundColor: '$blue5',
    marginLeft: '12px',
    marginRight: '21px',
    borderRadius: '50%',

    '&:after': {
      _size: ['36px'],
      backgroundColor: '$blue5',
      borderRadius: '50%',
      content: '',
      left: '0',
      top: '0',
      position: 'absolute',
      transition: '.3s .3s ease',
    },

    completed: {
      transition: '.3s ease',

      '&:after': {
        backgroundColor: '#1DD465',
        borderRadius: '50%',
        content: '',
        left: '0',
        top: '0',
        position: 'absolute',
        transition: '.3s .3s ease',
      },
    },
  },

  Checkmark: {
    _el: Icon,
    opacity: '0',

    completed:{
      _size: ['24px'],
      _svgColor: '$sw5',
      opacity: '1',
      left: '3px',
      strokeDasharray: '18.48540687561035',
      strokeDashoffset: '18.48540687561035',
      transition: '.3s ease',
      zIndex: '2',
    }
  },

  Content: {
    _size: ['100%', 'auto'],
  },

  Button: {
    _size: ['24px'],
    margin: '0 21px',
  },

  ArrowRight: {
    _el: Icon,
    opacity: '0',
    transform: 'translateX(-10px)',
    transition: '.2s ease',

    '.item:hover &': {
      opacity: '1',
      transform: 'translateX(0px)',
    },
  },

  TutorialSection: {
    _flex: ['row', 'space-between'],
    marginTop: '40px',
  },

  Title: {
    _font: ['18px', '24px'],
  },

  Subtitle: {
    _font: ['12px', '15px', '500'],
    marginTop: '3px',
    color: '$sw2',
  },

  TutorialImage: {
    _el: 'img',
    marginTop: '20px',
    opacity: '0.6',
    transform: 'translateY(0px)',
    filter: 'grayscale(100%)',
    transition: '.2s ease',
    cursor: 'pointer',

    '&:hover': {
      opacity: '1',
      filter: 'grayscale(0%)',
      transform: 'translateY(5px)',
      transition: '.2s ease',
    },
  },
})
