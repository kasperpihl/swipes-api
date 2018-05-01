import React, { PureComponent } from 'react';
import { styleElement } from 'react-swiss';
import { setupDelegate } from 'react-delegate';

import Dropper from 'src/react/components/draggable-list/Dropper';
import Dragger from 'src/react/components/draggable-list/Dragger';

import GoalsUtil from 'swipes-core-js/classes/goals-util';
import SWView from 'SWView';
import HOCAttachments from 'components/attachments/HOCAttachments';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import Section from 'components/section/Section';
import HOCDiscussButton from 'components/discuss-button/HOCDiscussButton';
import InfoButton from 'components/info-button/InfoButton';
import HOCAssigning from 'src/react/components/assigning/HOCAssigning';
import Button from 'src/react/components/button/Button2';
import './styles/goal-overview.scss';
import styles from './GoalOverview.swiss';
import StepItem from '../goal-components/step-item/StepItem';

const Footer = styleElement('div', styles.Footer);
const StepList = styleElement('div', styles.StepList);

/* global msgGen */
class GoalOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onScroll', 'onCompleteGoal', 'onIncompleteGoal');
  }
  getHelper() {
    const { goal, myId } = this.props;
    return new GoalsUtil(goal, myId);
  }
  renderHeader() {
    const { goal, getLoading, delegate, isLoading, showLine } = this.props;
    const helper = this.getHelper();
    const title = getLoading('title').loading;

    return (
      <div className={`goal-overview__header ${showLine ? 'goal-overview__header--border' : ''}`}>
        <HOCHeaderTitle
          title={title || goal.get('title')}
          delegate={delegate}
        >
          <HOCAssigning
            assignees={helper.getAssignees()}
            delegate={delegate}
            rounded
            key={helper.getAssignees().size ? 'assignees' : 'assign'}
            size={30}
            tooltipAlign="bottom"
          />
          <HOCDiscussButton
            context={{
              id: goal.get('id'),
              title: goal.get('title'),
            }}
            relatedFilter={msgGen.goals.getRelatedFilter(goal)}
            taggedUsers={helper.getAssigneesButMe().toArray()}
          />
          <InfoButton
            delegate={delegate}
            {...getLoading('dots')}
          />
        </HOCHeaderTitle>
      </div>
    );
  }
  renderStepListEditButton() {
    const helper = this.getHelper();
    if (!helper.getNumberOfSteps()) {
      return undefined;
    }
    const { editMode } = this.props;
    let title = 'Edit';
    let className = 'step-list__edit-button';

    if (editMode) {
      title = 'Done';
      className += ' step-list__edit-button--done';
    }

    return (
      <div className={className} onClick={this.onEditSteps}>
        {title}
      </div>
    );
  }
  renderLeft() {
    const { delegate, editMode } = this.props;
    const helper = this.getHelper();
    const numberOfCompleted = helper.getNumberOfCompletedSteps();
    const totalSteps = helper.getNumberOfSteps();
    let title = `Steps ${numberOfCompleted}/${totalSteps}`;
    if (!totalSteps) {
      title = 'Add steps';
    }
    return (
      <div className="goal-overview__column goal-overview__column--left">
        <Section title={title} actions={this.renderStepListEditButton()} />
        {this.renderSteps()}
      </div>
    );
  }
  renderSteps() {
    const helper = this.getHelper();

    return (
      <Dropper droppableId="steps">
        {helper.getOrderedSteps().map((step, i) => (
          <Dragger draggableId={step.get('id')} index={i} key={step.get('id')}>
            <StepItem goalId={helper.getId()} step={step} number={i + 1} />
          </Dragger>
        )).toArray()}
      </Dropper>
    )
  }
  renderRight() {
    const { delegate, goal } = this.props;

    return (
      <div className="goal-overview__column goal-overview__column--right">
        <Section title="Attachments">
          <HOCAttachments
            key="attachments"
            attachments={goal.get('attachments')}
            attachmentOrder={goal.get('attachment_order')}
            targetId={goal.get('id')}
            delegate={delegate}
          />
        </Section>
      </div>
    );
  }
  renderFooter() {
    const { goal, getLoading, delegate } = this.props;
    const isComplete = this.getHelper().getIsCompleted();

    return (
      <Footer>
        <Button
          icon={isComplete ? 'Iteration' : 'Checkmark'}
          sideLabel={isComplete ? 'Incomplete goal' : 'Complete goal'}
          {...getLoading('completing')}
          onClick={isComplete ? this.onIncompleteGoal : this.onCompleteGoal}
        />
      </Footer>
    )
  }
  render() {
    const { goal } = this.props;

    if (!goal) {
      return null;
    }

    return (
      <SWView header={this.renderHeader()} onScroll={this.onScroll} footer={this.renderFooter()}>
        <div className="goal-overview" data-id={goal.get('id')}>
          {this.renderLeft()}
          {this.renderRight()}
        </div>
      </SWView>
    );
  }
}

export default GoalOverview;