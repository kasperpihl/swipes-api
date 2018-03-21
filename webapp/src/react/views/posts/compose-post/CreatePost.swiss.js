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
  ActionBar: {
    _flex: ['row', 'left', 'center'],
    padding: '12px 30px',
    borderTop: '1px solid $sw4',
  },
  Seperator: {
    width: '2px',
    marginLeft: '12px',
    marginRight: '12px',
    height: '24px',
    background: '$sw4',
  },
  AssignSection: {
    _flex: ['row', 'left', 'center'],
  },
  AttachSection: {
    width: '100%',
  },
}