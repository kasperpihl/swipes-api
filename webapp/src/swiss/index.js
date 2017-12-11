import { addVariables, addMixin, addGlobals, addPlugin } from 'react-swiss';
import size from './mixins/_size';
import widthSpecifications from './mixins/_widthSpecifications';
import alignAbsolute from './mixins/_align-absolute';
import font from './mixins/_font';
import flex from './mixins/_flex';
import svgColor from './mixins/_svg-color';
import truncateString from './mixins/_truncate-string';
import inlineResponsiveMinWidth from './mixins/_inline-responsive-min-width';
import inlineResponsiveWidth from './mixins/_inline-responsive-width';
import colors from './variables/colors';
import screenSize from './variables/screen-size';
import hexToRGBA from './plugins/hexToRGB'

addVariables(colors, screenSize);

addPlugin('parseKeyValue', keyValue => {
  return {
    key: keyValue.key,
    value: hexToRGBA(keyValue.value),
  }
});

addMixin('size', size);
addMixin('widthSpecifications', widthSpecifications);
addMixin('alignAbsolute', alignAbsolute);
addMixin('font', font);
addMixin('flex', flex);
addMixin('svgColor', svgColor);
addMixin('truncateString', truncateString);
addMixin('inlineResponsiveMinWidth', inlineResponsiveMinWidth);
addMixin('inlineResponsiveWidth', inlineResponsiveWidth);
