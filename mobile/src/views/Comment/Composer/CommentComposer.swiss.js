import { styleSheet } from 'swiss-react';
import { Platform } from 'react-native';
import { viewSize } from 'globalStyles';

export default styleSheet('CommentComposer', {
  Wrapper: {
    _border: [1, '$sw3', 'top'],
    _flex: 'row',
    width: viewSize.width,
    minHeight: 54,
  },
  BackButton: {
    _size: 1,
    _flex: 'center',
    minWidth: 54,
    maxWidth: 54,
  },
  InputWrapper: {
    _size: 1,
    _padding: Platform.select({
      ios: [6, 0],
      android: [6, 0, 6, 12],
    }),
    minHeight: 54,
  },
  InputBorder: {
    _border: [1, '$sw2'],
    _flex: ['row', 'left', 'center'],
    _padding: [12, 0, 12, 18],
    alignSelf: 'stretch',
    minHeight: 42,
    borderRadius: 25,
  },
  Actions: {
    _size: 1,
    maxWidth: 54,
  },
  IconButton: {
    _size: 1,
    _flex: 'center',
    minWidth: 54,
    maxWidth: 54,
    minHeight: 54,
  },
});
