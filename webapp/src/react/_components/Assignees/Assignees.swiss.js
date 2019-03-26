import { styleSheet } from 'swiss-react';

export default styleSheet('Assignees', {
  Wrapper: {
    _flex: ['row', 'right', 'center'],
    flexDirection: 'row-reverse',
    flex: 'none',
    cursor: 'pointer',
    '& > *': {
      pointerEvents: 'none'
    }
  },
  AbsoluteWrapper: {
    width: get => `${(get('size') - 6) * get('imageCount') + 6}px`,
    height: get => `${get('size')}px`
  },
  WhiteBackground: {
    _size: get => `${get('size') + 2}px`,
    position: 'absolute',
    background: '$sw5',
    borderRadius: get => `${(get('size') + 2) / 2}px`,
    top: '-1px',
    right: get => `${get('index') * (get('size') - 6) - 1}px`
  },
  ImageWrapper: {
    _size: get => `${get('size')}px`,
    _flex: 'center',
    _borderRadius: get => `${get('size') / 2}px`,
    position: 'absolute',
    right: get => `${get('index') * (get('size') - 6)}px`,
    top: 0,
    overflow: 'hidden'
  },

  ExtraNumber: {
    _font: ['11px', '18px', '$medium'],
    'size>=30': {
      _font: ['12px', '18px', '$medium']
    },
    'size>=36': {
      _font: ['13px', '18px', '$medium']
    },
    color: '$sw2',
    letterSpacing: '-0.3px',
    marginRight: '6px'
  }
});
