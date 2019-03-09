import storeGet from 'core/utils/store/storeGet';
import * as types from 'src/redux/constants';

export default function successGradient(color) {
  const store = storeGet();
  store.dispatch({ type: types.SUCCESS_GRADIENT, payload: { color } });
}
