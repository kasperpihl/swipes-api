const do = (data, action, payload) => {
  switch(action){
    case 'add': {
      // Add validation for payload
      return data.push(payload);
    }
  }
}

export {
  do
}