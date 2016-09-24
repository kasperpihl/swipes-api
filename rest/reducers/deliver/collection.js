export default function do(data, action){
  if(action.type === 'add'){
    data.collection.push(action.payload);
    return data;
  }
}