import { styleSheet } from 'swiss-react';
import StyledText from 'components/styled-text/StyledText';
import TimeAgo from 'swipes-core-js/components/TimeAgo';
import Icon from 'Icon';

export default styleSheet('PostResult', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: 'row',
    padding: '12px 6px',
    transition: '.2s ease',

    '&:hover': {
      backgroundColor: '$blue5',
      transition: '.2s ease',
    },
  },

  Right: {
    width: '100%',
    height: 'auto',
    paddingLeft: '12px',
  },

  ProfileImage: {
    _size: '36px',
  },

  Image: {
    _el: 'img',
    _size: '36px',
    borderRadius: '3px',
  },

  Initials: {
    _size: '36px',
    _flex: ['row', 'center', 'center'],
    flexShrink: '0',
    backgroundColor: '$sw3',
    borderRadius: '3px',
  },

  Right: {
    _size: ['100%', 'auto'],
    paddingLeft: '12px',
  },

  Header: {
    _size: ['100%', 'auto'],
    _flex: 'row',
  },

  Titles: {
    _size: ['100%', 'auto'],
  },

  Type: {
    _font: ['12px', '18px', '500'],
    flexShrink: '0',
    display: 'inline-table',
    borderRadius: '3px',
    padding: '3px 9px',
    marginLeft: '1px',

    green: {
      backgroundColor: '$green',
      border: '1px solid $green',
    },

    yellow: {
      backgroundColor: '$yellow',
      border: '1px solid $yellow',
    },

    blue: {
      backgroundColor: '$blue',
      border: '1px solid $blue',
    },

    purple: {
      backgroundColor: '#7900ff',
      boder: '1px solid #7900ff',
    },
  },

  Message: {
    _size: ['360px', 'auto'],
    _font: ['15px', '21px'],
    color: '$sw1',
    _clampString: '9',
    marginTop: '12px',
  },

  TitleText: {
    _size: ['100%', 'auto'],
  },

  StyledText: {
    _el: StyledText,
    _font: ['12px', '18px', '500'],
  },

  StyledButton: {
    _font: ['12px', '18px', '500'],
  },

  Subtitle: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'center'],
    _font: ['12px', '18px'],
    color: '$sw3',
    marginTop: '6px',
  },

  SpanLink: {
    _el: 'span',
    color: '$sw2',
  },

  TimeAgo: {
    _el: TimeAgo,
    color: '$sw2',
  },

  Icon: {
    _el: Icon,
    _size: '12px',
    _svgColor: '$sw2',
    marginRight: '3px',
    marginTop: '-2px',
  },
})
