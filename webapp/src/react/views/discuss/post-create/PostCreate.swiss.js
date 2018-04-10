export default {
  Wrapper: {
    boxShadow: '0 1px 20px 3px rgba($sw1  ,0.1)',
    background: '$sw5',
    width: '90%',
    borderRadius: '5px',
    marginLeft: '5%',
  },
  ComposerWrapper: {
    _flex: ['row', 'left', 'top'],
    padding: '18px 24px 18px 30px',
  },
  TypeWrapper: {
    _size: ['auto', '24px'],
    _flex: ['row', 'right', 'bottom'],
    position: 'absolute',
    top: 0,
    right: 0,
    paddingRight: '24px',
    zIndex: 1,
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
    _flex: ['row', 'left', 'top'],
    padding: '12px 30px',
    borderTop: '1px solid $sw4',
  },
  Seperator: {
    marginTop: '6px',
    width: '2px',
    marginLeft: '12px',
    marginRight: '12px',
    height: '24px',
    background: '$sw4',
  },
  AssignSection: {
    _flex: ['row', 'left', 'center'],
    paddingRight: '6px',
  },
  AttachSection: {
    width: '100%',
    _flex: ['row', 'left', 'top'],
    flexWrap: 'wrap',
    '& > *:not(:last-child)': {
      marginRight: '6px',
    },
    notEmpty: {
      '& > *': {
        marginTop: '3px',
      }
    }
  },
}