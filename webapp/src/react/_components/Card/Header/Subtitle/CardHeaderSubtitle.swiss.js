import { styleSheet } from 'swiss-react';
import Icon from 'src/react/_components/Icon/Icon';

export default styleSheet('CardHeaderSubtitle', {
  Wrapper: {
    _size: ['100%', '30px'],
    _flex: ['row', 'left', 'center'],
    userSelect: 'none'
  },

  MemberLabel: {
    _flex: ['row', 'flex-start', 'center'],
    _textStyle: 'body',
    lineHeight: '24px',
    color: '$sw2',

    '&:hover': {
      textDecoration: 'underline'
    }
  },
  Icon: {
    _el: Icon,
    _size: '14px',
    fill: '$sw2',
    margin: '0 2px'
  },
  TeamName: {
    _textStyle: 'body',
    lineHeight: '24px',
    color: '$sw2',
    marginRight: '6px'
  },

  Actions: {
    _flex: ['row', 'left', 'center'],
    marginLeft: 'auto',

    '& > *:not(:last-child)': {
      marginRight: '6px'
    }
  }
});
