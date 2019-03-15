import storeGet from 'core/utils/store/storeGet';
import * as mainActions from 'src/redux/main/mainActions';

export default (component, options, props) => {
  const store = storeGet();
  if (!component) {
    return store.dispatch(mainActions.contextMenu(null));
  }
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

  store.dispatch(
    mainActions.contextMenu({
      options,
      component,
      props
    })
  );
};
