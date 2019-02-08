import { styleSheet } from 'swiss-react';

export default styleSheet('Card2', {
  Wrapper: {
    _size: ['100%'],
    overflowY: 'auto',
    paddingTop: '30px',
    '-webkit-overflow-scrolling': 'touch',
    '@media $max600': {
      paddingTop: '0',
      backgroundColor: '$sw5'
    },
    '@media $maxH800': {
      paddingTop: '0'
    }
  },
  Card: {
    _size: ['100%', 'auto'],
    _borderRadius: ['3px', '3px', '0px', '0px'],
    maxWidth: '600px',
    minHeight: '100%',
    backgroundColor: '$sw5',
    boxShadow: '0 6px 12px 1px rgba(0,12,47,0.3)',
    margin: '0 auto',
    padding: '0 60px',
    '@media $max600': {
      padding: '0 24px'
    },
    '@media $maxH950': {
      _borderRadius: ['0px', '0px', '0px', '0px']
    }
  }
});
