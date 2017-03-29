import React, { PureComponent, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';

import { setupDelegate } from 'swipes-core-js/classes/utils';
import GoalsUtil from 'swipes-core-js/classes/goals-util';

import SWView from 'SWView';
import HOCAttachments from 'components/attachments/HOCAttachments';
import HOCStepList from 'components/step-list/HOCStepList';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import TabBar from 'components/tab-bar/TabBar';
import Button from 'Button';
import HOCHistory from './HOCHistory';
import './styles/goal-overview.scss';

class GoalOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.callDelegate = setupDelegate(props.delegate);

    this.onAskFor = this.callDelegate.bind(null, 'onAskFor');
    this.onGive = this.callDelegate.bind(null, 'onGive');
    this.onContext = this.callDelegate.bind(null, 'onContext');
    this.onBarClick = this.callDelegate.bind(null, 'onBarClick');
  }
  getHelper() {
    const { goal, myId } = this.props;
    return new GoalsUtil(goal, myId);
  }
  renderHeader() {
    const { goal, loadingState, delegate } = this.props;

    const title = loadingState.get('title') && loadingState.get('title').loadingLabel;
    return (
      <div className="add-goal__header">
        <HOCHeaderTitle
          title={title || goal.get('title')}
          delegate={delegate}
        >
          <Button
            text="Ask for..."
            onClick={this.onAskFor}
          />
          <Button
            text="Notify"
            onClick={this.onGive}
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
    let title = `Steps ${numberOfCompleted}/${totalSteps}`;
    if (!totalSteps) {
      title = 'Add steps';
    }
    return (
      <div className="goal-overview__column goal-overview__column--left">
        <div className="goal-overview__progress">{title}</div>
        <HOCStepList
          steps={helper.getOrderedSteps().map((s) => {
            const l = loadingState.get(s.get('id')) && loadingState.get(s.get('id')).loadingLabel;
            s = s.set('loading', l);
            return s;
          })}
          editable
          addLoading={loadingState.get('add')}
          completed={helper.getNumberOfCompletedSteps()}
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

    const currentStep = helper.getCurrentStep();
    if (currentStep) {
      buttonLabel = `Complete "${currentStep.get('title')}"`;
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

const { string, object, number } = PropTypes;

GoalOverview.propTypes = {
  goal: map,
  tabIndex: number,
  myId: string,
  loadingState: map,
  delegate: object,
};
