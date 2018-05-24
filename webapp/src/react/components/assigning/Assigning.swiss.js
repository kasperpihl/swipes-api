import { styleSheet } from 'swiss-react';

export default styleSheet('Assigning', {
  Wrapper: {
    _flex: ['row', 'right', 'center'],
    flexDirection: 'row-reverse',
    flex: 'none',
  },
  AbsoluteWrapper: {
    width: ({ size, images }) => `${(size - 6) * images + 6}px`,
    height: '#{size}px',
  },
  WhiteBackground: {
    _size: ({ size }) => `${size + 2}px`,
    position: 'absolute',
    background: '$sw5',
    borderRadius: props => `${(props.size + 2)/2}px`,
    top: '-1px',
    right: ({ index, size }) => `${index * (size - 6) - 1}px`,
  },
  ImageWrapper: {
    position: 'absolute',
    right: ({ index, size }) => `${index * (size - 6)}px`,
    top: 0,
    background: '$sw1',
    _size: '#{size}px',
    _flex: 'center',
    overflow: 'hidden',
    borderRadius: props => `${props.size/2}px`,
  },
  ExtraNumber: {
    _font: ['11px', '18px', 500],
    'size>=30': {
      _font: ['12px', '18px', 500],
    },
    'size>=36': {
      _font: ['13px', '18px', 500],
    },
    color: '$sw2',
    letterSpacing: '-0.3px',
    marginRight: '6px',
  },
 
});