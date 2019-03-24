import { styleSheet } from 'swiss-react';
import Icon from 'src/react/_components/Icon/Icon';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('DiscussionHeader', {
  Wrapper: {
    _size: ['100%', '74px'],
    _flex: ['column', 'left', 'between'],
    borderBottom: '1px solid $sw3'
  },
  TitleWrapper: {
    paddingTop: '3px',
    width: '100%',
    paddingLeft: '12px',
    _flex: ['column']
  },
  Subtitle: {
    _font: ['12px', '18px', '$regular'],
    color: '$sw2'
  },
  Actions: {
    paddingTop: '6px',
    _flex: ['row', 'right', 'center'],
    flex: 'none',
    '& > *:not(:last-child)': {
      marginRight: '12px'
    }
  },
  ContextWrapper: {
    _flex: ['row', 'right', 'center'],
    padding: '6px 0',
    width: '100%',
    pointerEvents: 'none',
    '!hasContext': {
      marginTop: '-48px'
    }
  },
  FollowerLabel: {
    _flex: ['row', 'flex-start', 'center'],
    _textStyle: 'item',
    lineHeight: '24px',
    color: '$sw2'
  },
  Label: {
    _font: ['12px', '12px', '$medium'],
    color: '$sw2',
    paddingLeft: '6px',
    paddingRight: '12px',
    flex: 'none'
  },
  Icon: {
    _el: Icon,
    _size: '14px',
    fill: '$sw2',
    margin: '0 2px'
  },

  TeamName: {
    _textStyle: 'item',
    lineHeight: '24px',
    color: '$sw2'
  },

  Button: {
    _el: Button
  }
});
