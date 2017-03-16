import React, { PureComponent, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';

import { setupDelegate, setupCachedCallback } from 'classes/utils';
import GoalsUtil from 'classes/goals-util';

import SWView from 'SWView';
import HOCAttachments from 'components/attachments/HOCAttachments';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import Section from 'components/section/Section';
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
  }
  componentDidMount() {

  }
  getHelper() {
    const { goal, myId } = this.props;
    return new GoalsUtil(goal, myId);
  }
  renderHeader() {
    const helper = this.getHelper();
    const { goal, loadingState } = this.props;
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
      subtitle = 'Unstarted goal';
      buttons = (
        <Button
          text="Start goal"
          primary
          onClick={this.onStart}
        />
      );
    }
    const title = loadingState.get('title') && loadingState.get('title').loadingLabel;
    return (
      <div className="add-goal__header">
        <HOCHeaderTitle
          title={title || goal.get('title')}
          subtitle={subtitle}
          delegate={this}
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
  renderWays() {
    return [
      <Section title="Or choose a way" key="sect" />,
      <HOCWays
        key="ways"
      />,
    ];
  }
  renderAttachments() {
    const { goal, delegate } = this.props;

    return [
      <Section title="Add attachments" key="sect" />,
      <HOCAttachments
        key="attachments"
        attachments={goal.get('attachments')}
        attachmentOrder={goal.get('attachment_order')}
        targetId={goal.get('id')}
        delegate={delegate}
      />,
    ];
  }
  renderLeft() {
    const { goal, delegate, loadingState } = this.props;
    const helper = this.getHelper();

    let className = 'goal-overview__column';
    className += ` goal-overview__column--${helper.getIsStarted() ? 'left' : 'lonely'}`;
    let contentHtml = this.renderWays();
    if (helper.getIsStarted() || helper.getTotalNumberOfSteps()) {
      contentHtml = this.renderAttachments();
    }

    return (
      <div className={className}>
        <GoalSide goal={goal} delegate={delegate} loadingState={loadingState} />
        {contentHtml}
      </div>
    );
  }
  renderRight() {
    const { goal } = this.props;
    const helper = this.getHelper();
    if (!helper.getIsStarted()) {
      return undefined;
    }
    return (
      <div className="goal-overview__column goal-overview__column--right">
        <Section title="Activity" />
        <HOCHistory goal={goal} />
      </div>
    );
  }
  render() {
    const { goal } = this.props;

    if (!goal) {
      return <div />;
    }

    return (
      <SWView header={this.renderHeader()}>
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
