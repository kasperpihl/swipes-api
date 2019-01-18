import { styleSheet } from 'swiss-react';

export default styleSheet('BillingPlanConfirm', {
  Wrapper: {
    boxShadow: '0 1px 20px 3px rgba($sw1  ,0.1)',
    background: '$sw5',
    width: '90%',
    borderRadius: '5px',
    marginLeft: '5%'
  },
  ComposerWrapper: {
    _flex: ['row', 'left', 'top'],
    padding: '18px 24px 18px 30px',
    textAlign: 'left',
    whiteSpace: 'pre-line'
  },
  ActionBar: {
    _flex: ['row', 'right', 'top'],
    padding: '12px 30px',
    borderTop: '1px solid $sw3'
  }
});
