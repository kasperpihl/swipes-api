import { addMixin } from 'react-swiss';

addMixin('svgColor', (fill=null, stroke=null) => ({
  fill: fill,
  stroke: stroke || fill,
}));
