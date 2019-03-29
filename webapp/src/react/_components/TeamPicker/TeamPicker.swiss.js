import { styleSheet } from 'swiss-react';

export default styleSheet('TeamPicker', {
  Wrapper: {
    _flex: ['column', 'left', 'top'],
    width: '100%'
  },
  InputWrapper: {
    _flex: ['row', 'left', 'center'],
    marginRight: '12px'
  },
  TeamsWrapper: {
    _flex: ['row', 'left', 'center'],
    flexWrap: 'wrap'
  },
  Label: {
    _el: 'span',
    _textStyle: 'body',
    marginLeft: '6px'
  },

  TeamInput: {
    width: '100%'
  },

  Tooltip: {
    _size: ['190px', 'auto'],
    _textStyle: 'body',
    background: '$base',
    boxShadow: '$popupShadow',
    fontWeight: '$medium',
    position: 'absolute',
    top: '0',
    right: '-150px',
    opacity: '0',
    visibility: 'hidden',
    pointerEvents: 'none',
    userSelect: 'none',
    zIndex: '999',
    padding: '6px 12px',
    borderRadius: '2px',

    show: {
      opacity: '1',
      visibility: 'visible'
    }
  }
});
