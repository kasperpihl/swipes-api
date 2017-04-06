import React, { Component, PropTypes } from 'react';
import { mapContains, list } from 'react-immutable-proptypes';
import HOCAssigning from 'components/assigning/HOCAssigning';
import Icon from 'Icon';
import Button from 'Button';
import { setupDelegate, setupCachedCallback, attachmentIconForService } from 'swipes-core-js/classes/utils';

import './styles/notification-item';

class NotificationItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.callDelegate = setupDelegate(props.delegate, props.i);
    this.onAttachmentClick = setupCachedCallback(this.callDelegate.bind(null, 'onClickAttachment'));
    this.onReply = this.callDelegate.bind(null, 'onReply');
    this.onClick = this.onClick.bind(this);
  }
  onClick(e) {
    const { notification: n } = this.props;
    const selection = window.getSelection();

    if (selection.toString().length === 0 && !n.get('noClickTitle')) {
      this.callDelegate('onClickTitle', e);
    }
  }
  renderIcon() {
    const { notification: n } = this.props;

    if (!n.get('icon')) {
      return undefined;
    }

    return (
      <div className="notification__image">
        <div className="notification__icon">
          <Icon icon={n.get('icon')} className="notification__svg" />
        </div>
        <div className="notification__assigning">
          <HOCAssigning assignees={[n.get('userId')]} rounded tooltipAlign="left" />
        </div>
      </div>
    );
  }
  renderMessage() {
    const { notification: n } = this.props;

    if (!n.get('message')) {
      return undefined;
    }

    return (
      <div className="notification__message">&bdquo;{n.get('message')}&ldquo;</div>
    );
  }
  renderAttachments() {
    const { notification: n } = this.props;
    const attachments = n.get('attachments');

    if (!attachments) {
      return undefined;
    }

    const HTMLAttachments = attachments.map((att, i) => (
      <div onClick={this.onAttachmentClick(i)} className="notif-attachment" key={i}>
        <div className="notif-attachment__icon">
          <Icon
            icon={attachmentIconForService(att.getIn(['link', 'service']) || att)}
            className="notif-attachment__svg"
          />
        </div>
        <div className="notif-attachment__title">{att.get('title')}</div>
      </div>
    ));

    return (
      <div className="notification__attachments">
        {HTMLAttachments}
      </div>
    );
  }
  renderTitle(title) {
    if (!title) {
      return undefined;
    }

    if (!Array.isArray(title)) {
      title = [title];
    }
    return title.map((t, i) => (
      <div key={i} className="notification__title">{t}</div>
    ));
  }
  renderContent() {
    const { notification: n } = this.props;

    return (
      <div className="notification__content">
        {this.renderTitle(n.get('title'))}
        <div className="notification__subtitle">{n.get('subtitle')}</div>
        {this.renderMessage()}
      </div>
    );
  }
  renderRight() {
    return (
      <div className="notification__right">
        {this.renderTimestamp()}
        {this.renderReplyAction()}
      </div>
    );
  }
  renderTimestamp() {
    const { notification: n } = this.props;

    if (!n.get('timeago')) {
      return undefined;
    }

    return <div className="notification__timeago">{n.get('timeago')}</div>;
  }
  renderReplyAction() {
    const { notification: n } = this.props;

    if (!n.get('reply')) {
      return undefined;
    }
    if (n.get('reply') === 'replied') {
      return 'Replied';
    }
    return <Button text="Reply" primary small onClick={this.onReply} />;
  }
  render() {
    const { notification: n, delegate } = this.props;
    let className = 'notification';

    if (n.get('unseen')) {
      className += ' notification--unseen';
    }

    if (typeof delegate.onClickTitle === 'function' && !n.get('noClickTitle')) {
      className += ' notification--clickable';
    }

    if (!n.get('icon')) {
      className += ' notification--small';
    }

    return (
      <div className={className}>
        <div className="notification__column notification__column--left">
          <div className="notification__top" onClick={this.onClick}>
            {this.renderIcon()}
            {this.renderContent()}
          </div>
          <div className="notification__bottom">
            {this.renderAttachments()}
          </div>
        </div>

        <div className="notification__column notification__column--right">
          {this.renderRight()}
        </div>
      </div>
    );
  }
}

export default NotificationItem;

const { string, object, number, bool, oneOfType, array } = PropTypes;

NotificationItem.propTypes = {
  i: number,
  delegate: object,
  notification: mapContains({
    icon: string,
    subtitle: string,
    noClickTitle: bool,
    title: oneOfType([array, string]),
    message: string,
    attachments: list,
    timeago: string,
  }),
};
