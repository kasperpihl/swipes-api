import { styleSheet } from 'swiss-react';
import Button from 'src/react/components/button/Button';
import Icon from 'Icon';

export default styleSheet('GoalAttachment', {
  Wrapper: {
    width: '100%',
    paddingLeft: '12px',
    _flex: ['row', 'left', 'center'],
    borderTop: '1px solid $sw3',
    '&:hover': {
      background: '$sw4',
    },
  },
  Title: {
    _truncateString: '',
    _font: ['15px', '24px', 400],
    padding: '12px',
    width: '100%',
  },
  LeftIcon: {
    _el: Icon,
    flex: 'none',
    _size: '24px',
    _svgColor: '$sw1',
  },
  RightButton: {
    _el: Button,
    flex: 'none',
    opacity: 0,
    '.right-button-hover:hover &': {
      opacity: 1,
    }
  }
});