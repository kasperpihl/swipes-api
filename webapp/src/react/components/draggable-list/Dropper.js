import React from 'react';
import { styleElement, styleSheet } from 'swiss-react';
import { Droppable } from 'react-beautiful-dnd';

const styles = styleSheet('Dropper', {
  DefaultWrapper: {
    _size: '100%',
  }
});

const DefaultWrapper = styleElement('div', styles.DefaultWrapper).pure();

export default (props) => {
  const {
    children,
    wrapperEl,
    ...rest,
  } = props;
  const EL = wrapperEl || DefaultWrapper;
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