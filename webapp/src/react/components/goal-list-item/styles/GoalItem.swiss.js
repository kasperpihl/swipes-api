import { element } from 'react-swiss';

export default element({
  backgroundColor: 'white',
  borderBottom: '1px solid $deepBlue10',
  minHeight: '60px',
  overflow: 'hidden',
  padding: '12px',
  paddingRight: 0,
  transition: '.2s ease',

  '&:hover': {
    backgroundColor: '$blue5',
    transition: '.2s ease',
  }
});
