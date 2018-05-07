import { styleSheet } from 'react-swiss';

export default styleSheet({
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'top'],
    paddingBottom: '30px',
  },
  Side: {
    width: '100%',
    right: {
      width: '288px',
      flex: 'none',
      marginLeft: '36px',
      'viewWidth>825': {
        marginLeft: '54px',
      }
    },
  },
  CompletedWrapper: {
    _size: ['100%', '120px'],
    _flex: ['row', 'center', 'center'],
    borderTop: '1px solid $sw3',
  },
  CompletedText: {
    _font: ['12px', '18px', 400],
    color: '$sw2',
    paddingRight: '60px',
  },
  GreenIcon: {
    _size: '120px',
    _svgColor: '$green',
  },
  Section: {
    _size: ['100%', '72px'],
    _flex: ['row', 'between', 'center'],
    _font: ['11px', '24px', 500],
    color: '$sw1',
  },
  StepWrapper: {
    _size: 'auto',
    background: '$sw5',
  },
});