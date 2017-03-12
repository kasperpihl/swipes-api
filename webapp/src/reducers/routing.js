import { fromJS } from 'immutable';
import {
  LOCATION_CHANGE,
} from 'react-router-redux';

const initialState = fromJS({
  locationBeforeTransitions: null,
});

export default (state = initialState, action) => {
  if (action.type === LOCATION_CHANGE) {
    return state.merge({
      locationBeforeTransitions: JSON.parse(JSON.stringify(action.payload)),
    });
  }

  return state;
};
