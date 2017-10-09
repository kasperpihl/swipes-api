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
  android: 'http://swipesapp.com/download-android',
  ios: 'http://swipesapp.com/download-ios',
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
  mobileCheck() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      return "renderAndroid";
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "renderIos";
    }

    return undefined;
  }
  renderFirst(type) {
    return this[type]();
  }
  renderAndroid() {
    
    return (
      <a href={downloadLinks.android} target="_blank" className="download-for-device__device">
        <Icon icon="AndroidDevice" className="download-for-device__device-svg" />
        <p>Android</p>
      </a>
    )
  }
  renderIos() {
    
    return (
      <a href={downloadLinks.ios} target="_blank" className="download-for-device__device">
        <Icon icon="AndroidDevice" className="download-for-device__device-svg" />
        <p>iOS</p>
      </a>
    )
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
    const desktopType = this.desktopCheck();
    const mobileType = this.mobileCheck();
    const type = mobileType ? mobileType : desktopType;

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
