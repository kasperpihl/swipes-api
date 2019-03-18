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
    marginBottom: 'auto',
    flex: 'none',

    isSingleLine: {
      margin: 'auto 0'
    }
  },
  Center: {
    _flex: ['column', 'left', 'center'],
    flexWrap: 'wrap',
    width: '100%'
  },
  RightSide: {
    _flex: ['row', 'center', 'center'],
    marginLeft: 'auto',
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
    fontWeight: '$medium'
  },
  Message: {
    _el: 'p',
    _textStyle: 'body',
    wordBreak: 'break-word',
    maxWidth: '100%',

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
  },

  Gif: {
    _el: 'img',
    width: '200px'
  }
});
