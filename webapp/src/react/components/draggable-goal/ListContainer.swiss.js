import { element } from 'react-swiss';

const ListContainer = element({
  background: 'red',
  isDraggingOver: {
    background: 'green'
  },
  minHeight: '300px',
  width: 250,
});

export default ListContainer;