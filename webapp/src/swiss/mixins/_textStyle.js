import { addMixin } from 'swiss-react';

addMixin('textStyle', (props, style = 'item') => {
  switch (style) {
    case 'body':
      return {
        _font: ['13px', '18px', 400],
        color: '$sw1',
      };
    case 'bodySubtitle':
      return {
        _font: ['13px', '18px', 400],
        color: '$sw2',
      };
    case 'breadcrumb':
      return {
        _font: ['13px', '18px', 400],
        color: '$sw2',
      };
    case 'caption':
      return {
        _font: ['11px', '18px', 400],
        color: '$sw2',
      };
    case 'cardTitle':
      return {
        _font: ['27px', '42px', 500],
        color: '$sw1',
      };
    case 'item':
      return {
        _font: ['13px', '18px', 500],
        color: '$sw1',
      };
    case 'tabActive':
      return {
        _font: ['11px', '24px', 500],
        color: '$sw1',
      };
    case 'tabInactive':
      return {
        _font: ['11px', '24px', 500],
        color: '$sw2',
      };
    default:
      console.warn(
        `unsupported textStyle: ${style}. Check _textStyle.js for support`
      );
      return {
        _font: ['13px', '18px', 500],
        color: '$red',
      };
  }
});
