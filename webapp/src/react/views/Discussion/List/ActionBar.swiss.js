import {styleSheet } from 'swiss-react';
import Button from 'src/react/components/button/Button';

export default styleSheet('ActionBar', {
  Wrapper: {
    _size: ['100%', '55px'],
    borderTop: '1px solid $sw3',
    position: 'absolute',
    bottom: '0',
    padding: '9px 12px',
    backgroundColor: '$sw5',
  },

  Button: {
    _el: Button,
  }
})
