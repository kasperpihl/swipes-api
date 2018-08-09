import { styleSheet } from 'swiss-react';
import { Text } from 'react-native';

export default styleSheet('Reactions', {
  Container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 42,
    paddingHorizontal: 5,
  },
  LikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  LikeButtonLabel: {
    _el: Text,
    paddingHorizontal: 5,
    fontSize: 12,
    includeFontPadding: false,
    marginTop: 3,
    color: '$sw1',
    iLike: {
      color: '$red',
    },
  },
});
