import * as types from 'constants';

export function load(type, props, callback) {
  // support shorthand for load({title: 'lala'}, () => {})
  // passing without a type :)
  if (typeof props === 'function') {
    callback = props;
    props = null;
  }
  if (typeof type === 'object') {
    props = type;
    type = null;
  }

  return { type: types.LOAD_MODAL, modalType: type, props, callback };
}
export function hide() {
  return { type: types.HIDE_MODAL };
}
