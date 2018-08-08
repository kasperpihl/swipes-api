import { styleSheet } from 'swiss-react';
import { Text } from 'react-native';

export default styleSheet('DiscussionListItem', {
  Wrapper: {
    flex: '1',
    flexDirection: 'column',
  },
  LeftSide: {
    padding: '10',
    fontSize: '12',
  },
  RightSide: {
    _el: Text,
  },
});
