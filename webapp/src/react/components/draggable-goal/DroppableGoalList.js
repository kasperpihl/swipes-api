import React, { PureComponent } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { element } from 'react-swiss';
import DraggableGoal from './DraggableGoal';

const ListContainer = element('div', {
  _size: '100%',
});

class DroppableGoalList extends PureComponent {
  render() {
    const { 
      items,
      children,
      goalProps,
      renderEmptyState,
      ...rest
    } = this.props;

    return (
      <Droppable {...rest}>
        {(provided, snapshot) => (
          <ListContainer
            innerRef={provided.innerRef}
            isDraggingOver={snapshot.isDraggingOver}>
            {items.map((item, index) => (
              <DraggableGoal
                key={item}
                index={index}
                item={item} 
                {...goalProps}
              />
            ))}
            {provided.placeholder}
            {renderEmptyState && renderEmptyState(snapshot.isDraggingOver)}
            {children}
          </ListContainer>
        )}
      </Droppable>
    );
  }
}

export default DroppableGoalList

// const { string } = PropTypes;

DroppableGoalList.propTypes = {};
