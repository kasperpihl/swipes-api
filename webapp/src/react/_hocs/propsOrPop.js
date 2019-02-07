import React, { PureComponent } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import withNav from 'src/react/_hocs/Nav/withNav';

export default (...propsToEnforce) => WrappedComponent => {
  @withNav
  class PropsOrPop extends PureComponent {
    componentDidMount() {
      this.checkForPop();
    }
    componentDidUpdate() {
      this.checkForPop();
    }
    checkForPop() {
      if (this.missing && this.props.nav) {
        this.props.nav.pop();
      }
    }
    render() {
      this.missing = propsToEnforce.find(
        key => typeof this.props[key] === 'undefined'
      );
      if (this.missing) {
        return null;
      }
      return <WrappedComponent {...this.props} />;
    }
  }
  hoistNonReactStatics(PropsOrPop, WrappedComponent);
  return PropsOrPop;
};
