import { styleSheet } from 'swiss-react';
import { Text } from 'react-native';

export default styleSheet('DiscussionList', {
  Wrapper: {
    flex: '1',
    flexDirection: 'column',
  },
  List: {
    flex: '1',
  },
  LoaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  PlusButtonContainer: {
    width: '44',
    height: '44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  EmptyStateWrapper: {
    flex: '1',
    alignItems: 'center',
    flexDirection: 'column',
  },
  EmptyStateText: {
    _el: Text,
    fontSize: '15',
    lineHeight: '21',
    color: '#7F8596',
    paddingTop: '24',
    textAlign: 'center',
  },
});
