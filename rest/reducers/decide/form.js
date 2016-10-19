import {
  fromJS,
  Map
} from 'immutable';

const init = (step) => {
  const data = fromJS({
  });

  return step.merge(new Map({data: data}));
}


export {
  init
}