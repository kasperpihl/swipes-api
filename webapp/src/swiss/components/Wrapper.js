import React from 'react';
import { element } from 'react-swiss';
import Flex from './Flex';

export default element({
  _size: ['100%', 'auto'],
  
  width: {
    width: `#{width}px`,
  },
  height: {
    height: `#{height}px`,
  },
  fill: {
    _size: '100%',
  },
  fillHeight: {
    _size: ['auto', '100%'],
  },
  inheritSize: {
    _size: 'inherit',
  },
  inline: {
    _size: 'initial',
    display: 'inline-block',
    margin: 0,
  },
  autoSize: {
    _size: 'auto',
  },
  useScreenSize: {
    _size: ['100vw', 'auto'],

    fill: {
      _size: ['100vw', '100vh']
    },
    fillHeight: {
      _size: ['auto', '100vh']
    },
  }
});
