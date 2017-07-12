import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
import './styles/notifications.scss';

class Notifications extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    setupDelegate(this);
    this.callDelegate.bindAll('onMarkAll')
  }
  componentDidMount() {
  }
  renderHeader() {

    return (
      <div></div>
    )
  }
  renderNotifications() {
    const { notifications } = this.props;
  }
  render() {
    let className = 'notifications';

    return (
      <div className={className}>
        <SWView
          header={this.renderHeader()}
        >
          {this.renderNotifications()}
        </SWView>
      </div>
    )
  }
}

export default Notifications
// const { string } = PropTypes;
Notifications.propTypes = {};