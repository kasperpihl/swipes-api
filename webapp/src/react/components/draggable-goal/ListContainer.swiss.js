import { element } from 'react-swiss';

const ListContainer = element({
  minHeight: '300px',
  transition: '.2s ease',

  isDraggingOver: {
    backgroundColor: '$deepBlue10',
    transition: '.2s ease',
  }
});

export default ListContainer;
