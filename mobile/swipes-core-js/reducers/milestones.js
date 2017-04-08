import { fromJS, Map } from 'immutable';

const initialState = fromJS({});

export default function main(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case 'init': {
      let milestones = Map();
      payload.milestones.forEach((m) => {
        milestones = milestones.set(m.id, fromJS(m));
      });
      return milestones;
    }

    default:
      return state;
  }
}
