import { styleSheet } from 'swiss-react';
import Icon from 'Icon';

export default styleSheet('Attachment', {
  ATag: {
    _el: 'a',
    background: '$sw4',
    maxWidth: '200px',
    borderRadius: '15px',
    paddingLeft: '6px',
    paddingRight: '12px',
    userSelect: 'none',
    _flex: ['row', 'left', 'center'],
    display: 'inline-flex',
    width: 'auto',
    '&:hover': {
      opacity: .7,
    }
  },
  IconContainer: {
    _size: '30px',
    flex: 'none',
    _flex: 'center',
  },
  Icon: {
    _el: Icon,
    _svgColor: '$sw2',
    _size: '24px',
    isContext: {
      _size: '18px',
      hasCloseIcon: {
        _size: '24px',
      }
    },
    '!hasCloseIcon': {
      '.attachment-container:hover &': {
        _svgColor: '$blue',
      }
    },

    hasCloseIcon: {
      '.icon-container:hover &': {
        _svgColor: '$blue',
      }
    }
  },
  Text: {
    _truncateString: '',
    color: '$sw2',
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: 400,
    '.attachment-container:hover &': {
      color: '$blue',
    },
    hasCloseIcon: {
      '.icon-container:hover + &': {
        color: '$sw2',
      }
    }
  }
});
