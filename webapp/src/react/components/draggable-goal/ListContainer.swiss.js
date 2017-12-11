import { element } from 'react-swiss';

const ListContainer = element({
  transition: '.2s ease',

  isDraggingOver: {
    backgroundColor: '$deepBlue10',
    transition: '.2s ease',
  }
});

export default ListContainer;
