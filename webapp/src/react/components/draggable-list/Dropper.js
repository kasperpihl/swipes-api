import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import SW from './Dropper.swiss';

export default (props) => {
  const {
    children,
    wrapperEl,
    ...rest,
  } = props;
  const EL = wrapperEl || SW.DefaultWrapper;
  return  (
    <Droppable {...rest}>
      {(provided) => (
        <EL innerRef={provided.innerRef} {...provided.droppableProps}>
          {children}
          {provided.placeholder}
        </EL>
      )}
    </Droppable>
  )
};
