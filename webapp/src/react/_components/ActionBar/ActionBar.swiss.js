import { styleSheet } from 'swiss-react';

export default styleSheet('ActionBar', {
  Wrapper: {
    _flex: ['row', 'left', 'center'],
    height: '42px',
    backgroundColor: '$sw4',
    borderRadius: '3px',
    padding: '9px 12px',
    position: 'absolute',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    green: {
      backgroundColor: '$green1'
    }
  },

  Separator: {
    width: '1px',
    height: '18px',
    backgroundColor: '$sw2',
    margin: '0 12px',
    flex: 'none'
  }
});
