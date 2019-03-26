import { styleSheet } from 'swiss-react';

export default styleSheet('SectionHeader', {
  Wrapper: {
    _size: ['100%', '31px'],
    _textStyle: 'caption',
    _flex: ['row', 'left', 'center'],
    color: '$sw2',
    borderBottom: '1px solid $sw4',
    paddingTop: '12px',
    paddingBottom: '6px',
    marginBottom: '12px',
    textTransform: 'uppercase',
    userSelect: 'none'
  }
});
