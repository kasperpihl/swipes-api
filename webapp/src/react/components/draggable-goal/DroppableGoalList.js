import React, { PureComponent } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import DraggableGoal from './DraggableGoal';
import ListContainer from './ListContainer.swiss';
import Wrapper from 'swiss-components/Wrapper';

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
            expand={Wrapper}
            fill
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
