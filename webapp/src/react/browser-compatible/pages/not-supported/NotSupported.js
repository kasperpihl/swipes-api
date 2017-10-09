import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll } from 'swipes-core-js/classes/utils';
import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';
// import Button from 'Button';
import { Link } from 'react-router-dom';
import Icon from 'Icon';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
import CompatibleSubHeader from 'compatible/components/subheader/CompatibleSubHeader';
import DownloadForDevice from 'compatible/components/download-for-device/DownloadForDevice';
import HOCLogoutButton from 'compatible/components/logout-button/HOCLogoutButton';
import './styles/not-supported.scss';

class NotSupported extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onLeaveOrg');
    // this.callDelegate.bindAll('onLala');
  }
  componentDidMount() {
  }
  renderActions() {

    return (
      <div className="not-supported__actions">
        <div className="not-supported__option-wrapper">
          <div className="not-supported__desc">
            Invite more people to your org, which by the way is Swipes
          </div>
          <div className="not-supported__option-title">
            <Link to="/invite" className="not-supported__link">Invite peeps</Link>
          </div>
        </div>

        <div className="not-supported__option-wrapper">
          <div className="not-supported__desc">
            You are currently a part of Swipes. If you wish to leave that organization please press the button bellow. After leaving the org, the following things will happen within the org and your account
          </div>
          <div className="not-supported__option-title">
            <a className="not-supported__link" onClick={this.onLeaveOrg}>Leave org</a>
          </div>
        </div>
      </div>
    )
  }
  render() {
    const { subtitle } = this.props;
    return (
      <div className="not-supported">
        <CompatibleHeader title="Your browser is not supported" subtitle={subtitle} />
        <CompatibleSubHeader title="You can use one of our apps instead."/>
        <DownloadForDevice />
        <div className="not-supported__empty-space-block" />
        <CompatibleSubHeader title="What else can I do?" />
        {this.renderActions()}
        <HOCLogoutButton>
          <div>logout</div>
        </HOCLogoutButton>
      </div>
    );
  }
}

export default NotSupported

// const { string } = PropTypes;

NotSupported.propTypes = {};
