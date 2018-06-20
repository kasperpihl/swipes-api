import { styleSheet } from 'swiss-react';

export default styleSheet('PingComposer', {
  AbsoluteWrapper: {
    width: '100%',
    _flex: ['column', 'left', 'top'],
  },
  BarWrapper: {
    background: '$sw5',
    borderBottom: '1px solid $sw3',
    padding: '6px',
    _flex: ['row', 'left', 'center'],
    width: '100%',
    zIndex: 3,
  },
  QuickAddWrapper: {
    position: 'absolute',
    height: 'auto',
    bottom: 0,
    left: 0,
    width: '100%',
    background: '$sw5',
    zIndex: 2,
    borderBottom: '1px solid $sw3',
    padding: '6px',
    _flex: ['row', 'left', 'center'],
    width: '100%',
    overflowX: 'hidden',
    visibility: 'visible',
    transition: 'transform .5s',
    transitionDelay: '.1s',
    transform: 'translateY(0)',
    '.quick-add-hover:hover &': {
      transform: 'translateY(100%)',
      transitionDelay: '.1s',
      visibility: 'visible',
    }
  },
  Column: {
    width: '100%',
    padding: '6px',
    _flex: ['column', 'left', 'top'],
    hidden: {
      display: 'none',
    },
    none: {
      width: 'initial',
      flex: 'none',
    }
  },
  Label: {
    _font: ['12px', '12px', 500],
    color: '$sw2',
    paddingLeft: '6px',
    paddingRight: '6px',
  },
  UserWrapper: {
    _el: 'span',
    _flex: ['row', 'left', 'center'],
    flex: 'none',
    padding: '0px 6px',
  },
  UserName: {
    _font: ['12px', '18px', 400],
    paddingLeft: '6px',
    '.user-name-hover:hover &': {
      color: '$blue',
    },
  }
});