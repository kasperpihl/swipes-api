import { styleSheet } from 'swiss-react';

export default styleSheet('AssigneeContextMenu', {
  Wrapper: {
    _size: '100px',
    boxShadow: '0 1px 20px 3px rgba(00,37,82, .1)', // TODO: REMOVE THIS ONCE DONE WITH STYLING, IT'S ONLY FOR TESTING PURPOSES
    
  },

  Text: {
    _el: 'p',
    _font: ['12px', '18px', '400'],
  }
})