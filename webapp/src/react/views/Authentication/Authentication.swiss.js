import { styleSheet } from 'swiss-react';
import { Link } from 'react-router-dom';
import TabBar from 'src/react/components/tab-bar/TabBar';

export default styleSheet('Authentication', {
  Wrapper: {
    paddingTop: '30px'
  },

  Form: {
    _el: 'form',
    color: '$sw2',

    '@media $max600': {
      marginTop: '30px'
    },

    '@media $max800': {
      marginTop: '30px'
    }
  },
  StyledTabBar: {
    _el: TabBar,
    marginTop: '24px'
  },
  SubmitWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'center'],
    paddingTop: '24px'
  },

  ErrorLabel: {
    _font: ['13px', '18px'],
    color: '$red',
    marginBottom: '15px',
    marginTop: '-30px',
    textAlign: 'center'
  },

  Switch: {
    _font: ['12px', '18px', '500'],
    padding: '0 12px',
    color: '$sw2',

    '& a': {
      _font: ['12px', '18px', '500'],
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline'
      }
    }
  },

  LinkButton: {
    _el: Link,
    color: '$blue'
  },

  Footer: {
    _font: ['12px', '18px', '500'],
    marginTop: '30px',
    textAlign: 'left',
    color: '$sw2',

    '& a': {
      _font: ['12px', '18px', '500'],
      cursor: 'pointer',
      color: '$blue',

      '&:hover': {
        textDecoration: 'underline'
      }
    }
  },

  Input: {
    _el: 'input',
    _size: ['100%', '45px'],
    _font: ['15px', '25px'],
    marginTop: '15px',
    color: '$sw1',
    transition: '.2s ease',
    borderBottom: '1px solid $sw3',
    '&:focus': {
      borderBottom: '1px solid $blue',
      transition: '.2s ease'
    }
  }
});
