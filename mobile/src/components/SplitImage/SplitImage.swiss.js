import { styleSheet } from 'swiss-react';

export default styleSheet('SplitImage', {
  Container: {
    flexDirection: 'row',
    width: '#{size=50}',
    height: '#{size=50}',
    borderRadius: props => props.size || 50 / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  Left: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    'numberOfImages>1': {
      borderRightWidth: 1,
      borderColor: 'white',
      width: '50%',
      height: '100%',
    },
  },
  Right: {
    width: '50%',
    height: '100%',
    overflow: 'hidden',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ImageBox: {
    width: '100%',
    height: '50%',
    'numberOfImages<3': {
      height: '100%',
    },
    backgroundColor: 'red',

    border: {
      borderTopWidth: 1,
      borderColor: 'white',
    },
  },
});
