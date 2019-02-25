import { styleSheet } from 'swiss-react';
import Icon from 'src/react/_components/Icon/Icon';

export default styleSheet('CardHeaderSubtitle', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'center']
  },

  FollowerLabel: {
    _flex: ['row', 'flex-start', 'center'],
    _textStyle: 'caption',
    lineHeight: '24px',
    color: '$sw2'
  },
  Icon: {
    _el: Icon,
    _size: '14px',
    _svgColor: '$sw2',
    margin: '0 2px'
  },
  OrganizationName: {
    _textStyle: 'caption',
    lineHeight: '24px',
    color: '$sw2'
  },

  Actions: {
    _flex: ['row', 'left', 'center'],
    marginLeft: 'auto'
  }
});
