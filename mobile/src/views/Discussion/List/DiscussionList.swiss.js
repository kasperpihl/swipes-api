import { styleSheet } from 'swiss-react';
import { Text } from 'react-native';

export default styleSheet('DiscussionList', {
  ListItem: {
    _el: Text,
    padding: '10',
    fontSize: '18',
    height: '44',
  },
});
