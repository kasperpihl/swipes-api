import { styleSheet } from 'react-swiss';

export default styleSheet({
  Wrapper: {
    boxShadow: '0 1px 20px 3px rgba($sw1  ,0.1)',
    background: '$sw5',
    width: '479px',
    borderRadius: '5px',
    margin: 'auto',
  },
  ComposerWrapper: {
    _flex: ['row', 'left', 'top'],
    padding: '18px 24px 0px 30px',
    textAlign: 'left',
    whiteSpace: 'pre-line',
  },
  ActionBar: {
    _flex: ['row', 'right', 'top'],
    padding: '12px 30px',
    borderTop: '1px solid $sw3',
  },
});