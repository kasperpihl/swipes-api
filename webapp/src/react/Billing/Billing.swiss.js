import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('Billing', {
  Wrapper: {
    _size: ['calc(100% - 54px)', 'auto'],
    _flex: ['column', 'left', 'center'],
    margin: '0 18px 0 36px'
  },
  PaymentSection: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'left', 'top']
  }
});
