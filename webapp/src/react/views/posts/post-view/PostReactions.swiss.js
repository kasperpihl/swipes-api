export default {
  Container: {
    _flex: ['row', 'left', 'center'],
    display: 'inline-flex',
  },
  HeartButton: {
    _size: ['30px', '36px'],
    _flex: ['row', 'left', 'center'],
  },
  HeartSvg: {
    _size: '24px',
    stroke: '$middle',
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
    color: '$middle',
    show: {
      opacity: 1,
    },
    liked: {
      color: '$red',
    }
  }
}