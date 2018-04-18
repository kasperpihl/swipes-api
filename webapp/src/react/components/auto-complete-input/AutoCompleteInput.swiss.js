import { styleSheet } from 'react-swiss';

export default styleSheet('AutoCompleteInput', {
  Wrapper: {
    _flex: ['row', 'center', 'center'],
    padding: '10px',
    width: '100%',
    '& .DraftEditor-root': {
      width: '100%',
      height: 'auto',
    },
    '& .public-DraftEditor-content': {
      _font: ['15px', '24px', 300],
    }
  }
});