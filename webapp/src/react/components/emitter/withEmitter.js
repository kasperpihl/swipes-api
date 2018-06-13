import React, { PureComponent } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import Context from './getContext';

export default (WrappedComponent) => {

  // Wrapper used to only update based on subscriptions
  class withEmitter extends PureComponent {
    constructor(props) {
      super(props);
      this.tokens = [];
    }
    onAddListener = (eventType, callback) => {
      const token = this.emitter.addListener(eventType, callback);
      this.tokens.push(token);
      return token;
    }
    onOnce = (...args) => {
      const token = this.emitter.once(...args);
      this.tokens.push(token);
      return token;
    }
    onEmit = (...args) => {
      this.emitter.emit(...args);
    }
    componentWillUnmount() {
      this.tokens.forEach((token) => token.remove());
    }
    render() {
      return (
        <Context.Consumer>
          {(emitter) => {
            this.emitter = emitter;
            return (
              <WrappedComponent
                {...this.props}
                addListener={this.onAddListener}
                once={this.onOnce}
                emit={this.onEmit}
              />
            );
          }}
        </Context.Consumer>
        
      )
    }
  }

  hoistNonReactStatics(withEmitter, WrappedComponent);
  return withEmitter;

}
