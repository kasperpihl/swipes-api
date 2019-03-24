import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';
import Icon from 'src/react/_components/Icon/Icon';

export default styleSheet('TeamPendingInvites', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    marginTop: '24px'
  },

  SectionTitle: {
    _el: 'h1',
    _textStyle: 'body',
    fontWeight: '$medium',
    color: '$sw1',
    _flex: ['row', 'flex-start', 'center'],
    userSelect: 'none',
    '&:hover': {
      cursor: 'pointer'
    }
  },

  IconWrapper: {
    marginTop: '8px'
  },

  Icon: {
    _el: Icon,
    transition: '.1s ease-in-out all',
    transform: 'rotate(90deg)',

    showInvites: {
      transform: 'rotate(270deg)',
      transition: '.1s ease-in-out all'
    },

    '&:hover': {
      cursor: 'pointer'
    }
  },

  PendingInvites: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start']
  },

  InviteItem: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'flex-end', 'center'],
    padding: '12px 0',
    borderBottom: '1px solid $sw3',

    '&:first-child': {
      borderTop: '1px solid $sw3'
    }
  },

  InviteEmail: {
    _textStyle: 'body',
    marginRight: 'auto'
  },

  EmailButton: {
    _el: Button,
    margin: '0 6px'
  }
});
