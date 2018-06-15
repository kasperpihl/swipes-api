import React, { PureComponent } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { styleElement } from 'swiss-react';
import DraggableGoal from './DraggableGoal';
import styles from './DroppableGoalList.swiss';

const ListContainer = styleElement('div', styles.ListContainer);

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
          </ListContainer>
        )}
      </Droppable>
    );
  }
}

export default DroppableGoalList;
