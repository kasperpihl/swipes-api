import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { map } from 'react-immutable-proptypes';
import { setupDelegate } from 'react-delegate';
import { truncateString } from 'swipes-core-js/classes/utils';
import GoalsUtil from 'swipes-core-js/classes/goals-util';

import SWView from 'SWView';
import HOCAttachments from 'components/attachments/HOCAttachments';
import HOCStepList from 'components/step-list/HOCStepList';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import Section from 'components/section/Section';
import HOCDiscussButton from 'components/discuss-button/HOCDiscussButton';
import HOCInfoButton from 'components/info-button/HOCInfoButton';
import HOCAssigning from 'components/assigning/HOCAssigning';
import GoalCheckbox from 'components/goal-checkbox/GoalCheckbox';
import Button from 'Button';
import Icon from 'Icon';
import './styles/goal-overview.scss';
/* global msgGen */
class GoalOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onDiscuss', 'onContext', 'onHandoff', 'onCloseHandoff', 'onBarClick', 'onEditSteps');
  }
  getHelper() {
    const { goal, myId } = this.props;
    return new GoalsUtil(goal, myId);
  }
  getFooterForHandoff(handoff) {
    const { goal, myId } = this.props;
    const helper = this.getHelper();

    const myName = msgGen.users.getName(myId, { disableYou: true });

    let personString = 'the next person';
    const assignees = helper.getAllAssignees();
    if (assignees.size) {
      personString = (
        <b>“{msgGen.users.getNames(assignees, {
          excludeId: 'me',
          number: 3,
        })}”</b>
      );
    }

    const step = helper.getStepById(handoff.stepId);
    if(step) {
      const stepTitle = truncateString(step.get('title'), 19);
      if (!handoff.completed) {
        return (
          <span>
            Alright, {myName}. <b>“{stepTitle}”</b> needs some changes.<br />
            Send a message to {personString} on what needs to be done.
          </span>
        );
      }
      return (
        <span>
          Great progress, {myName}! You completed <b>“{stepTitle}”</b><br />
          Send a message to {personString} on how to take it from here.
        </span>
      );
    }

    const goalTitle = truncateString(goal.get('title'), 19);
    if (!handoff.completed) {
      return (
        <span>
          Alright, {myName}. <b>“{goalTitle}”</b> needs some changes.<br />
          Send a message to {personString} on what needs to be done.
        </span>
      );
    }
    return (
      <span>
        You're all done, {myName}! You completed <b>“{goalTitle}”</b><br />
        Send a message to congratulate {personString}.
      </span>
    );

  }
  renderHeader() {
    const { goal, getLoading, delegate, isLoading } = this.props;
    const helper = this.getHelper();
    const title = getLoading('title').loadingLabel;

    return (
      <div className="goal-overview__header">
        <GoalCheckbox
          completed={helper.getIsCompleted()}
          loading={isLoading('completing')}
          delegate={delegate}
        />
        <HOCHeaderTitle
          title={title || goal.get('title')}
          delegate={delegate}
        >
          <HOCAssigning
            assignees={helper.getAssignees()}
            delegate={delegate}
            rounded
            size={32}
            tooltipAlign="bottom"
          />
          <HOCDiscussButton
            context={{
              id: goal.get('id'),
              title: goal.get('title'),
            }}
            relatedFilter={msgGen.goals.getRelatedFilter(goal)}
            taggedUsers={helper.getAllAssigneesButMe().toArray()}
          />
          <HOCInfoButton
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
        <HOCStepList
          ref="stepList"
          goalId={helper.getId()}
          delegate={delegate}
          editMode={editMode}
        />
      </div>
    );
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
  renderSuccessFooter() {
    const { handoff } = this.props;
    if (!handoff) {
      return undefined;
    }
    let icon = 'ActivityCheckmark';
    let iconClass = 'success-footer__icon';

    if (!handoff.completed) {
      iconClass += ' success-footer__icon--backward';
      icon = 'Iteration';
    }

    return (
      <div className="success-footer" key={icon}>
        <div className={iconClass}>
          <Icon icon={icon} className="success-footer__svg" />
        </div>
        <div className="success-footer__content">
          {this.getFooterForHandoff(handoff)}
        </div>
        <div className="success-footer__actions">
          <Button
            primary
            onClick={this.onHandoff}
            text="Write Message"
            className="success-footer__action"
          />
        </div>
        <div className="success-footer__close" onClick={this.onCloseHandoff}>
          <Icon icon="Close" className="success-footer__svg" />
        </div>
      </div>
    );
  }
  render() {
    const { goal } = this.props;

    if (!goal) {
      return <div />;
    }

    return (
      <SWView header={this.renderHeader()} footer={this.renderSuccessFooter()}>
        <div className="goal-overview" data-id={goal.get('id')}>
          {this.renderLeft()}
          {this.renderRight()}
        </div>
      </SWView>
    );
  }
}

export default GoalOverview;

const { string, object, bool, func } = PropTypes;

GoalOverview.propTypes = {
  goal: map,
  handoff: object,
  myId: string,
  editMode: bool,
  isLoading: func,
  getLoading: func,
  delegate: object,
};
