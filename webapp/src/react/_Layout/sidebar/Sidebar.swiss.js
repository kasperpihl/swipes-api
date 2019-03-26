import { styleSheet } from 'swiss-react';
import Icon from 'src/react/_components/Icon/Icon';

export default styleSheet('Sidebar', {
  Wrapper: {
    _size: ['72px', '100%'],
    _flex: 'column',
    paddingBottom: '22px',
    flex: 'none'
  },

  TopSection: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'center', 'center'],
    marginTop: '22px',
    flex: 'none',

    '& > .item': {
      borderRadius: '4px !important'
    }
  },

  MiddleSection: {
    _size: '100%',
    _flex: ['column', 'center', 'center']
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
        transition: '.1s ease'
      }
    }
  },

  Section: {
    _size: ['54px', 'auto'],
    _flex: ['column', 'left', 'center']
  },

  Item: {
    _size: '54px',
    zIndex: '4',
    // overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, .3)',
    transition: '.3s ease',
    userSelect: 'none',

    '!round': {
      expanded: {
        width: '150px'
      },
      '&:first-child': {
        borderRadius: '4px 4px 0 0'
      },

      '&:last-child': {
        borderRadius: '0 0 4px 4px'
      },
      '&:not(:first-child)': {
        marginTop: '1px'
      }
    },

    round: {
      borderRadius: '27px',
      padding: '3px'
    },

    '& > *': {
      pointerEvents: 'none'
    },
    '&:hover': {
      backgroundColor: 'white'
    },
    active: {
      backgroundColor: 'white'
    }
  },
  OverflowHidden: {
    _size: '100%',
    overflow: 'hidden',
    _flex: ['row', 'left', 'center']
  },

  NotificationCounter: {
    _size: ['18px', '18px'],
    _flex: ['row', 'center', 'center'],
    _font: ['10px', '12px', 'bold'],
    color: '$sw5',
    background: '$red',
    borderRadius: '9px',
    position: 'absolute',
    left: '30px',
    top: '5px'
  },
  IconWrapper: {
    _size: '54px',
    _flex: 'center',
    flex: 'none'
  },
  Icon: {
    _el: Icon,
    _size: '42px',
    fill: '$sw2',
    transition: '.3s ease',
    pointerEvents: 'none',

    active: {
      fill: '$sw1'
    },
    '.Sidebar_Item:hover &': {
      fill: '$sw1',
      transition: '.3s ease'
    }
  },

  Description: {
    _font: '15px',
    color: '$sw2',
    paddingLeft: '3px',
    active: {
      color: '$sw1'
    },
    'active || .Sidebar_Item:hover &': {
      color: '$sw1'
    }
  },
  Tooltip: {
    pointerEvents: 'none',
    _font: '15px',
    color: '$sw1',
    display: 'inline-block',
    content: 'attr(data-title)',
    whiteSpace: 'nowrap',
    backgroundColor: '$sw5',
    borderRadius: '2px',
    boxShadow: '1px 1px 1px 1px rgba(0, 12, 47, 0.3)',
    opacity: '0',
    padding: '9px 15px',
    position: 'absolute',
    right: '-11px',
    top: '50%',
    transform: 'translateX(110%) translateY(-50%)',
    transition: '.3s ease',
    forceShow: {
      '.Sidebar_Item:hover &': {
        opacity: '1',
        transform: 'translateX(100%) translateY(-50%)',
        transition: '.3s ease',
        transitionDelay: '.3s'
      }
    },
    '!expanded': {
      '.Sidebar_Item:hover &': {
        opacity: '1',
        transform: 'translateX(100%) translateY(-50%)',
        transition: '.3s ease',
        transitionDelay: '.3s'
      }
    }
  }
});
