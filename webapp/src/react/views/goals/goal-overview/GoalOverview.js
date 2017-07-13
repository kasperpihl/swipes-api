import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { map } from 'react-immutable-proptypes';
import { setupDelegate, truncateString } from 'swipes-core-js/classes/utils';
import { timeAgo } from 'swipes-core-js/classes/time-utils';
import GoalsUtil from 'swipes-core-js/classes/goals-util';

import SWView from 'SWView';
import HOCAttachments from 'components/attachments/HOCAttachments';
import HOCStepList from 'components/step-list/HOCStepList';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import NotificationWrapper from 'components/notification-wrapper/NotificationWrapper';
import Section from 'components/section/Section';
import HOCDiscussButton from 'components/discuss-button/HOCDiscussButton';
import Button from 'Button';
import Icon from 'Icon';
import './styles/goal-overview.scss';
/* global msgGen */
class GoalOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this);
    this.callDelegate.bindAll('onDiscuss', 'onContext', 'onHandoff', 'onCloseHandoff', 'onBarClick', 'onEditSteps');
  }
  getHelper() {
    const { goal, myId } = this.props;
    return new GoalsUtil(goal, myId);
  }
  getFooterForHandoff(handoff) {
    const { goal, myId } = this.props;
    const helper = this.getHelper();

    const myName = msgGen.users.getName(myId, { disableYou: true });
    /*if (!handoff.toId) {
      return (
        <span>
          Great work {myName}! {"You've"} just completed the goal{' '}
          <b>“{truncateString(goal.get('title'), 19)}”</b>.<br />
          Send a message to the team to congratulate them for the achievement.
        </span>
      );
    }*/
    const step = helper.getStepById(handoff.stepId);
    const title = truncateString(step.get('title'), 19);

    let personString = 'the next person';
    let assignees = helper.getAssigneesForStepId(handoff.stepId);
    assignees = handoff.completed ? helper.getAllAssignees() : assignees;
    if (assignees.size) {
      personString = (
        <b>“{msgGen.users.getNames(assignees, {
          yourself: true,
          number: 3,
        })}”</b>
    );
    }

    if (!handoff.completed) {
      return (
        <span>
          Alright, {myName}. <b>“{title}”</b> needs some changes.<br />
          Send a message to {personString} on what needs to be done.
        </span>
      );
    }
    return (
      <span>
        Great progress, {myName}! You completed <b>“{title}”</b><br />
        Send a message to {personString} on how to take it from here.
      </span>
    );
  }
  renderHeader() {
    const { goal, getLoading, delegate } = this.props;

    const title = getLoading('title').loadingLabel;
    return (
      <div className="add-goal__header">
        <HOCHeaderTitle
          title={title || goal.get('title')}
          subtitle={msgGen.goals.getSubtitle(goal)}
          delegate={delegate}
        >
          <HOCDiscussButton
            filterId={goal.get('id')}
            filterTitle={goal.get('title')}
          />
          <Button
            icon="ThreeDots"
            onClick={this.onContext}
            {...getLoading('dots')}
          />
        </HOCHeaderTitle>
      </div>
    );
  }
  renderAttachments() {
    const { goal, delegate } = this.props;

    return (
      <HOCAttachments
        key="attachments"
        attachments={goal.get('attachments')}
        attachmentOrder={goal.get('attachment_order')}
        targetId={goal.get('id')}
        delegate={delegate}
      />
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
    const { delegate } = this.props;
    const helper = this.getHelper();
    const history = helper.getLastActivity();
    const nf = msgGen.history.getNotificationWrapperForHistory(helper.getId(), history, {
      icon: false,
    });

    return (
      <div className="goal-overview__column goal-overview__column--right">
        <Section title="Attachments">
          {this.renderAttachments()}
        </Section>
      </div>
    );
  }
  renderSuccessFooter(handoff) {
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
  renderFooter() {
    const { handoff, getLoading } = this.props;
    if (handoff) {
      return this.renderSuccessFooter(handoff);
    }
    const helper = this.getHelper();

    let buttonLabel = 'Complete goal';
    let label;
    if (helper.getIsCompleted()) {
      buttonLabel = 'Incomplete goal';
      label = 'This goal is completed';
    }

    return (
      <div className="handoff-bar">
        <div className="handoff-bar__label">
          {label}
        </div>
        <div className="handoff-bar__actions">
          <Button
            text={buttonLabel}
            {...getLoading('completing')}
            primary
            onClick={this.onBarClick}
          />
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
      <SWView header={this.renderHeader()} footer={this.renderFooter()}>
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
