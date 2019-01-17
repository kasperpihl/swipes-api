import { styleSheet } from 'swiss-react';
import Button from 'src/react/components/Button/Button';
import Icon from 'src/react/icons/Icon';

export default styleSheet('OrganizationNew', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row'],
    flexWrap: 'wrap'
  },

  InviteWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start']
  },

  InviteText: {
    _el: 'p',
    _textStyle: 'bodyMedium'
  },

  InputWrapper: {
    _flex: ['row', 'flex-start', 'center']
  },

  EmailInput: {
    _el: 'input',
    _size: ['250px', 'auto'],
    _textStyle: 'body',
    border: '1px solid $sw3',
    padding: '6px'
  },

  SendButton: {
    _el: Button,
    border: '1px solid $sw3',
    borderRadius: '300px',
    overflow: 'hidden',
    marginLeft: '12px'
  },

  PendingInvitesWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-star', 'flex-start'],
    marginTop: '50px',
    marginBottom: '24px',

    showInvites: {
      marginBottom: 0
    }
  },

  SectionTitle: {
    _el: 'h1',
    _textStyle: 'bodyMedium',
    _flex: ['row', 'flex-start', 'center'],
    userSelect: 'none',
    '&:hover': {
      cursor: 'pointer'
    }
  },

  Icon: {
    _el: Icon,
    transition: '.1s ease-in-out all',

    showInvites: {
      transform: 'rotate(90deg)',
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
    _size: ['100%', '40px'],
    _flex: ['row', 'flex-end', 'center'],
    margin: '6px 0',
    borderBottom: '1px solid $sw3'
  },

  InviteEmail: {
    _textStyle: 'body',
    marginRight: 'auto'
  },

  EmailButton: {
    _el: Button,
    border: '1px solid $sw3',
    borderRadius: '300px',
    overflow: 'hidden',
    margin: '0 6px',
    opacity: '0',
    transition: '.25s ease all',

    '.OrganizationNew_InviteItem:hover &': {
      opacity: '1',
      transition: '.25s ease all'
    }
  },

  UsersWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start']
  },

  Button: {
    _el: Button,
    border: '1px solid $sw3',
    borderRadius: '300px',
    overflow: 'hidden',
    marginLeft: '12px'
  }
});
