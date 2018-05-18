import { styleSheet } from 'react-swiss';

export default styleSheet('PostView', {
  Message: {
    _size: ['100%', 'auto'],
    _font: ['15px', '24px', 300],
    marginTop: '12px',
    maxWidth: '420px',
    color: '$sw1'
  },
  Actions: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'center'],
    paddingLeft: '9px',
    marginTop: '12px',
    borderTop: '1px solid $sw3',
    '& > *:not(:last-child)': {
      marginRight: '10px',
    },
    '& .gl-button': {
      flex: 'none',
    }
  },
  ActionSpacer: {
    width: '100%',
  },
  Attachments: {
    _flex: ['row', 'left', 'center'],
    flexWrap: 'wrap',
    marginTop: '6px',
    '& > *': {
      marginTop: '6px',
    },
    '& > *:not(:last-child)': {
      marginRight: '6px',
    }
  },

});