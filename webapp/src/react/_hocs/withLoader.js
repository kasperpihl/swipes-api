import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import useLoader from 'src/react/_hooks/useLoader';

export default WrappedComponent => {
  const WithLoader = props => {
    const loader = useLoader();
    return <WrappedComponent {...props} loader={loader} />;
  };
  hoistNonReactStatics(WithLoader, WrappedComponent);
  return WithLoader;
};
