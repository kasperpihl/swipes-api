import { addMixin } from 'swiss-react';

addMixin('textStyle', (style = 'item') => {
  switch (style) {
    case 'body':
      return {
        _font: ['13px', '15px', '$regular'],
        color: '$dark'
      };
    case 'caption':
      return {
        _font: ['11px', '13px', '$medium'],
        color: '$sw2'
      };
    case 'H3':
      return {
        _font: ['13px', '18px', '$regular'],
        color: '$dark'
      };
    case 'H2':
      return {
        _font: ['16px', '18px', '$regular'],
        color: '$dark'
      };
    case 'H1':
      return {
        _font: ['25px', '36px', '$regular'],
        color: '$dark',
        letterSpacing: '-0.6px'
      };
    case 'title':
      return {
        _font: ['43px', '51px', '$regular'],
        color: '$dark',
        letterSpacing: '-1.5px'
      };
    default:
      console.warn(
        `unsupported textStyle: ${style}. Check _textStyle.js for support`
      );
      return {
        _font: ['13px', '15px', '$regular'],
        color: '$red'
      };
  }
});
