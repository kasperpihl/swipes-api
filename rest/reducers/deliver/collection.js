import { fromJS } from 'immutable'
function init(){
  return fromJS({deliveries: [{collection: []}]});
}
function attach(data, payload){
  data = fromJS({deliveries: [{collection: []}]});
  const lastIndex = data.get('deliveries').size - 1;
  return data.updateIn(['deliveries', lastIndex, 'collection'], (array) => {
    return array.push(payload.url);
  })
}

export {
  init,
  attach
}