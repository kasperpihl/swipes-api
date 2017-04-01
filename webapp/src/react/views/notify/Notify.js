import React, { PureComponent, PropTypes } from 'react';
import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'swipes-core-js/classes/utils';
import GoalsUtil from 'swipes-core-js/classes/goals-util';

import SWView from 'SWView';
import Button from 'Button';
import Section from 'components/section/Section';
import HOCAssigning from 'components/assigning/HOCAssigning';
import HOCAttachments from 'components/attachments/HOCAttachments';
import NotificationWrapper from 'components/notification-wrapper/NotificationWrapper';
import HandoffWriteMessage from 'components/handoff-write-message/HandoffWriteMessage';

import './styles/notify.scss';
/* global msgGen */

class Notify extends PureComponent {
  constructor(props) {
    super(props);
    this.callDelegate = setupDelegate(props.delegate);
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
    const { notify } = this.props;
    const title = notify.get('request') ? 'Ask for' : 'Notify';

    return (
      <div className="notify__header">
        <div className="notify__content">
          <div className="notify__title">{title}</div>
          <div className="notify__subtitle">
            {this.renderStatus()}
          </div>
        </div>
        {this.renderAssignees()}

      </div>
    );
  }
  renderAssignees() {
    const { delegate, notify } = this.props;

    return (
      <div className="notify__assignees">
        <HOCAssigning
          delegate={delegate}
          assignees={notify.get('assignees')}
          rounded
        />
      </div>
    );
  }
  renderStatus() {
    return (
      'Notify'
    );
  }
  renderFooter() {
    const { loadingState } = this.props;

    return (
      <div className="notify-footer">
        <div className="notify-footer__status">
          {this.renderStatus()}
        </div>
        <div className="notify-footer__actions">
          <Button
            text="Send notification"
            onClick={this.onSubmit}
            {...loadingState.get('button')}
            primary
          />
        </div>
      </div>
    );
  }
  renderRequest() {
    const { replyObj, goal, delegate } = this.props;
    if (!replyObj) {
      return undefined;
    }
    const title = `Request from ${msgGen.users.getName(replyObj.get('done_by'))}`;
    const notif = msgGen.history.getNotificationWrapperForHistory(goal.get('id'), replyObj, {
      title: false,
      subtitle: false,
      icon: false,
      timeago: false,
    });
    return (
      <Section title={title}>
        <NotificationWrapper
          delegate={delegate}
          notification={notif}
        />
      </Section>
    );
  }
  renderAttachments() {
    const { goal, delegate, notify } = this.props;

    return (
      <Section title="Flag attachments" className="goal-step__attachment">
        <HOCAttachments
          attachments={goal.get('attachments')}
          attachmentOrder={goal.get('attachment_order')}
          flags={notify.get('flags')}
          targetId={goal.get('id')}
          delegate={delegate}
        />
      </Section>
    );
  }
  renderWriteMessage() {
    const { me, notify } = this.props;

    return (
      <Section title="Write message" className="section--show">
        <HandoffWriteMessage
          ref="handoffWriteMessageTextarea"
          onChange={this.onHandoffChange}
          userId={me.get('id')}
          text={notify.get('message')}
        />
      </Section>
    );
  }
  render() {
    return (
      <SWView header={this.renderHeader()} footer={this.renderFooter()}>
        <div className="notify">
          {this.renderRequest()}
          {this.renderWriteMessage()}
          {this.renderAttachments()}
        </div>
      </SWView>
    );
  }
}

export default Notify;

const { object } = PropTypes;

Notify.propTypes = {
  delegate: object.isRequired,
  replyObj: map,
  goal: map,
  me: map,
  loadingState: map,
  notify: map,
};
