import React, { PureComponent } from 'react';
import ButtonExtended from './Extended/ButtonExtended';
import ButtonStandard from './Standard/ButtonStandard';
import SW from './Button.swiss';

export default class Button extends PureComponent {
  static Rounded = props => <ButtonStandard {...props} rounded />;
  static Standard = ButtonStandard;
  static Extended = ButtonExtended;
  render() {
    console.warn(
      'Button cannot be rendered. Use .Standard, .Rounded or .Extended'
    );
    return null;
  }
}
