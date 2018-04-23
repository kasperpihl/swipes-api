import { addMixin } from 'react-swiss';

addMixin('svgColor', (getProp, fill=null, stroke=null) => ({
  fill: fill,
  stroke: stroke || fill,
}));
