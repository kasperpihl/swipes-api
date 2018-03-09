import { addMixin } from 'react-swiss';

addMixin('alignAbsolute', (x=null, y=null) => {
  const res = {
    position: 'absolute',
    left: x || 0,
    top: y || 0,
  };

  if(x === 'center') {
    res.left = '50%';
    res.transform  = 'translate(-50%, 0)';
  }
  if(y === 'center') {
    res.top = '50%';
    res.transform  = 'translate(0, -50%)';
  }

  if (x === 'center' && y === 'center') {
    res.transform = 'translate(-50%, -50%)';
  }
  
  return res;
});
