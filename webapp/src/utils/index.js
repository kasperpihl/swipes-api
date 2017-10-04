import { resolveArrayValue } from 'css-in-js-utils';
import prefixAll from 'inline-style-prefixer/static';

export function prefix(style) {
  if(!style) return style;
  style = prefixAll(style);
  for (let key in style) {
    if (style.hasOwnProperty(key)) {
      if(Array.isArray(style[key])) {
        style = Object.assign({}, style, { [key]: resolveArrayValue(key, style[key]) });
      }
    }
  }
  return style;
}