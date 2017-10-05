import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll } from 'swipes-core-js/classes/utils';
import { setupDelegate } from 'react-delegate';
import Icon from 'Icon';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
import CompatibleInviteForm from './CompatibleInviteForm';
import CompatibleButton from 'compatible/components/button/CompatibleButton';
import { Link } from 'react-router-dom';
import './styles/compatible-invite.scss';

const downloadLinks = {
  darwin: 'http://swipesapp.com/download-mac',
  win32: 'http://swipesapp.com/download-win',
  linux: 'http://swipesapp.com/download-linux',
  android: 'http://swipesapp.com/download-android',
  ios: 'http://swipesapp.com/download-ios',
};

class CompatibleInvite extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupDelegate(this);
    // this.callDelegate.bindAll('onLala');
  }
  componentDidMount() {
  }
  desktopCheck() {
    var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
    if(isMac){
      return 'renderMac';
    }
    const isLinux = navigator.platform.toUpperCase().indexOf('LINUX')>=0;
    if(isLinux){
      return 'renderLinux';
    }
    return 'renderWindows';
  }
  renderFirst(type) {
    return this[type]();
  }
  renderWindows(firstType) {
    if(firstType === 'renderWindows') {
      return undefined;
    }
    return (
      <a href={downloadLinks.win32} target="_blank" className="device">
        <Icon icon="WindowsDevice" className="device-svg" />
        <p>Windows</p>
      </a>
    );
  }
  renderMac(firstType) {
    if(firstType === 'renderMac') {
      return undefined;
    }
    return (
      <a href={downloadLinks.darwin} target="_blank" className="device">
        <Icon icon="MacDevice" className="device-svg" />
        <p>MacOS</p>
      </a>
    );
  }
  renderLinux(firstType) {
    if(firstType === 'renderLinux') {
      return undefined;
    }
    return (
      <a href={downloadLinks.linux} target="_blank" className="device">
        <Icon icon="LinuxDevice" className="device-svg" />
        <p>Linux</p>
      </a>
    );
  }
  renderInviteForm() {

    return (
      <div className="form">
        <CompatibleInviteForm />
        <div className="form__send-button">
          <CompatibleButton title="Send Invites" />
        </div>
      </div>
    )
  }
  renderDownload() {
    const type = this.desktopCheck();

    return (
      <div className="device-wrapper">
        {this.renderFirst(type)}
        <p className="all-download">
          <Link to="/download" className="all-download__link">See downloads for all platforms</Link>
        </p>
      </div>
    );
  }
  render() {
    return (
      <div className="compatible-invite">
        <CompatibleHeader title="New Org Title" subtitle="You have now created a new org, here you can invite others or download the app" />
        <h4 className="compatible-invite__header">
          Add people to your org
        </h4>
        {this.renderInviteForm()}
        <div className="clearfix"></div>
        <h4 className="compatible-invite__header">
          Want to just download the app and start working? Here you go
        </h4>
        {this.renderDownload()}
      </div>
    );
  }
}

export default CompatibleInvite

// const { string } = PropTypes;

CompatibleInvite.propTypes = {};
