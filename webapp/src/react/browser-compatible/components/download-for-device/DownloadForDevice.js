import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll } from 'swipes-core-js/classes/utils';
// import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';
// import Button from 'Button';
import Icon from 'Icon';
import { Link } from 'react-router-dom';
import './styles/download-for-device.scss';


const downloadLinks = {
  darwin: 'http://swipesapp.com/download-mac',
  win32: 'http://swipesapp.com/download-win',
  linux: 'http://swipesapp.com/download-linux',
};

class DownloadForDevice extends PureComponent {
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
      <a href={downloadLinks.win32} target="_blank" className="download-for-device__device">
        <Icon icon="WindowsDevice" className="download-for-device__device-svg" />
        <p>Windows</p>
      </a>
    );
  }
  renderMac(firstType) {
    if(firstType === 'renderMac') {
      return undefined;
    }
    return (
      <a href={downloadLinks.darwin} target="_blank" className="download-for-device__device">
        <Icon icon="MacDevice" className="download-for-device__device-svg" />
        <p>MacOS</p>
      </a>
    );
  }
  renderLinux(firstType) {
    if(firstType === 'renderLinux') {
      return undefined;
    }
    return (
      <a href={downloadLinks.linux} target="_blank" className="download-for-device__device">
        <Icon icon="LinuxDevice" className="download-for-device__device-svg" />
        <p>Linux</p>
      </a>
    );
  }
  render() {
    const type = this.desktopCheck();

    return (
      <div className="download-for-device">
        {this.renderFirst(type)}
        <p className="download-for-device__all-devices">
          <Link to="/download" className="download-for-device__all-devices-link">See downloads for all platforms</Link>
        </p>
      </div>
    );
  }
}

export default DownloadForDevice

// const { string } = PropTypes;

DownloadForDevice.propTypes = {};
