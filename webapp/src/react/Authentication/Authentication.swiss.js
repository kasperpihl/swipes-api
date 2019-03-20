import { styleSheet } from 'swiss-react';
import { Link } from 'react-router-dom';
import TabBar from 'src/react/_components/TabBar/TabBar';

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
    _font: ['12px', '18px', '$medium'],
    padding: '0 12px',
    color: '$sw2',

    '& a': {
      _font: ['12px', '18px', '$medium'],
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
    _font: ['12px', '18px', '$medium'],
    marginTop: '30px',
    textAlign: 'left',
    color: '$sw2',

    '& a': {
      _font: ['12px', '18px', '$medium'],
      cursor: 'pointer',
      color: '$blue',

      '&:hover': {
        textDecoration: 'underline'
      }
    }
  }
});
