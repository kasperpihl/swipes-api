import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('Card', {
  Wrapper: {
    _size: ['100%', 'calc(100% - (60px - 38px))'],
    _borderRadius: ['6px', '6px', '0px', '0px'],
    _flex: ['column', 'left', 'top'],
    marginTop: 'calc(60px - 38px)',
    boxShadow: '0 6px 12px 1px rgba($sw2, 0.3)',
    backgroundColor: '$sw5',
    left: 0,
    top: 0,
    zIndex: 2,
    overflow: 'hidden',
    position: 'absolute',
    willChange: 'width, transform',
    width: get => `${get('width')}px`,
    transform: get =>
      `translate3d(${get('left', 0)}px, ${
        get('isUnderlay', false) ? 20 : 0
      }px, 0px)`,
    transition: 'transform 0.3s ease',
    isOverlay: {
      zIndex: 3
    },
    isUnderlay: {
      '& > *:not(.Card_Header)': {
        pointerEvents: 'none'
      }
    }
  },
  Header: {
    _size: ['calc(100% - 36px)', 'auto'],
    margin: '0 18px',
    flex: 'none'
  },
  Actions: {
    _size: ['auto', '100%'],
    paddingTop: '12px',
    _flex: ['row', 'left', 'center'],
    position: 'absolute',
    right: 0,
    top: 0
  },
  Content: {
    _size: '100%'
  },
  Button: {
    _el: Button,
    opacity: '1',
    visibility: 'visible',

    isLocked: {
      opacity: '0',
      visibility: 'hidden'
    }
  },
  PinButton: {
    _el: Button,
    borderRadius: '50% !important'
  }
});
