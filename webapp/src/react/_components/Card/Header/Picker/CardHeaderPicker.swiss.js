import { styleSheet } from 'swiss-react';
import Icon from '_shared/Icon/Icon';

export default styleSheet('CardHeaderPicker', {
  Wrapper: {
    _flex: ['row', 'left', 'center'],
    height: '24px'
  },
  Text: {
    _el: 'span',
    _textStyle: 'body',
    lineHeight: '24px',
    color: '$sw2',
    '.CardHeaderPicker_Wrapper:hover &': {
      color: '$sw1'
    }
  },
  Icon: {
    _el: Icon,
    _size: '24px',
    fill: '$sw2',
    '.CardHeaderPicker_Wrapper:hover &': {
      fill: '$sw1'
    }
  }
});
