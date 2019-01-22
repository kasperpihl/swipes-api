import { styleSheet } from 'swiss-react';

export default styleSheet('DiscussionComposer', {
  CheckboxWrapper: {
    _flex: ['row', 'left', 'center']
  },
  CheckboxValue: {
    _textStyle: 'body',
    marginLeft: '6px',
    userSelect: 'none'
  }
});
