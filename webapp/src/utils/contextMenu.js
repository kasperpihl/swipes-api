import storeGet from 'swipes-core-js/utils/store/storeGet';
import * as mainActions from 'src/redux/main/mainActions';

export default (component, options, props) => {
  if (
    options &&
    options.target &&
    typeof options.target.getBoundingClientRect === 'function'
  ) {
    options = {
      boundingRect: options.target.getBoundingClientRect(),
      excludeY: true
    };
  }
  const store = storeGet();
  store.dispatch(
    mainActions.contextMenu({
      options,
      component,
      props
    })
  );
};
