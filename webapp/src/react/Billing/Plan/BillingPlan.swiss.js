import { styleSheet } from 'swiss-react';

export default styleSheet('BillingPlan', {
  Wrapper: {
    _size: '100%',
    _flex: ['column', 'left', 'top']
  },

  Text: {
    _textStyle: 'caption'
  },

  ToggleWrapper: {
    _flex: ['row', 'left', 'center'],

    '&:hover > .checkbox': {
      border: '1px solid #05A851'
    }
  },

  TextWrapper: {
    _flex: ['column', 'left', 'top'],
    marginLeft: '18px'
  },

  ToggleLabel: {
    _textStyle: 'H2'
  },

  Subtitle: {
    _textStyle: 'caption',
    color: '$sw2'
  },

  Checkbox: {
    _size: '24px',
    _flex: ['column', 'center', 'center'],
    border: '1px solid $sw3',
    pointerEvents: 'none',
    borderRadius: '12px',
    checked: {
      background: '#05A851',
      border: 'none'
    }
  },

  StatusBox: {
    _size: ['78px', '24px'],
    _textStyle: 'caption',
    _flex: ['column', 'center', 'center'],
    backgroundColor: '$yellow',
    textTransform: 'uppercase',
    color: '$dark',
    borderRadius: '2px',
    margin: '0 auto auto 24px',
    pointerEvents: 'none',
    userSelect: 'none'
  }
});
