import { styleSheet } from 'swiss-react';
import Icon from 'src/react/_components/Icon/Icon';

export default styleSheet('CommentReaction', {
  Container: {
    _flex: ['row', 'left', 'center'],
    display: 'inline-flex'
  },
  HeartButton: {
    _size: ['30px', '36px'],
    _flex: ['row', 'left', 'center'],
    alignRight: {
      _size: ['36px', '36px'],
      _flex: ['row', 'center', 'center']
    }
  },
  HeartSvg: {
    _el: Icon,
    _size: '24px',
    stroke: '$sw1',
    fill: 'transparent',
    transition: '.2s ease',
    webkitBackfaceVisibility: 'hidden',
    '.heart-button:hover &': {
      stroke: '$red'
    },
    liked: {
      stroke: '$red',
      fill: '$red',
      '.heart-button:hover &': {
        opacity: '.6',
        transition: '.2s ease'
      }
    },
    '& path': {
      strokeWidth: '1px'
    }
  },
  LikeString: {
    opacity: 0,
    _font: ['12px', '18px', 400],
    color: '$sw1',
    show: {
      opacity: 1
    },
    liked: {
      color: '$red'
    }
  }
});