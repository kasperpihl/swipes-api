import { addMixin } from 'swiss-react';

addMixin('textStyle', (style = 'item') => {
  switch (style) {
    case 'body':
      return {
        _font: ['13px', '15px', 400],
        color: '$dark'
      };
    case 'caption':
      return {
        _font: ['11px', '13px', 400],
        color: '$sw2'
      };
    case 'H3':
      return {
        _font: ['14px', '18px', 400],
        color: '$dark'
      };
    case 'H2':
      return {
        _font: ['16px', '18px', 400],
        color: '$dark'
      };
    case 'H1':
      return {
        _font: ['25px', '36px', 400],
        color: '$dark',
        letterSpacing: '-0.6px'
      };
    case 'title':
      return {
        _font: ['43px', '51px', 400],
        color: '$dark',
        letterSpacing: '-1.5px'
      };
    default:
      console.warn(
        `unsupported textStyle: ${style}. Check _textStyle.js for support`
      );
      return {
        _font: ['13px', '15px', 400],
        color: '$red'
      };
  }
});
