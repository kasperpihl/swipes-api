import { styleSheet } from 'swiss-react';
import { View, Text } from 'react-native';

export default styleSheet('DiscussionList', {
  Wrapper: {
    _el: View,
    flex: '1',
    flexDirection: 'column',
  },
  List: {
    _el: View,
    flex: '1',
  },
  ListItem: {
    _el: Text,
    padding: '10',
    fontSize: '12',
    height: '44',
  },
  LoaderContainer: {
    _el: View,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
