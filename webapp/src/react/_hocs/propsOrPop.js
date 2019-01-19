import React, { PureComponent } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import navWrapper from 'src/react/app/view-controller/NavWrapper';

export default (...propsToEnforce) => WrappedComponent => {
  @navWrapper
  class PropsOrPop extends PureComponent {
    componentDidMount() {
      this.checkForPop();
    }
    componentDidUpdate() {
      this.checkForPop();
    }
    checkForPop() {
      if (this.missing && this.props.navPop) {
        this.props.navPop();
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
