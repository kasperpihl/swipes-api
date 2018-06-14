import { styleSheet } from 'swiss-react';
import { Link } from 'react-router-dom';

export default styleSheet('NotSupported', {
  Wrapper: {
    padding: '30px 0',
    overflow: 'hidden',
  },

  Illustration: {
    _el: 'img',
    _size: ['50%', 'auto'],
    marginLeft: '50%',
    transform: 'translateX(-50%)',
  },

  EmptySpaceBlock: {
    _size: ['100%', '30px'],
  },

  OptionTitle: {
    display: 'table',

    '&': {
      display: 'table-cell',
      verticalAlign: 'middle',
    },
  },

  StyledLink: {
    _el: 'a',
    color: '$blue',
    paddingRight: '9px',

    '&:hover': {
      textDecoration: 'underline',
    },
  },

  NewLink: {
    _el: Link,
    color: '$blue',
    paddingRight: '9px',

    '&:hover': {
      textDecoration: 'underline',
    },
  },

  DescriptionWrapper: {
    padding: ''
  },

  Description: {
    _font: ['15px', '18px', '300'],
    padding: '21px 0',
    color: '$sw1',
  },
})
