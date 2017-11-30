import { element } from 'react-swiss';

export default element({
  _size: '12px',
  borderRadius: '50%',
  
  'status=Later|later': {
    backgroundColor: '$deepBlue30',
  },
  'status=Now|now': {
    backgroundColor: '$yellowColor',
  },
  'status=Done|done': {
    backgroundColor: '#12d668'
  },
});
