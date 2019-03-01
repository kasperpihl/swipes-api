import { styleSheet } from 'swiss-react';
import CommentReaction from 'src/react/Comment/Reaction/CommentReaction';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('CommentItem', {
  Wrapper: {
    _flex: ['row', 'left', 'center'],
    width: '100%',
    padding: '6px 0',

    '&:hover': {
      background: '$green3',
      borderRadius: '2px'
    },

    isSingleLine: {
      padding: '0'
    }
  },
  Picture: {
    _size: ['30px', '100%'],
    flex: 'none'
  },
  LeftSide: {
    _flex: ['column', 'center', 'center'],
    width: '54px',
    height: '100%',
    flex: 'none',

    isSingleLine: {
      margin: 'auto 0'
    }
  },
  Center: {
    _flex: ['column', 'left', 'center'],
    width: '100%',
    maxWidth: '450px',
    flexWrap: 'wrap'
  },
  RightSide: {
    _flex: ['row', 'center', 'center'],
    flex: 'none'
  },
  TopWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    width: '100%',
    height: '18px'
  },
  Name: {
    _textStyle: 'body',
    fontWeight: '500'
  },
  Message: {
    _flex: ['row', 'left', 'top'],
    _textStyle: 'body',
    flexWrap: 'wrap',

    isSingleLine: {
      padding: '6px 0'
    }
  },
  Attachments: {
    marginTop: '6px'
  },

  Time: {
    _flex: ['row', 'center', 'bottom'],
    _textStyle: 'caption',
    color: '$sw2',
    marginLeft: '6px'
  },

  TimeStamp: {
    _textStyle: 'caption',
    color: '$sw2',
    opacity: '0',
    visibility: 'hidden',

    '.CommentItem_Wrapper:hover &': {
      opacity: '1',
      visibility: 'visible'
    }
  },

  Button: {
    _el: Button,
    opacity: '0',
    visibility: 'hidden',

    '.CommentItem_Wrapper:hover &': {
      opacity: '1',
      visibility: 'visible'
    }
  },

  Reaction: {
    _el: CommentReaction,
    opacity: '0',
    visibility: 'hidden',

    '.CommentItem_Wrapper:hover &': {
      opacity: '1',
      visibility: 'visible'
    },

    liked: {
      opacity: '1',
      visibility: 'visible'
    }
  }
});
