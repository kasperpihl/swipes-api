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
  Attachments: {
    marginTop: '6px',
  },
  StyledMentions: {
    width: '100%',
    borderRadius: '3px',
    border: '1px solid $sw5',
    '&__input,&__highlighter': {
      _font: ['12px !important', '18px', 400],
      color: '$sw1',
      paddingLeft: '0px',
      paddingTop: '9px',
      paddingBottom: '9px',
      paddingRight: '72px',
      transition: 'padding 0.2s ease',
    },
    hasFocus: {
      '&__input,&__highlighter': {
        paddingLeft: '12px',
        paddingRight: '60px',
      },
      border: '1px solid $sw4',
      transition: 'padding 0.2s ease',
    },
    '&__input::-webkit-input-placeholder': {
      fontStyle: 'italic',
      color: '$sw2',
    },
    '&__input:focus': {
      outline: 'none',
    },
  },
  StyledMention: {
    background: '$sw3',
  },
});