import {
  fromJS,
  Map
} from 'immutable';

const init = (step) => {
  const setup = fromJS({
    secondary: [
      {
        type: 'readme',
        data: ''
      }
    ],
    data: {
      initialData: {"entityMap":{},"blocks":[{"key":"9t428","text":"What are we designing for?\n...\nWho are we designing for?\n...\nWhat features do we need?\n...\nWhat’s an example use case?\n...","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":118,"length":1,"style":"BOLD"}],"entityRanges":[],"data":{}}]}
    }
  });

  return step.merge(new Map(setup));
}


export {
  init
}
