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
    _flex: ['row', 'right', 'center'],
    paddingTop: '24px',
    marginLeft: 'auto',

    '& > a:first-child': {
      marginRight: '6px'
    }
  },

  ErrorLabel: {
    _font: ['13px', '18px'],
    color: '$red',
    marginBottom: '15px',
    marginTop: '-30px',
    textAlign: 'center'
  },

  Switch: {
    _textStyle: 'body',
    _flex: ['row', 'center', 'center'],
    width: '100%',
    padding: '0 12px',
    color: '$sw2',
    position: 'absolute',
    bottom: '36px',
    left: '50%',
    transform: 'translateX(-50%)',

    '& a': {
      _textStyle: 'body',
      color: '$green1',
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
