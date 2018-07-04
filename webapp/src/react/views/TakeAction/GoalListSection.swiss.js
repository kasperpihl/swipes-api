import { styleSheet } from 'swiss-react';
import Icon from 'Icon';

export default styleSheet('GoalListSection', {
  Wrapper: {
    _size: ['100%', 'auto'],

    '&:not(:first-child)': {
      marginTop: '24px',
    },
  },

  Header: {
    _size: ['100%', '43px'],
    _flex: ['row', 'between', 'center'],
    backgroundColor: '$sw5',
    borderBottom: '1px solid $sw3',
    left: '0',
    top: '0',
    position: 'sticky',
    zIndex: '99',
  },

  Side: {
    _size: ['auto', '100%'],
    _flex: ['row', 'left', 'center'],

    '&:hover .miniSVG': {
      _svgColor: '$blue',
    },

    '&:hover .title': {
      color: '$blue',
    },
  },

  MiniSVG: {
    _el: Icon,
    _size: ['18px'],
    _svgColor: 'black',
  },

  Title: {
    _font: ['13px', '18px', '500'],
    letterSpacing: '.3px',
    paddingLeft: '3px',
    paddingTop: '3px',
    color: 'black',
  },

  Children: {

  },
})
