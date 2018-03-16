export default {
  ComposerWrapper: {
    _flex: ['row', 'left', 'top'],
    padding: '18px 24px 18px 30px',
  },
  AutoCompleteInput: {
    _font: ['15px', '24px', 300],
    color: '$sw1',
    paddingLeft: '21px',
    paddingTop: '3px',
    resize: 'none',
    width: '100%',
    '&::-webkit-input-placeholder': {
      color: '$sw2',
      fontStyle: 'italic',
    },
    '&:focus': {
      outline: 'none',
    },
  },
}