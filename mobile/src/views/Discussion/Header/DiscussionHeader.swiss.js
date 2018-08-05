import { styleSheet } from 'swiss-react';
import { Image } from 'react-native';

export default styleSheet('DiscussionHeader', {
  Wrapper: {
    _flex: 'row',
    _padding: [50, 15, 11, 15],
    _border: [1, '$sw3', 'bottom'],
    alignSelf: 'stretch',
  },
  LeftSide: {
    _size: 54,
    borderRadius: 54 / 2,
  },
  RightSide: {
    _size: 1,
    paddingLeft: 12,
  },
  ProfilePic: {
    _el: Image,
    _size: 54,
    borderRadius: 54 / 2,
  }
});