import { fromJS, Map } from 'immutable';

const initialState = fromJS({});

export default function main(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case 'rtm.start': {
      let services = Map();
      payload.services.forEach((s) => {
        services = services.set(s.id, fromJS(s));
      });
      return services;
    }

    default:
      return state;
  }
}
