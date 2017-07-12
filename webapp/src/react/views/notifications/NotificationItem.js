import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
import './styles/notification-item.scss';

class NotificationItem extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    // setupDelegate(this);
    // this.callDelegate.bindAll('onLinkClick')
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="notification-item">

      </div>
    )
  }
}

export default NotificationItem
// const { string } = PropTypes;
NotificationItem.propTypes = {};