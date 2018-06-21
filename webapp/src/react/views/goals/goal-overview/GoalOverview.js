import React, { PureComponent, Fragment } from 'react';
import { withOptimist } from 'react-optimist';
import Dropper from 'src/react/components/draggable-list/Dropper';
import Dragger from 'src/react/components/draggable-list/Dragger';

import GoalsUtil from 'swipes-core-js/classes/goals-util';
import SWView from 'SWView';
import HOCAttachButton from 'src/react/components/attach-button/AttachButton';
import Button from 'src/react/components/button/Button';
import SW from './GoalOverview.swiss';
import StepAdd from '../goal-components/step-add/StepAdd';
import StepItem from '../goal-components/step-item/StepItem';
import GoalHeader from '../goal-components/goal-header/GoalHeader';

import GoalFooter from '../goal-components/goal-footer/GoalFooter';
import GoalAttachment from '../goal-components/goal-attachment/GoalAttachment';

/* global msgGen */
class GoalOverview extends PureComponent {
  constructor(props) {
    super(props);
    props.optimist.identify(props.goal.get('id'));
    this.state = {
      editMode: false,
      showLine: false,
    };
  }
  getHelper() {
    const { goal, myId } = this.props;
    return new GoalsUtil(goal, myId);
  }
  onEdit = () => {
    this.setState({ editMode: !this.state.editMode });
  }
  onScroll = (e) => {
    const { showLine } = this.state;
    const newShowLine = e.target.scrollTop > 0;

    if (showLine !== newShowLine) {
      this.setState({ showLine: newShowLine });
    }
  }
  renderCompletedState() {
    const helper = this.getHelper();
    const lastComplete = helper.getLastActivityByType('goal_completed');

    if (!helper.getIsCompleted() || !lastComplete) {
      return undefined;
    }

    const assigneeIds = helper.getAssignees();
    const firstNames = [];

    assigneeIds.forEach((userId, i) => {
      if (i > 0) {
        firstNames.push(i === assigneeIds.size - 1 ? ' and ' : ', ');
      }

      firstNames.push(msgGen.users.getFirstName(userId));
    })

    const completionText = `${firstNames.join('')} completed this goal`;

    return (
      <SW.CompletedWrapper>
        <SW.GreenIcon icon="Checkmark" />
        <SW.CompletedText>{completionText}</SW.CompletedText>
      </SW.CompletedWrapper>
    );
  }
  renderSteps() {
    const { optimist } = this.props;
    const { editMode } = this.state;
    const helper = this.getHelper();
    const order = optimist.get('step_order', helper.getStepOrder())
    return (
      <Fragment>
        <Dropper droppableId="steps" type="step">
          {order.map((stepId, i) => {
            const step = helper.getStepById(stepId);
            return (
              <Dragger
                draggableId={step.get('id')}
                index={i}
                passHandle
                key={step.get('id')}>
                {(provided, snapshot) => {
                  return (
                  <StepItem
                    goalId={helper.getId()}
                    step={step}
                    completed={!!step.get('completed_at')}
                    number={i + 1}
                    editMode={editMode}
                    dragProvided={provided}
                  />
                  )
                }
                }

              </Dragger>
            )
          }).toArray()}
        </Dropper>
        <StepAdd goalId={helper.getId()} />
      </Fragment>
    );
  }

  renderAttachments() {
    const { optimist } = this.props;
    const helper = this.getHelper();
    const order = optimist.get('attachment_order', helper.getAttachmentOrder());
    return (
      <Dropper droppableId="attachments" type="attachment">
        {order.map((attId, i) => {
          const attachment = helper.getAttachmentById(attId);
          return (
            <Dragger
              draggableId={attId}
              index={i}
              key={attId}>
              <GoalAttachment
                goalId={helper.getId()}
                attachment={attachment}
                id={attId}
              />
            </Dragger>
          )
        }).toArray()}
      </Dropper>
    );
  }
  render() {
    const { goal, viewWidth, delegate, getLoading } = this.props;
    const { editMode, showLine } = this.state;

    if (!goal) {
      return null;
    }

    return (
      <SWView
        header={(
          <GoalHeader
            goal={goal}
            delegate={delegate}
            showLine={showLine}
            dotsLoading={getLoading('dots')}
          />
        )}
        onScroll={this.onScroll}
        footer={<GoalFooter goal={goal} />}>
        <SW.Wrapper>
          <SW.Side>
            <SW.Section>
              STEPS
              {!!this.getHelper().getStepOrder().size && (
                <Button
                  title={editMode ? 'Done' : 'Edit'}
                  onClick={this.onEdit}
                />
              )}
            </SW.Section>
            {this.renderCompletedState()}
            {this.renderSteps()}
          </SW.Side>
          <SW.Side viewWidth={viewWidth} right>
            <SW.Section>
              ATTACHMENTS
              <HOCAttachButton delegate={delegate} />
            </SW.Section>
            {this.renderAttachments()}
          </SW.Side>
        </SW.Wrapper>
      </SWView>
    );
  }
}

export default withOptimist(GoalOverview);
