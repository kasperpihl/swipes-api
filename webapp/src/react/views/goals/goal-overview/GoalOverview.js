import React, { PureComponent, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';

import { setupDelegate, setupCachedCallback } from 'classes/utils';
import GoalsUtil from 'classes/goals-util';

import SWView from 'SWView';
import HOCAttachments from 'components/attachments/HOCAttachments';
import HOCStepList from 'components/step-list/HOCStepList';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import TabBar from 'components/tab-bar/TabBar';
import Section from 'components/section/Section';
import Icon from 'Icon';
import HOCWays from 'components/ways/HOCWays';
import Button from 'Button';
import HOCHistory from './HOCHistory';
import GoalSide from './GoalSide';

import './styles/goal-overview.scss';

class GoalOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.callDelegate = setupDelegate(props.delegate);

    this.onNotify = setupCachedCallback(this.callDelegate.bind(null, 'onNotify'));
    this.onContext = this.callDelegate.bind(null, 'onContext');
    this.onStart = this.callDelegate.bind(null, 'onStart');
  }
  getHelper() {
    const { goal, myId } = this.props;
    return new GoalsUtil(goal, myId);
  }
  renderHeader() {
    const helper = this.getHelper();
    const { goal, loadingState, delegate } = this.props;
    let subtitle;
    let buttons = [
      <Button
        key="feedback"
        text="Give Feedback"
        onClick={this.onNotify('_feedback', 'Give Feedback')}
      />,
      <Button
        key="notify"
        text="Notify"
        onClick={this.onNotify('_notify', 'Notify')}
      />,
    ];
    if (!helper.getIsStarted()) {
      buttons = [];
      subtitle = 'Unstarted goal';
      if (!helper.getTotalNumberOfSteps()) {
        subtitle = 'You need to add steps before starting this goal';
      }
    }
    const title = loadingState.get('title') && loadingState.get('title').loadingLabel;
    return (
      <div className="add-goal__header">
        <HOCHeaderTitle
          title={title || goal.get('title')}
          subtitle={subtitle}
          delegate={delegate}
        >
          {buttons}
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
    const { goal, delegate, tabIndex } = this.props;
    if (tabIndex !== 0) {
      return undefined;
    }

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
  renderLeft() {
    const { delegate, loadingState } = this.props;
    const helper = this.getHelper();
    const numberOfCompleted = helper.getNumberOfCompletedSteps();
    const totalSteps = helper.getTotalNumberOfSteps();

    return (
      <div className="goal-overview__column goal-overview__column--left">
        <div className="goal-overview__progress">Steps {numberOfCompleted}/{totalSteps}</div>
        <HOCStepList
          steps={helper.getOrderedSteps().map((s) => {
            const l = loadingState.get(s.get('id')) && loadingState.get(s.get('id')).loadingLabel;
            s = s.set('loading', l);
            return s;
          })}
          editabel={true}
          addLoading={loadingState.get('add')}
          completed={helper.getNumberOfCompletedSteps()}
          noActive={!helper.getIsStarted()}
          delegate={delegate}
        />
      </div>
    );
  }
  renderRight() {
    const { goal, tabIndex, delegate } = this.props;

    return (
      <div className="goal-overview__column goal-overview__column--right">
        <TabBar tabs={['Attachments', 'Activity']} delegate={delegate} activeTab={tabIndex} />
        {this.renderAttachments()}
        {this.renderHistory()}
      </div>
    );
  }
  renderFooter() {
    const helper = this.getHelper();
    let buttonLabel = 'Start goal';
    let statusLabel;
    if (!helper.getTotalNumberOfSteps()) {
      statusLabel = 'Add steps before you start the goal';
    }
    if (helper.getIsStarted()) {
      const currentStep = helper.getCurrentStep();
      if (currentStep) {
        buttonLabel = `Complete "${currentStep.get('title')}"`;
      }
      const nextStep = helper.getNextStep();
      if (!nextStep) {
        buttonLabel = 'Complete goal';
      }
    }
    return (
      <div className="handoff-bar">
        <div className="handoff-bar__label">
          {statusLabel}
        </div>
        <div className="handoff-bar__actions">
          <Button
            text={buttonLabel}
            primary
            disabled={!helper.getTotalNumberOfSteps()}
            onClick={this.onStart}
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
        <div className="goal-overview">
          {this.renderLeft()}
          {this.renderRight()}
        </div>
      </SWView>
    );
  }
}

export default GoalOverview;

const { string, object } = PropTypes;

GoalOverview.propTypes = {
  goal: map,
  myId: string,
  loadingState: map,
  delegate: object,
};
