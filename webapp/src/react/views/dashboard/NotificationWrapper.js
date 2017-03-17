import React, { Component, PropTypes } from 'react';
import { mapContains, list } from 'react-immutable-proptypes';
import HOCAssigning from 'components/assigning/HOCAssigning';
import Icon from 'Icon';
import { setupDelegate, setupCachedCallback, attachmentIconForService } from 'classes/utils';

import './styles/notification-item';

class NotificationItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.callDelegate = setupDelegate(props.delegate, props.i);
    this.onAttachmentClick = setupCachedCallback(this.callDelegate.bind(null, 'onClickAttachment'));
    this.onClick = this.onClick.bind(this);
  }
  onClick(e) {
    const { notification: n } = this.props;
    if (!n.get('noClickTitle')) {
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
        <div className="notification__subtitle">{n.get('subtitle')}</div>
        {this.renderTitle(n.get('title'))}
        {this.renderMessage()}
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
  render() {
    const { notification: n, delegate } = this.props;
    let className = 'notification';

    if (n.get('seenAt')) {
      className += ' notification--seen';
    }

    if (typeof delegate.onClickTitle === 'function' && !n.get('noClickTitle')) {
      className += ' notification--clickable';
    }

    return (
      <div className={className}>
        <div className="notification__top" onClick={this.onClick}>
          {this.renderIcon()}
          {this.renderContent()}
          {this.renderTimestamp()}
        </div>
        <div className="notification__bottom">
          {this.renderAttachments()}
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
    seen: bool,
    icon: string,
    subtitle: string,
    noClickTitle: bool,
    title: oneOfType([array, string]),
    message: string,
    attachments: list,
    timeago: string,
  }),
};
