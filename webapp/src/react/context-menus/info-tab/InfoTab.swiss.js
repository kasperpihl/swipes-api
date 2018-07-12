import { styleSheet } from 'swiss-react';
import TextParser from 'components/text-parser/TextParser';
import Icon from 'Icon';

export default styleSheet('InfoTab', {
  Wrapper: {
    _size: ['264px', '100%'],
    backgroundColor: '$sw1',
    borderRadius: '6px',
    overflowY: 'auto',
    padding: '30px 12px',
    paddingTop: '21px',

    '&::selection': {
      color: '$sw2',
      backgroundColor: '#FFD776',
    },
  },

  ActionWrapper: {
    _size: ['100%', 'auto'],
  },

  Action: {
    _size: ['100%', '43px'],
    _flex: ['row', 'left', 'center'],
    borderBottom: '1px solid #333D59',
    transition: '.2s ease',

    '&:hover': {
      backgroundColor: '#333D59',
      transition: '.2s ease',
    },
  },

  ActionIconWrapper: {
    _size: '42px',
    _flex: ['row', 'center', 'center'],

    '&:empty': {
      _size: '0px',
    },
  },

  ActionIcon: {
    _el: Icon,
    _size: '24px',
    _svgColor: '$blue',

    danger: {
      _svgColor: '$red',
    },

    complete: {
      _svgColor: '$green',
    },
  },

  ActionTitle: {
    _size: ['100%', 'auto'],
    _font: ['12px', '18px', '500'],
    color: '$sw5',
  },

  Info: {
    _size: ['100%', 'auto'],
    borderBottom: '1px solid #333D59',
    paddingBottom: '18px',
    paddingTop: '6px',
    marginBottom: '12px',
  },

  InfoRow: {
    _size: ['100%', 'auto'],
    paddingTop: '12px',

    '&:hover .infoAction': {
      opacity: '1',
      transition: '.15s ease',
    },
  },

  InfoTitleWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'center'],
  },

  InfoTitle: {
    _font: ['10px', '18px', '600'],
    color: '$sw5',
    textTransform: 'uppercase',
  },

  InfoAction: {
    _font: ['10px', '18px', '600'],
    color: '$sw2',
    marginLeft: '6px',
    opacity: '0',
    transition: '.15s ease',

    '&:hover': {
      textDecoration: 'underline',
    },
  },

  InfoSVG: {
    _el: Icon,
    _size: '18px',
    _svgColor: '$sw2',
    marginTop: '-3px',
    marginRight: '6px',
  },

  InfoText: {
    _font: ['12px', '18px', '500'],
    color: '$sw2',
    _flex: ['row', 'left', 'center'],
    marginTop: '3px',
  },

  About: {
    _size: ['100%', 'auto'],
  },

  AboutHeader: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'center'],
    paddingBottom: '6px',
  },

  AboutTitle: {
    _font: ['15px', '24px', '500'],
    color: '$sw5',
    paddingLeft: '6px',
  },

  AboutIcon: {
    _el: Icon,
    _size: '24px',
    _svgColor: '$sw5',
  },

  AboutText: {
    _el: TextParser,
    _font: ['12px', '18px', '500'],
    color: '$sw2',
  },
})
