import React, { PureComponent } from 'react';
import ButtonExtended from './Extended/ButtonExtended';
import ButtonStandard from './Standard/ButtonStandard';
import ButtonRounded from './Rounded/ButtonRounded';
import SW from './Button.swiss';

export default class Button extends PureComponent {
  static Rounded = ButtonRounded;
  static Standard = ButtonStandard;
  static Extended = ButtonExtended;
  render() {
    console.warn('Button cannot be rendered. Use .Standard or .Rounded');
    return null;
  }
}
