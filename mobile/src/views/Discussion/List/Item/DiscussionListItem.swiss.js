import { styleSheet } from 'swiss-react';
import { View, Text } from 'react-native';

export default styleSheet('DiscussionListItem', {
  Wrapper: {
    _el: View,
    flex: '1',
    flexDirection: 'column',
  },
  LeftSide: {
    _el: View,
    padding: '10',
    fontSize: '12',
  },
  RightSide: {
    _el: Text,
  },
});
