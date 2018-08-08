import { styleSheet } from 'swiss-react';
import { Text, Image } from 'react-native';

export default styleSheet('AssigneeImage', {
  Image: {
    _el: Image,
    width: '100%',
    height: '100%',
  },
  InitialWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000C2F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Initial: {
    _el: Text,
    fontSize: '10',
    color: 'white',
    fontWeight: 'bold',
    'size>=30': {
      fontSize: '14',
    },
    textTransform: 'uppercase',
  },
});
