import { Text } from 'react-native';
import { styleSheet } from 'swiss-react';

export default styleSheet('DiscussionHeader', {
  Wrapper: {
    _flex: 'row',
    _border: [1, '$sw3', 'bottom'],
    alignSelf: 'stretch',
  },
  LeftSide: {
    _size: 54,
    _padding: [7],
  },
  RightSide: {
    flex: 1,
    _size: '100%',
    paddingTop: 8,
    // temp
    paddingRight: 7,
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
