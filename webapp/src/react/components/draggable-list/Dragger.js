import React, { cloneElement } from 'react';
import { createPortal } from 'react-dom';
import { styleElement, styleSheet } from 'react-swiss';
import { Draggable } from 'react-beautiful-dnd';

const styles = styleSheet('Dragger', {
  DefaultWrapper: {
    _size: 'auto',
    background: '$sw5',
  }
});

const DefaultWrapper = styleElement('div', styles.DefaultWrapper).pure();
const _dragEl = document.getElementById('draggable');

export default (props) => {
  const {
    children,
    wrapperEl,
    ...rest,
  } = props;

  const EL = wrapperEl || DefaultWrapper;
  
  return (
    <Draggable {...rest}>
      {(provided, snapshot) => {
        let child = (
          <EL
            innerRef={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}>
            {children}
          </EL>
        )
        if(typeof children === 'function') {
          child = children(provided, snapshot);
        }
    
        if(snapshot.isDragging) {
          return createPortal(child, _dragEl);
        }
        return child;
      }}
    </Draggable>
  );
};