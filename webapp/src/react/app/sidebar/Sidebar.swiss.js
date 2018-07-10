import { styleSheet } from 'swiss-react';
import Icon from 'Icon';

export default styleSheet('Sidebar', {
  Wrapper: {
    _size: ['84px', '100%'],
    _flex: 'column',
    zIndex: '5',
    paddingBottom: '22px',
  },

  TopSection: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'center', 'center'],
    marginTop: '22px',
    flex: 'none',

    '& > .item': {
      borderRadius: '4px !important'
    },
  },

  MiddleSection: {
    _size: '100%',
    _flex: ['column', 'center', 'center'],
  },

  BottomSection: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'center', 'center'],
    flex: 'none',

    active: {
      '&:after': {
        _size: '54px',
        backgroundColor: '$sw1',
        borderRadius: '50%',
        content: '',
        left: '0',
        top: '0',
        position: 'absolute',
        zIndex: '-1',
        opacity: '1',
        transition: '.1s ease',
      },
    },
  },

  Section: {
    _size: ['54px', 'auto'],
    _flex: ['column', 'center', 'center'],
  },

  Slider: {
    _size: '54px',
    backgroundColor: '$sw1',
    position: 'absolute',
    left: '0',
    top: '0',
    borderRadius: '50px',
    zIndex: '1',
    transition: '.3s ease',

    hidden: {
      left: '0',
      top: 'calc(100% - 54px)',
      opacity: '0',
      transition: '.3s ease',
    },
  },

  Item: {
    _size: '54px',
    _flex: ['row', 'center', 'center'],
    zIndex: '2',
    backgroundColor: 'rgba(255, 255, 255, .3)',
    transition: '.2s ease',

    '&:first-child': {
      borderRadius: '4px 4px 0 0',
    },

    '&:last-child': {
      borderRadius: '0 0 4px 4px',
    },

    '&:not(:first-child)': {
      marginTop: '1px',
    },

    '& > *': {
      pointerEvents: 'none',
    },

    '&:hover > .description': {
      opacity: '1',
      transform: 'translateX(100%)',
      transition: '.2s ease',
    },

    '&:hover > .icon': {
      _svgColor: '$sw1',
      opacity: '1',
      transition: '.2s ease',
    },

    active: {
      backgroundColor: 'white',
      opacity: '1',
    },

  },

  NotificationCounter: {
    _size: ['16px', '16px'],
    _flex: ['row', 'center', 'center'],
    _font: ['10px', '12px', 'bold'],
    color: '$sw5',
    background: '$red',
    position: 'absolute',
    right: '1px',
    top: '1px',
    paddingBottom: '1px',
    pointerEvents: 'none',
    borderTopRightRadius: '4px',
    pointerEvents: 'none',

    active: {
      color: '$sw5',
      backgroundColor: '$sw1',
      transition: '.2s ease',
    },
  },

  Icon: {
    _el: Icon,
    _size: '24px',
    _svgColor: '$sw1',
    opacity: '.3',
    transition: '.2s ease',
    pointerEvents: 'none',

    active: {
      _svgColor: '$sw1',
      opacity: '1',
      transition: '.2s ease',
    },
  },

  Description: {
    pointerEvents: 'none',
    _font: '15px',
    color: '$sw1',
    display: 'inline-block',
    content: 'attr(data-title)',
    whiteSpace: 'nowrap',
    backgroundColor: '$sw5',
    borderRadius: '2px',
    boxShadow: '0 6px 6px 1px rgba(0, 12, 47, 0.1)',
    opacity: '0',
    padding: '9px 15px',
    position: 'absolute',
    right: '-9px',
    transform: 'translateX(110%)',
    transition: '.2s ease',

  },
})
