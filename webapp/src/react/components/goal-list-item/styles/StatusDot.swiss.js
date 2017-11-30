import { element } from 'react-swiss';

export default element({
  _size: '12px',
  borderRadius: '50%',
  
  'status=Later': {
    backgroundColor: '$deepBlue30',
  },
  'status=Now': {
    backgroundColor: '$yellowColor',
  },
  'status=Done': {
    backgroundColor: '#12d668'
  },
});
