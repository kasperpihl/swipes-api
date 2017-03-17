import React, { PureComponent, PropTypes } from 'react';
import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'classes/utils';
import GoalsUtil from 'classes/goals-util';

import SWView from 'SWView';
import Button from 'Button';
import Section from 'components/section/Section';
import HOCAssigning from 'components/assigning/HOCAssigning';
import HOCAttachments from 'components/attachments/HOCAttachments';
import HandoffWriteMessage from 'components/handoff-write-message/HandoffWriteMessage';
import HandoffStatus from './HandoffStatus';

import './styles/goal-handoff.scss';
/* global msgGen */

class GoalHandoff extends PureComponent {
  constructor(props) {
    super(props);
    this.callDelegate = setupDelegate(props.delegate);
    this.onOpenUser = this.callDelegate.bind(null, 'onOpenUser');
    this.onChangeClick = this.callDelegate.bind(null, 'onChangeClick');
    this.onHandoffChange = this.callDelegate.bind(null, 'onHandoffChange');
    this.onSubmit = this.callDelegate.bind(null, 'onSubmit');
  }
  componentDidMount() {
    this.refs.handoffWriteMessageTextarea.focus();
  }
  getHelper() {
    const { goal, me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
  }

  renderHeader() {
    const { handoff, goal } = this.props;
    const title = msgGen.getButtonTitleFromHandoffAndGoal(handoff, goal);
    return (
      <div className="goal-handoff__header">
        <div className="goal-handoff__content">
          <div className="goal-handoff__title">{title}</div>
          <div className="goal-handoff__subtitle">
            {this.renderStatus()}
          </div>
        </div>
        {this.renderAssignees()}

      </div>
    );
  }
  renderAssignees() {
    const { handoff, assignees, delegate } = this.props;
    if (handoff.get('target') === '_complete') {
      return undefined;
    }

    return (
      <div className="goal-handoff__assignees">
        <HOCAssigning
          delegate={delegate}
          assignees={assignees}
          rounded
        />
      </div>
    );
  }
  renderStatus() {
    const { goal, handoff, assignees } = this.props;

    return (
      <HandoffStatus
        goal={goal}
        assignees={assignees}
        toId={handoff.get('target')}
        onChangeClick={this.onChangeClick}
      />
    );
  }
  renderFooter() {
    const { handoff, goal, loadingState } = this.props;
    const title = msgGen.getButtonTitleFromHandoffAndGoal(handoff, goal);

    return (
      <div className="handoff-footer">
        <div className="handoff-footer__status">
          {this.renderStatus()}
        </div>
        <div className="handoff-footer__actions">
          <Button
            text={title}
            onClick={this.onSubmit}
            {...loadingState.get('button')}
            primary
          />
        </div>
      </div>
    );
  }
  renderAttachments() {
    const { goal, delegate, handoff } = this.props;

    return (
      <Section title="Flag attachments" className="goal-step__attachment">
        <HOCAttachments
          attachments={goal.get('attachments')}
          attachmentOrder={goal.get('attachment_order')}
          flags={handoff.get('flags')}
          targetId={goal.get('id')}
          delegate={delegate}
        />
      </Section>
    );
  }
  renderWriteMessage() {
    const { me, handoff } = this.props;

    return (
      <Section title="Write a message" className="section--show">
        <HandoffWriteMessage
          ref="handoffWriteMessageTextarea"
          onChange={this.onHandoffChange}
          userId={me.get('id')}
          text={handoff.get('message')}
        />
      </Section>
    );
  }
  render() {
    return (
      <SWView header={this.renderHeader()} footer={this.renderFooter()}>
        <div className="goal-handoff">
          {this.renderWriteMessage()}
          {this.renderAttachments()}
        </div>
      </SWView>
    );
  }
}

export default GoalHandoff;

const { object } = PropTypes;

GoalHandoff.propTypes = {
  delegate: object.isRequired,
  goal: map,
  me: map,
  loadingState: map,
  assignees: list,
  handoff: map,
};
