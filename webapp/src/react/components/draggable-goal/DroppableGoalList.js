import React, { PureComponent } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import DraggableGoal from './DraggableGoal';
import SW from './DroppableGoalList.swiss';

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
          <SW.ListContainer
            innerRef={provided.innerRef}
            {...provided.droppableProps}>
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
          </SW.ListContainer>
        )}
      </Droppable>
    );
  }
}

export default DroppableGoalList;
