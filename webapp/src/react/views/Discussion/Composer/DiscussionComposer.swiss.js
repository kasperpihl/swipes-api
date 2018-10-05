import { styleSheet } from 'swiss-react';
import Button from 'src/react/components/button/Button';

export default styleSheet('DiscussionComposer', {
  Wrapper: {
    boxShadow: '0 1px 20px 3px rgba($sw1  ,0.1)',
    background: '$sw5',
    width: '90%',
    borderRadius: '5px',
    marginLeft: '5%',
  },
  ComposerWrapper: {
    _flex: ['row', 'left', 'top'],
    padding: '18px 24px 18px 30px',
  },
  TypeWrapper: {
    _size: ['auto', '24px'],
    _flex: ['row', 'right', 'bottom'],
    position: 'absolute',
    top: 0,
    right: 0,
    paddingRight: '24px',
    zIndex: 1,
  },
  InputWrapper: {
    _flex: ['column', 'center', 'center'],

    width: '100%',
    '& .public-DraftEditor-content': {
      _textStyle: 'body',
      padding: '6px',
      paddingLeft: '12px',
    },
    '& .public-DraftEditorPlaceholder-root': {
      _textStyle: 'bodySubtitle',
      padding: '6px',
      paddingLeft: '12px',
    },
  },

  Input: {
    _el: 'input',
    _flex: ['row', 'center', 'center'],
    _size: ['100%', 'auto'],
    _font: ['15px', '24px', 500],
    color: '$sw1',
    marginLeft: '22px',
    paddingTop: '5px',
    paddingBottom: '8px',
    '&::-webkit-input-placeholder': {
      color: '$sw2',
    },
  },

  ActionBar: {
    _flex: ['row', 'left', 'top'],
    padding: '12px 30px',
    borderTop: '1px solid $sw3',
  },
  Seperator: {
    marginTop: '6px',
    width: '2px',
    marginLeft: '12px',
    marginRight: '12px',
    height: '24px',
    background: '$sw3',
  },
  AssignSection: {
    _flex: ['row', 'center', 'center'],
    minHeight: '36px',
    paddingRight: '6px',
  },
  AttachSection: {
    width: '100%',
    _flex: ['row', 'left', 'top'],
    flexWrap: 'wrap',
    '& > *:not(:last-child)': {
      marginRight: '6px',
    },
    notEmpty: {
      '& > *': {
        marginTop: '3px',
      },
    },
  },
  PostButton: {
    _el: Button,
    marginLeft: 'auto',
  },
});
