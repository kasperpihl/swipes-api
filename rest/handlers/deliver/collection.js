const do = (data, action) => {
  switch(action.type){
    case 'add': {
      // Add validation for payload
      return data.push(action.payload);
    }
  }
}

export {
  do
}