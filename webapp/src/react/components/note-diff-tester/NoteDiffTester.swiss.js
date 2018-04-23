import { styleSheet } from 'react-swiss';

export default styleSheet('NoteDiffTester', {
  Wrapper: {
    padding: '20px',
    paddingTop: '64px',
    background: 'white',
    _size: '100%',
    _flex: '',
  }
  Note: {
    _size: '100%',
    border: '1px solid gray',
    inMiddle: {
      _size: ['100%', '50%'],
    },
  },
  Middle: {
    _size: '100%',
    _flex: 'column',
  }
});