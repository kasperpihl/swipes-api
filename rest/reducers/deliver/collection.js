"use strict";

import {
  fromJS,
  Map
} from 'immutable';

const init = (step) => {
  const setup = fromJS({
    secondary: [
      {
        type: 'note',
        data: {"entityMap":{},"blocks":[{"key":"9t428","text":"What are we designing for?\n...\nWho are we designing for?\n...\nWhat features do we need?\n...\nWhat’s an example use case?\n...","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":118,"length":1,"style":"BOLD"}],"entityRanges":[],"data":{}}]}
      },
      {
        type: 'checklist',
        data: []
      }
    ],
    data: {
      iterations: [
        {
          collection: []
        }
      ]
    }
  });

  return step.merge(new Map(setup));
}
const variables = (step) => {
  return {
    'Collection': {},
    'lastIteration': 'Array (string)'
  }
}
const getVariable = (variable) => {
  if(variable === 'collection'){
  }
}


const add = (step, payload, userId) => {
  const lastIterationIndex = step.getIn(['data', 'iterations']).size - 1;
  console.log('step', lastIterationIndex, step.get('data').toJS());
  const ts = new Date();
  return step.updateIn(['data', 'iterations', lastIterationIndex, 'collection'], (array) => {
    console.log('array', array);
    return array.push({
      ts,
      user_id: userId,
      url: payload.url
    });
  })
}

export {
  init,
  add
}
