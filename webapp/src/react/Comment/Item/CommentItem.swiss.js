import { styleSheet } from 'swiss-react';
import CommentReaction from 'src/react/Comment/Reaction/CommentReaction';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('CommentItem', {
  Wrapper: {
    _flex: ['column', 'left', 'top'],
    width: '100%',

    '&:hover': {
      background: '$green4',
      borderRadius: '2px'
    }
  },

  CommentWrapper: {
    _flex: ['row', 'left', 'center'],
    width: '100%',
    padding: '6px 0',

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
    paddingRight: '6px',

    isSingleLine: {
      padding: '6px 0'
    },

    '& > a': {
      color: '$blue'
    },

    '& > a:hover': {
      textDecoration: 'underline'
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
    '!isSystem': {
      opacity: '0',
      visibility: 'hidden',
      '.CommentItem_Wrapper:hover &': {
        opacity: '1',
        visibility: 'visible'
      }
    },

    lastReaction: {
      opacity: '1',
      visibility: 'visible',
      marginRight: '3px'
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
  },

  LastReaction: {
    _flex: ['row', 'left', 'center'],
    _size: ['100%', '30px']
  },

  LastReactionMessage: {
    _flex: ['row', 'left', 'center'],
    _textStyle: 'caption',
    color: '$sw2'
  }
});
