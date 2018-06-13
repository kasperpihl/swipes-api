import React, { PureComponent } from 'react';
import Context from './getContext';
import { EventEmitter } from 'fbemitter'

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.emitter = new EventEmitter();
  }
  render() {
    const { children } = this.props;
    return (
      <Context.Provider value={this.emitter}>
        {children}
      </Context.Provider>
    );
  }
}