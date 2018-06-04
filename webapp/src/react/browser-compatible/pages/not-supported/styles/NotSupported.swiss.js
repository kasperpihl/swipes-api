import { styleSheet } from 'swiss-react';

export default styleSheet('NotSupported', {
  Wrapper: {
    padding: '30px 0',
    overflow: 'hidden',
  },

  Illustration: {
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
    _font: ['15px', '18px', '500'],
    padding: '21px 0',
    color: '$blue20',
  },
})
