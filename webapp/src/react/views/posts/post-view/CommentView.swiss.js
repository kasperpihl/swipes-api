import { styleSheet } from 'react-swiss';

export default styleSheet({
  Container: {
    _flex: ['row', 'left', 'top'],
    marginTop: '12px',
    width: '100%',
  },
  Picture: {
    flex: 'none',
    marginLeft: '3px',
    _size: '36px',
  },
  Content: {
    _flex: ['column', 'left', 'top'],
    width: '100%',
    paddingLeft: '12px',
    paddingRight: '12px',
  },
  Actions: {
    _flex: ['column', 'center', 'top'],
  },
  Name: {
    _font: ['12px', '18px', 500],
    color: '$sw1',
  },
  Timestamp: {
    _font: ['12px', '18px', 400],
    color: '$sw2',
  },
  Message: {
    _font: ['12px', '18px', 300],
    color: '$sw1',
  },
  Attachments: {
    marginTop: '6px',
  },
});