import { styleSheet } from 'swiss-react';
import { Text } from 'react-native';

export default styleSheet('DiscussionList', {
  ListItem: {
    _el: Text,
    padding: '10',
    fontSize: '12',
    height: '44',
  },
});
