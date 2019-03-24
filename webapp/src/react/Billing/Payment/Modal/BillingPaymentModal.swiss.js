import { styleSheet } from 'swiss-react';

export default styleSheet('BillingPaymentModal', {
  Wrapper: {
    width: '479px'
  },
  ComposerWrapper: {
    _flex: ['row', 'left', 'top'],
    padding: '18px 24px 0px 30px',
    textAlign: 'left',
    whiteSpace: 'pre-line'
  },
  ActionBar: {
    _flex: ['row', 'right', 'top'],
    padding: '12px 30px',
    borderTop: '1px solid $sw3'
  }
});
