import { styleSheet } from 'swiss-react';

export default styleSheet('SplitImage', {
  Container: {
    width: '#{size=50}',
    height: '#{size=50}',
    position: 'relative',
  },
  Left: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
    borderRadius: props => props.size || 50 / 2,
    'numberOfImages>1': {
      width: '68%',
      height: '68%',
    },
  },
  Right: {
    width: '68%',
    height: '68%',
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 1,
    borderRadius: props => props.size || 50 / 2,
    overflow: 'hidden',
  },
});
