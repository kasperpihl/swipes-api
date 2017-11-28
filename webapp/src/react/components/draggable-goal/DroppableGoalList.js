import React, { PureComponent } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import DraggableGoal from './DraggableGoal';
import ListContainer from './ListContainer.swiss'

class DroppableGoalList extends PureComponent {
  render() {
    const { 
      items,
      goalProps,
      ...rest
    } = this.props;
    return (
      <Droppable {...rest}>
        {(provided, snapshot) => (
          <ListContainer
            innerRef={provided.innerRef}
            isDraggingOver={snapshot.isDraggingOver}>
            {items.map(item => (
              <DraggableGoal
                key={item}
                item={item} 
                {...goalProps}
              />
            ))}
            {provided.placeholder}
          </ListContainer>
        )}
      </Droppable>
    );
  }
}

export default DroppableGoalList

// const { string } = PropTypes;

DroppableGoalList.propTypes = {};