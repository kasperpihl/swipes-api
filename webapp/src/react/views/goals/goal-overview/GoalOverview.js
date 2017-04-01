import React, { PureComponent, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';

import { setupDelegate, truncateString } from 'swipes-core-js/classes/utils';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import { timeAgo } from 'swipes-core-js/classes/time-utils';

import SWView from 'SWView';
import HOCAttachments from 'components/attachments/HOCAttachments';
import HOCStepList from 'components/step-list/HOCStepList';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import NotificationWrapper from 'components/notification-wrapper/NotificationWrapper';
import Section from 'components/section/Section';
import Button from 'Button';
import Icon from 'Icon';
import HOCHistory from './HOCHistory';
import './styles/goal-overview.scss';

class GoalOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.callDelegate = setupDelegate(props.delegate);

    this.onAskFor = this.callDelegate.bind(null, 'onAskFor');
    this.onNotify = this.callDelegate.bind(null, 'onNotify');
    this.onContext = this.callDelegate.bind(null, 'onContext');
    this.onBarClick = this.callDelegate.bind(null, 'onBarClick');
    this.onEditSteps = this.callDelegate.bind(null, 'onEditSteps');
  }
  getHelper() {
    const { goal, myId } = this.props;
    return new GoalsUtil(goal, myId);
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
          subtitle="Started 2 days ago"
          delegate={delegate}
        >
          <Button
            text="Ask for..."
            selected={askSel}
            onClick={this.onAskFor}
          />
          <Button
            text="Notify..."
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
  renderHistory() {
    const { goal, tabIndex } = this.props;
    if (tabIndex !== 1) {
      return undefined;
    }

    return (
      <HOCHistory goal={goal} />
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
      <div className="step-list__edit-button">
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
          goalId={helper.getId()}
          delegate={delegate}
          editMode={editMode}
        />
      </div>
    );
  }
  renderRight() {
    const helper = this.getHelper();

    console.log(helper.getLastActivity().toJS());

    return (
      <div className="goal-overview__column goal-overview__column--right">
        <Section
          title="Latest Activity"
          className="goal-overview__last-activity"
          actions={this.renderActivitySeeAllButton()}
        >
          {/* <NotificationWrapper
            delegate={this}
            notification={lastActivity}
          />*/}
        </Section>
        <Section title="Attachments">
          {this.renderAttachments()}
        </Section>
      </div>
    );
  }
  renderSuccessFooter() {
    return (
      <div className="success-footer">
        <div className="success-footer__icon">
          <Icon icon="ActivityCheckmark" className="success-footer__svg" />
        </div>
        <div className="success-footer__content">
          Awesome, you just completed <span>“3. Design Elements”</span>. Do you want to leave a message to <span>Yana</span>?
        </div>
        <div className="success-footer__actions">
          <Button primary text="Write Message" className="success-footer__action" />
        </div>
        <div className="success-footer__close">
          <Icon icon="Close" className="success-footer__svg" />
        </div>
      </div>
    );
  }
  renderFooter() {
    const helper = this.getHelper();

    return this.renderSuccessFooter();

    /* if (helper.getIsCompleted()) {
      return undefined;
    }
    const { loadingState } = this.props;
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
    );*/
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

const { string, object, number, bool } = PropTypes;

GoalOverview.propTypes = {
  goal: map,
  tabIndex: number,
  myId: string,
  editMode: bool,
  loadingState: map,
  delegate: object,
};
