import { styleSheet } from 'swiss-react';

export default styleSheet('PostHeader', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'top'],
    backgroundColor: 'white',
  },
  LeftSide: {
    flex: 'none',
  },
  RightSide: {
    width: '100%',
    _flex: ['column', 'left', 'top'],
    paddingLeft: '18px',
  },
  NameWrapper: {
    _flex: ['row', 'between', 'top'],
    width: '100%',
  },
  NameTitle: {
    color: '$sw1',
    _font: ['15px', '24px', 400],
  },
  Subtitle: {
    color: '$sw2',
    marginTop: '3px',
    _font: ['12px', '18px', 400],
    'clickable': {
      '&:hover': {
        color: '$blue',
      }
    }
    
  },
});