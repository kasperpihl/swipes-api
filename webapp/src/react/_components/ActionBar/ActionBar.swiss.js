import { styleSheet } from 'swiss-react';

export default styleSheet('ActionBar', {
  Wrapper: {
    _flex: ['row', 'left', 'center'],
    height: '42px',
    width: 'auto',
    backgroundColor: '$green4',
    borderRadius: '3px',
    padding: '9px 12px',
    position: 'absolute',
    bottom: '24px',
    green: {
      backgroundColor: '$green1'
    }
  }
});
