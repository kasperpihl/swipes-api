import { styleSheet } from 'swiss-react';
import { Text } from 'react-native';
import { viewSize } from 'globalStyles';

export default styleSheet('DiscussionListItem', {
  Wrapper: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 15,
    width: viewSize.width - 30,
  },
  LeftSide: {
    paddingVertical: 10,
    paddingRight: 10,
    fontSize: 12,
  },
  Middle: {
    flex: 1,
    width: '100%',
    paddingVertical: 10,
    paddingRight: 10,
  },
  RightSide: {
    flex: 0,
    paddingVertical: 10,
    width: 55,
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
      unread: {
        fontWeight: 'bold',
      },
    },
    alignRight: {
      textAlign: 'right',
    },
    time: {
      unread: {
        color: '$sw1',
        fontWeight: 'bold',
      },
    },
  },
});
