import { addMixin } from 'swiss-react';

addMixin('font', function font(props, fontSize, color, lineHeight, fontWeight) {
  if (typeof lineHeight === 'string' && !fontWeight) {
    return {
      fontSize,
      color,
      fontWeight: lineHeight,
      includeFontPadding: false,
    };
  }

  return {
    fontSize,
    color,
    lineHeight,
    fontWeight,
    includeFontPadding: false,
  };
});