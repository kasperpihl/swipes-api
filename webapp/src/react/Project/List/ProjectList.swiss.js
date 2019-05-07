import { styleSheet } from 'swiss-react';
import EmptyState from 'src/react/_components/EmptyState/EmptyState';

export default styleSheet('ProjectList', {
  Wrapper: {
    _size: '100%',
    paddingLeft: '36px',
    paddingRight: '9px',

    empty: {
      _flex: ['column', 'center', 'center']
    }
  },

  Name: {
    _textStyle: 'caption',
    color: '$sw2',
    textTransform: 'uppercase',
    width: '100px',
    marginLeft: '60px'
  },

  Team: {
    _textStyle: 'caption',
    width: '100px',
    textTransform: 'uppercase',
    color: '$sw2',
    marginLeft: '150px'
  },

  LastOpened: {
    _textStyle: 'caption',
    textTransform: 'uppercase',
    color: '$sw2',
    marginLeft: '150px'
  },

  EmptyState: {
    _el: EmptyState,
    marginBottom: '24px'
  }
});
