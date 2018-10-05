import { styleSheet } from 'swiss-react';

export default styleSheet('ScreenSizeOverlay', {
  Wrapper: {
    _size: ['100%'],
    _flex: ['column', 'center', 'center'],
    backgroundColor: 'rgba($sw2, .99)',
    left: 0,
    top: 0,
    padding: '0 60px',
    position: 'fixed',
    zIndex: 99999999,
  },
  Title: {
    _font: ['36px', '48px', 400],
    display: 'block',
    color: 'white',
    textAlign: 'center',
  },
  Subtitle: {
    _font: ['15px', '24px', 400],
    marginTop: '12px',
    display: 'block',
    color: 'white',
    textAlign: 'center',
  },
  CurrentSize: {
    _font: ['15px', '24px', 400],
    backgroundColor: '$red',
    color: 'white',
    marginTop: '12px',
    display: 'block',
    position: 'fixed',
    right: 0,
    top: 0,
    padding: '9px 15px',
  },
});
