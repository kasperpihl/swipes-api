import { fromJS } from 'immutable';

const testUsers = [
  { id: 'u1', 
    profile: {
      first_name: 'Kasper', 
      last_name: 'Tornoe'
    }
  },
  { id: 'u2', 
    profile: {
      first_name: 'Petar', 
      last_name: 'Dyakov'
    }
  },
  { id: 'u3', 
    profile: {
      first_name: 'Tihomir', 
      last_name: 'Valkanov'
    }
  },
  { id: 'u4', 
    profile: {
      first_name: 'Valentina', 
      last_name: 'Sokolova'
    }
  },
  { id: 'u5', 
    profile: {
      first_name: 'Stefan', 
      last_name: 'Vladimirov'
    }
  },
];

export const convertedUsers = fromJS(testUsers);