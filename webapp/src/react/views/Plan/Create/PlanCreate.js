import React, { PureComponent } from 'react';
import SW from './PlanCreate.swiss';

export default class PlanCreate extends PureComponent {
  static sizes() {
    return [800];
  }
  render() {
    return (
      <SW.Wrapper>
        <SW.SideBySide>
          <SW.Side>Left</SW.Side>
          <SW.Side>Right</SW.Side>
        </SW.SideBySide>
      </SW.Wrapper>
    );
  }
}
