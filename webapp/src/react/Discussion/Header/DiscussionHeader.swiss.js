import { styleSheet } from 'swiss-react';
import Icon from 'src/react/_components/Icon/Icon';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('DiscussionHeader', {
  Wrapper: {
    _flex: ['row', 'left', 'top'],
    borderBottom: '1px solid $sw3',
    paddingBottom: '12px'
  },
  TitleWrapper: {
    paddingTop: '3px',
    width: '100%',
    paddingLeft: '12px',
    _flex: ['column']
  },
  Subtitle: {
    _font: ['12px', '18px', 400],
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
    borderBottom: '1px solid $sw3',
    padding: '6px 0',
    width: '100%'
  },
  FollowerLabel: {
    _flex: ['row', 'flex-start', 'center'],
    _textStyle: 'item',
    lineHeight: '24px',
    color: '$sw2'
  },
  Label: {
    _font: ['12px', '12px', 500],
    color: '$sw2',
    paddingLeft: '6px',
    paddingRight: '12px',
    flex: 'none'
  },
  Icon: {
    _el: Icon,
    _size: '14px',
    _svgColor: '$sw2',
    margin: '0 2px'
  },

  OrganizationName: {
    _textStyle: 'item',
    lineHeight: '24px',
    color: '$sw2'
  },

  Button: {
    _el: Button.Standard,
    leftAlign: {
      marginRight: 'auto'
    },

    viewAttachments: {
      borderRadius: '2px',
      backgroundColor: 'black',
      color: 'black',

      '& > svg': {
        _svgColor: '$sw5'
      }
    }
  }
});
