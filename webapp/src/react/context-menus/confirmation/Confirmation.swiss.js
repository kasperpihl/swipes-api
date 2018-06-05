import { styleSheet } from 'swiss-react';

const containerWidth = '390px';

export default styleSheet('Confirmation', {
  Wrapper: {
    _size: [containerWidth, 'auto'],
    background: '$sw5',
    borderRadius: '6px',
    boxShadow: '0 1px 20px 3px rgba($sw1, .1)',
    padding: '45px',
    paddingBottom: '30px',
  },
  Title: {
    _font: ['21px', '27px', 500],
    color: '$sw1',
  },
  Message: {
    _font: ['15px', '27px'],
    color: '$sw1',
  },
  Actions: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'top'],
    marginTop: '45px',
    '& > *:not(:first-child)': {
      marginLeft: '15px',
    }
  }
});