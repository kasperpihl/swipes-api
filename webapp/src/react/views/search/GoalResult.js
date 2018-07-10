import React, { PureComponent } from 'react'
import { SwissProvider } from '../../../../node_modules/swiss-react';
import HOCAssigning from 'components/assigning/HOCAssigning';
import SW from './GoalResult.swiss';


class GoalResult extends PureComponent {
  renderAssignees() {
    const { result } = this.props;
    const assignees = msgGen.goals.getAssignees(result.item.id);

    return (
      <SW.Assignees>
        <HOCAssigning assignees={assignees} size={30} />
      </SW.Assignees>
    )
  }
  render() {
    const { result } = this.props;
    let completed = undefined;

    if (result.item.completed_at) {
      completed = true
    }

    return (
      <SwissProvider completed={completed}>
        <SW.Wrapper >
          <SW.Circle>
            <SW.Icon icon="ChecklistCheckmark"/>
          </SW.Circle>
          <SW.Title className="title">{result.item.title}</SW.Title>
          {this.renderAssignees()}
        </SW.Wrapper>
      </SwissProvider>
    )
  }
}

export default GoalResult;
