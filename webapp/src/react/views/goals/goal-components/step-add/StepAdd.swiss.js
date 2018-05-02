import { styleSheet } from 'react-swiss';

export default styleSheet('StepAdd', {
  Wrapper: {
    _flex: ['row', 'left', 'center'],
    size: ['100%', 'auto'],
    borderTop: '1px solid $sw3',
  },
  LeftIcon: {
    _size: '24px',
    _svgColor: '$sw1',
    margin: '12px',

    flex: 'none',
  },
  AssigneesWrapper: {
    flex: 'none',
  },
  SubmitWrapper: {
    _size: '36px',
    flex: 'none',
  }
});