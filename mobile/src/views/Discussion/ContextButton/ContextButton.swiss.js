import { styleSheet } from 'swiss-react';
import { Text } from 'react-native';
import Icon from 'Icon';

export default styleSheet('ContextButton', {
  Wrapper: {
    _flex: 'row',
    _border: [1, '$sw3', 'bottom'],
    alignSelf: 'stretch',
  },
  LeftSide: {
    _size: 36,
    _padding: [7],
    _flex: 'center',
  },
  MiddleSide: {
    flex: 1,
    _size: '100%',
    paddingTop: 8,
    paddingRight: 7,
  },
  Icon: {
    _el: Icon,
  },
  LineOfText: {
    _el: Text,
    fontSize: 14,
    width: '100%',
    color: '$blue',
    marginTop: 2,
  },
});
