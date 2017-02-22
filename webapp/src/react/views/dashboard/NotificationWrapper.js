import React, { Component, PropTypes } from 'react';
import { mapContains, listOf } from 'react-immutable-proptypes';
import Icon from 'Icon';
import { setupDelegate, setupCachedCallback } from 'classes/utils';


import './styles/notification-item';

class NotificationItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.callDelegate = setupDelegate(props.delegate, props.i);
    this.onAttachmentClick = setupCachedCallback(this.callDelegate.bind(null, 'onClickAttachment'));
    this.onClick = this.callDelegate.bind(null, 'onClickTitle');
  }
  renderIcon() {
    const { notification: n } = this.props;

    if (!n.get('icon')) {
      return undefined;
    }

    return (
      <div className="notification__icon">
        <Icon svg={n.get('icon')} className="notification__svg" />
      </div>
    );
  }
  renderMessage() {
    const { notification: n } = this.props;

    if (!n.get('message')) {
      return undefined;
    }

    return (
      <div className="notification__message">&#8220;{n.get('message')}&#8221;</div>
    );
  }
  renderAttachments() {
    const { notification: n } = this.props;
    const attachments = n.get('attachments');

    if (!attachments) {
      return undefined;
    }

    const HTMLAttachments = attachments.map((title, i) => (
      <div onClick={this.onAttachmentClick(i)} className="notif-attachment" key={i}>
        <div className="notif-attachment__icon">
          <Icon svg="Flag" className="notif-attachment__svg" />
        </div>
        <div className="notif-attachment__title">{title}</div>
      </div>
      ));

    return (
      <div className="notification__attachments">
        {HTMLAttachments}
      </div>
    );
  }
  renderContent() {
    const { notification: n } = this.props;

    return (
      <div className="notification__content">
        <div className="notification__subtitle">{n.get('subtitle')}</div>
        <div className="notification__title">{n.get('title')}</div>
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
    const { notification: n } = this.props;
    let className = 'notification';

    if (n.get('seen')) {
      className += ' notification--seen';
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

const { string, object, number, bool } = PropTypes;

NotificationItem.propTypes = {
  i: number,
  delegate: object,
  notification: mapContains({
    seen: bool,
    icon: string,
    subtitle: string,
    title: string,
    message: string,
    attachments: listOf(string),
    timeago: string,
  }),
};
