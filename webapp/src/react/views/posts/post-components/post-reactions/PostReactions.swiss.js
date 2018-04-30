import { styleSheet } from 'react-swiss';

export default styleSheet({
  Container: {
    _flex: ['row', 'left', 'center'],
    display: 'inline-flex',
    hoverClass: {
      hasNoLikes: {
        opacity: 0,
        '.#{hoverClass} &': {
          opacity: 1
        },  
      },
    }
  },
  HeartButton: {
    _size: ['30px', '36px'],
    _flex: ['row', 'left', 'center'],
    alignRight: {
      _size: ['36px', '36px'],
      _flex: ['row', 'center', 'center'],
    },
  },
  HeartSvg: {
    _size: '24px',
    stroke: '$sw1',
    fill: 'transparent',
    transition: '.2s ease',
    '.heart-button:hover &': {
      stroke: '$red',
    },
    liked: {
      stroke: '$red',
      fill: '$red',
      '.heart-button:hover &': {
        opacity: '.6',
        transition: '.2s ease',
      },
    },
    '& path': {
      strokeWidth: '1px',
    },
  },
  LikeString: {
    opacity: 0,
    _font: ['12px', '18px', 400],
    color: '$sw1',
    show: {
      opacity: 1,
    },
    liked: {
      color: '$red',
    }
  }
});