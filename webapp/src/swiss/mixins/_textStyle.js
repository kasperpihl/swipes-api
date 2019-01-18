import { addMixin } from 'swiss-react';

addMixin('textStyle', (style = 'item') => {
  switch (style) {
    case 'body':
      return {
        _font: ['13px', '19px', 400],
        color: '$sw1'
      };
    case 'bodyMedium':
      return {
        _font: ['15px', '24px', 400],
        color: '$sw1'
      };
    case 'bodyLarge':
      return {
        _font: ['18px', '24px', 400],
        color: '$sw1'
      };
    case 'bodySubtitle':
      return {
        _font: ['13px', '19px', 400],
        color: '$sw2'
      };
    case 'breadcrumb':
      return {
        _font: ['13px', '19px', 400],
        color: '$sw2',
        textTransform: 'uppercase'
      };
    case 'caption':
      return {
        _font: ['11px', '19px', 400],
        color: '$sw2'
      };
    case 'cardTitle':
      return {
        _font: ['27px', '42px', 400],
        color: '$sw1'
      };
    case 'item':
      return {
        _font: ['13px', '19px', 500],
        color: '$sw1'
      };
    case 'tabActive':
      return {
        _font: ['11px', '24px', 500],
        color: '$sw1',
        textTransform: 'uppercase'
      };
    case 'tabInactive':
      return {
        _font: ['11px', '24px', 500],
        color: '$sw3',
        textTransform: 'uppercase'
      };
    case 'labelLight':
      return {
        _font: ['11px', '18px', 500],
        color: '$sw2'
      };
    case 'labelDark':
      return {
        _font: ['11px', '18px', 500],
        color: '$sw1'
      };
    default:
      console.warn(
        `unsupported textStyle: ${style}. Check _textStyle.js for support`
      );
      return {
        _font: ['13px', '18px', 400],
        color: '$red'
      };
  }
});
