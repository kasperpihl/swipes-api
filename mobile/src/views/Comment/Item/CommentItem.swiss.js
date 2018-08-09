import { styleSheet } from 'swiss-react';
import { Text } from 'react-native';

export default styleSheet('CommentItem', {
  Wrapper: {
    _size: 1,
  },
  Container: {
    _padding: [5, 10],
    _size: 1,
    flex: 1,
    flexDirection: 'row',
    martinTop: 21,
  },
  MessageWrapper: {
    _padding: [12, 18],
    marginLeft: 10,
    _size: 1,
    backgroundColor: '$sw4',
    borderRadius: 18,
    active: {
      backgroundColor: '$sw2',
    },
  },
  ReactionsWrapper: {
    _flex: ['row', 'center', 'center'],
    flex: 0,
    width: 55,
    marginLeft: 10,
  },
  AttachmentsWrapper: {
    marginTop: 12,
    alignSelf: 'stretch',
  },
  Attachment: {
    _size: 1,
    _flex: ['row', 'left', 'center'],
    _border: [1, '$sw3'],
    marginBottom: 3,
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  AttachmentLabel: {
    _el: Text,
    _size: 1,
    _font: [12, 500],
    color: '$sw1',
    paddingLeft: 12,
  },
  TimestampWrapper: {
    paddingLeft: 54,
  },
  TimestampLabel: {
    _el: Text,
    _font: 12,
    color: '$sw2',
    _padding: [9, 6],
  },
});
