import { styleSheet } from 'swiss-react';

export default styleSheet('Stepper', {
  InputPackage: {
    _size: ['auto', '24px'],
    _flex: ['row', 'left', 'center'],
    flex: 'none',
    position: 'relative'
  },

  StepCounter: {
    _textStyle: 'caption',
    _flex: ['row', 'center', 'center'],
    _size: ['24px', '18px'],
    backgroundColor: '$base',
    flex: 'none',
    border: '1px solid $sw2',
    borderRadius: '2px',
    margin: '0 3px',
    color: '$sw2',
    userSelect: 'none'
  }
});
