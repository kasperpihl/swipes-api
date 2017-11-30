import { element } from 'react-swiss';

export default element({
  transition: '.15s ease',

  hidden: {
    opacity: 0,
    pointerEvents: 'none',
    transition: '.15s ease',
  }
})
