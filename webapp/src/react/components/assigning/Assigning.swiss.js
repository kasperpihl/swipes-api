import { styleSheet } from 'react-swiss';

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
  Image: {
    _size: '100%',
  },
  Initials: {
    _font: ['10px', '18px', 500],
    'size>=30': {
      _font: ['12px', '18px', 500],
    },
    color: '$sw5',
    textTransform: 'uppercase',
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
  TooltipWrapper: {
    _size: ['180px', 'auto'],
    boxShadow: '0 1px 20px 3px rgba($sw1  ,0.1)',
    backgroundColor: '$sw5',
    overflowY: 'auto',
    padding: '9px 0',
    maxHeight: '400px',
  },
  TooltipItem: {
    _flex: ['row', 'left', 'center'],
    padding: '6px',
    _size: ['100%', '36px'],
  },
  TooltipImage: {
    _flex: 'center',
    _size: '24px',
    background: '$sw2',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  TooltipName: {
    _font: ['12px', '18px', 500],
    _truncateString: '',
    paddingLeft: '15px',
  },
});