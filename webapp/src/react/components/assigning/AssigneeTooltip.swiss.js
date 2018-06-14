import { styleSheet } from 'swiss-react';

export default styleSheet('AssigneeTooltip', {
  Wrapper: {
    _size: ['180px', 'auto'],
    boxShadow: '0 1px 20px 3px rgba($sw1  ,0.1)',
    backgroundColor: '$sw5',
    overflowY: 'auto',
    padding: '9px 0',
    maxHeight: '400px',
  },
  Item: {
    _flex: ['row', 'left', 'center'],
    padding: '6px',
    _size: ['100%', '36px'],
  },
  ImageWrapper: {
    _flex: 'center',
    _size: '24px',
    background: '$sw2',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  Name: {
    _font: ['12px', '18px', 500],
    _truncateString: '',
    paddingLeft: '15px',
  },
})
