import { addMixin } from 'react-swiss';

addMixin('font', (getProp, fz=null, lh=null, fw=null) => ({
  fontSize: fz || 'initial',
  lineHeight: isNaN(lh) ? (parseInt(lh) / parseInt(fz)) : '1',
  fontWeight: !fw && !isNaN(lh) ? lh : fw,
}));
