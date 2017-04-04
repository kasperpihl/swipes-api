import React, { PureComponent, PropTypes } from 'react';
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
import Button from 'Button';
import Icon from 'Icon';
import './styles/goal-overview.scss';
/* global msgGen */
class GoalOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.callDelegate = setupDelegate(props.delegate);

    this.onAskFor = this.callDelegate.bind(null, 'onAskFor');
    this.onNotify = this.callDelegate.bind(null, 'onNotify');
    this.onContext = this.callDelegate.bind(null, 'onContext');
    this.onHandoff = this.callDelegate.bind(null, 'onHandoff');
    this.onCloseHandoff = this.callDelegate.bind(null, 'onCloseHandoff');
    this.onBarClick = this.callDelegate.bind(null, 'onBarClick');
    this.onSeeAll = this.callDelegate.bind(null, 'onSeeAll');
    this.onEditSteps = this.callDelegate.bind(null, 'onEditSteps');
  }
  getHelper() {
    const { goal, myId } = this.props;
    return new GoalsUtil(goal, myId);
  }
  getFooterForHandoff(handoff) {
    const { goal, myId } = this.props;
    const helper = this.getHelper();

    const myName = msgGen.users.getName(myId, { disableYou: true });
    if (!handoff.toId) {
      return (
        <span>
          Great work {myName}! {"You've"} just completed the goal{' '}
          <b>“{truncateString(goal.get('title'), 19)}”</b>.<br />
          Send a message to the team to congratulate them for the achievement.
        </span>
      );
    }
    const toStep = helper.getStepById(handoff.toId);
    let personString = 'the next person';
    const assignees = helper.getAssigneesForStepId(handoff.toId);
    if (assignees.size) {
      personString = (
        <b>“{msgGen.users.getNames(assignees, {
          yourself: true,
          number: 3,
        })}”</b>
    );
    }
    if (handoff.backward) {
      const title = truncateString(toStep.get('title'), 19);
      return (
        <span>
          Alright, {myName}. <b>“{title}”</b> needs some changes.<br />
          Send a message to {personString} about what needs to be done.
        </span>
      );
    }
    const titles = helper.getStepTitlesBetweenIds(handoff.fromId, handoff.toId);
    const title = titles.size > 1 ? `${titles.size} steps` : truncateString(titles.get(0), 19);
    return (
      <span>
        Great progress, {myName}! You completed <b>“{title}”</b><br />
        Send a message to {personString} about how to take it from here.
      </span>
    );
  }
  renderHeader() {
    const { goal, loadingState, delegate } = this.props;

    const title = loadingState.get('title') && loadingState.get('title').loadingLabel;
    const askSel = loadingState.get('ask-for-menu') && loadingState.get('ask-for-menu').loading;
    const notifySel = loadingState.get('notify-menu') && loadingState.get('notify-menu').loading;
    return (
      <div className="add-goal__header">
        <HOCHeaderTitle
          title={title || goal.get('title')}
          subtitle={`Started ${timeAgo(goal.get('created_at'))} by ${msgGen.users.getName(goal.get('created_by'))}`}
          delegate={delegate}
        >
          <Button
            text="Ask for..."
            selected={askSel}
            onClick={this.onAskFor}
          />
          <Button
            text="Give..."
            selected={notifySel}
            onClick={this.onNotify}
          />
          <Button
            icon="ThreeDots"
            onClick={this.onContext}
            {...loadingState.get('dots')}
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
    if (!helper.getTotalNumberOfSteps()) {
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
  renderActivitySeeAllButton() {
    return (
      <div className="step-list__edit-button" onClick={this.onSeeAll}>
        See all
      </div>
    );
  }
  renderLeft() {
    const { delegate, editMode } = this.props;
    const helper = this.getHelper();
    const numberOfCompleted = helper.getNumberOfCompletedSteps();
    const totalSteps = helper.getTotalNumberOfSteps();
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
        <Section
          title="Latest Activity"
          className="goal-overview__last-activity"
          actions={this.renderActivitySeeAllButton()}
        >
          <NotificationWrapper
            delegate={delegate}
            notification={nf}
          />
        </Section>
        <Section title="Attachments">
          {this.renderAttachments()}
        </Section>
      </div>
    );
  }
  renderSuccessFooter(handoff) {
    let icon = handoff.toId ? 'ActivityCheckmark' : 'Star';
    let iconClass = 'success-footer__icon';
    if (handoff.backward) {
      iconClass += ' success-footer__icon--backward';
      icon = 'Iteration';
    }
    return (
      <div className="success-footer">
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
    const { handoff, loadingState } = this.props;
    if (handoff) {
      return this.renderSuccessFooter(handoff);
    }
    const helper = this.getHelper();

    if (helper.getIsCompleted()) {
      return undefined;
    }
    let buttonLabel = 'Start goal';

    const currentStep = helper.getCurrentStep();
    if (currentStep) {
      buttonLabel = `Complete "${truncateString(currentStep.get('title'), 19)}"`;
    }
    const nextStep = helper.getNextStep();
    if (!nextStep) {
      buttonLabel = 'Complete goal';
    }
    return (
      <div className="handoff-bar">
        <div className="handoff-bar__label" />
        <div className="handoff-bar__actions">
          <Button
            text={buttonLabel}
            {...loadingState.get('completing')}
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

const { string, object, bool } = PropTypes;

GoalOverview.propTypes = {
  goal: map,
  handoff: object,
  myId: string,
  editMode: bool,
  loadingState: map,
  delegate: object,
};
