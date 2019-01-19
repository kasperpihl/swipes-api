import { styleSheet } from 'swiss-react';
import Button from 'src/react/components/Button/Button';

export default styleSheet('Billing', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'center']
  },
  PaymentSection: {
    _size: ['420px', 'auto'],
    _flex: ['column', 'center']
  }
});
