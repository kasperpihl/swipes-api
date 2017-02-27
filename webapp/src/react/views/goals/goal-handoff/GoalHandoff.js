import React, { PureComponent, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import { setupDelegate } from 'classes/utils';
import GoalsUtil from 'classes/goals-util';

import Section from 'components/section/Section';
import HOCAttachments from 'components/attachments/HOCAttachments';
import HandoffWriteMessage from 'components/handoff-write-message/HandoffWriteMessage';

import './styles/goal-handoff.scss';

class GoalHandoff extends PureComponent {
  constructor(props) {
    super(props);
    this.callDelegate = setupDelegate(props.delegate);
    this.onOpenUser = this.callDelegate.bind(null, 'onOpenUser');
    this.onChangeClick = this.callDelegate.bind(null, 'onChangeClick');
    this.onHandoffChange = this.callDelegate.bind(null, 'onHandoffChange');
  }
  componentDidMount() {
    this.refs.handoffWriteMessageTextarea.focus();
  }
  getHelper() {
    const { goal, me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
  }

  renderAttachments() {
    const { goal, delegate, handoff } = this.props;

    return (
      <Section title="Flag attachments" className="goal-step__attachment">
        <HOCAttachments
          attachments={goal.get('attachments')}
          attachmentOrder={goal.get('attachment_order')}
          flags={handoff.get('flags')}
          goalId={goal.get('id')}
          enableFlagging
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
      <div className="goal-handoff">
        {this.renderWriteMessage()}
        {this.renderAttachments()}
      </div>
    );
  }
}

export default GoalHandoff;

const { object } = PropTypes;

GoalHandoff.propTypes = {
  delegate: object.isRequired,
  goal: map,
  me: map,
  handoff: map,
};
