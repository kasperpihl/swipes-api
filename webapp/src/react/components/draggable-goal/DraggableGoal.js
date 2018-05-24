import React, { PureComponent, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { Draggable } from 'react-beautiful-dnd';
import HOCGoalListItem from 'components/goal-list-item/HOCGoalListItem';
import { styleElement } from 'swiss-react';
import styles from './DraggableGoal.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const _dragEl = document.getElementById('draggable');

class DraggableGoal extends PureComponent {
  renderOrNotPortal(usePortal, element) {
    if(usePortal) {
      return createPortal(
        element,
        _dragEl,
      );
    }
    return element;
  }
  render() {
    const {
      item,
      delegate,
      status,
      ...rest,
    } = this.props;

    return (
      <Draggable draggableId={item} {...rest}>
        {(provided, snapshot) => this.renderOrNotPortal(snapshot.isDragging, (
            <Wrapper
              innerRef={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <HOCGoalListItem
                goalId={item}
                delegate={delegate}
                status={status} 
              />
            </Wrapper>
          ))}
      </Draggable>
    );
  }
}

export default DraggableGoal;
