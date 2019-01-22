import { styleSheet } from 'swiss-react';
import FMSW from 'src/react/_components/FormModal/FormModal';

export default styleSheet('DiscussionComposer', {
  CheckboxWrapper: {
    _flex: ['row', 'left', 'center'],
    paddingTop: '6px',
    paddingBottom: '6px'
  },
  CheckboxValue: {
    _textStyle: 'body',
    marginLeft: '6px',
    userSelect: 'none'
  }
});
