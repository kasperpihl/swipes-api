import { styleSheet } from 'swiss-react';
import Icon from 'src/react/icons/Icon';

export default styleSheet('Attachment', {
  ATag: {
    _el: 'a',
    background: '$sw5',
    maxWidth: '200px',
    borderRadius: '12px',
    border: '1px solid $sw3',
    paddingLeft: '6px',
    paddingRight: '12px',
    userSelect: 'none',
    _flex: ['row', 'left', 'center'],
    display: 'inline-flex',
    width: 'auto',
    height: '25px'
  },
  IconContainer: {
    _size: '30px',
    flex: 'none',
    _flex: 'center'
  },
  Icon: {
    _el: Icon,
    _svgColor: '$sw1',
    _size: '24px',
    isContext: {
      _size: '18px',
      hasCloseIcon: {
        _size: '24px'
      }
    },
    '!hasCloseIcon': {
      '.attachment-container:hover &': {
        _svgColor: '$blue'
      }
    },

    hasCloseIcon: {
      '.icon-container:hover &': {
        _svgColor: '$blue'
      }
    }
  },
  Text: {
    _truncateString: '',
    _textStyle: 'body',
    '.attachment-container:hover &': {
      color: '$blue'
    },
    hasCloseIcon: {
      '.icon-container:hover + &': {
        color: '$sw1'
      }
    }
  }
});
