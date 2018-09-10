import { styleSheet } from 'swiss-react';
import { Text } from 'react-native';
import Icon from 'Icon';

export default styleSheet('DiscussionHeader', {
  Wrapper: {
    _flex: 'row',
    _border: [1, '$sw3', 'bottom'],
    alignSelf: 'stretch',
    isAndroid: {
      paddingTop: 20,
    },
  },
  LeftSide: {
    _size: 54,
    _padding: [7],
  },
  MiddleSide: {
    flex: 1,
    _size: '100%',
    paddingTop: 8,
    paddingRight: 7,
  },
  RightSide: {
    _size: 54,
    _padding: [7],
    _flex: 'center',
  },
  ArrowRight: {
    _el: Icon,
    _size: 24,
  },
  LineOfText: {
    _el: Text,
    fontSize: 12,
    width: '100%',
    color: '$sw2',
    marginTop: 2,
    topic: {
      fontSize: 14,
      color: '$sw1',
    },
  },
});
