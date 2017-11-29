import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';
import { Draggable } from 'react-beautiful-dnd';
import HOCGoalListItem from 'components/goal-list-item/HOCGoalListItem';
import Wrapper from 'swiss-components/Wrapper';

const _dragEl = document.getElementById('draggable');

class DraggableGoal extends PureComponent {
  renderOrNotPortal(styles, element) {
    if(styles.position === 'fixed') {
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
      ...rest,
    } = this.props;

    return (
      <Draggable draggableId={item} {...rest}>
        {(provided, snapshot) => {
          return (
            <Wrapper autoSize>
              {this.renderOrNotPortal(provided.draggableStyle, (
                <Wrapper
                  autoSize
                  innerRef={provided.innerRef}
                  style={provided.draggableStyle}
                  {...provided.dragHandleProps}
                >
                  <HOCGoalListItem goalId={item} delegate={delegate} />
                </Wrapper>
              ))}
              {provided.placeholder}
            </Wrapper>
          );
        }}
      </Draggable>
    );
  }
}

export default DraggableGoal;
