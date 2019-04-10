import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';
import EmptyState from '_shared/EmptyState/EmptyState';

export default styleSheet('Profile', {
  Wrapper: {
    _size: ['calc(100% - 18px)', 'auto'],
    _flex: ['row'],
    flexWrap: 'wrap',
    paddingTop: '24px',
    marginLeft: '18px',

    empty: {
      _size: ['calc(100% - 18px)', '100%'],
      _flex: ['column', 'center', 'top'],
    }
  },

  EmptyState: {
    _el: EmptyState,
    marginTop: '96px',
  },

  Button: {
    _el: Button,
    margin: '6px 0',
    marginLeft: 'auto'
  },

  Title: {
    _el: 'h1',
    _textStyle: 'body',
    fontWeight: '800',
    _flex: 'center',
    userSelect: 'none'
  },

  HeaderItem: {
    _textStyle: 'caption',
    color: '$sw2',

    team: {
      width: '150px'
    },

    status: {
      width: '150px'
    },

    members: {}
  },

  ActionBarWrapper: {
    _flex: ['row', 'center', 'center'],
    width: '100%',
    margin: '0 auto',
    position: 'absolute',
    bottom: '0'
  }
});
