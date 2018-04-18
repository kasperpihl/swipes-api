import React, { PureComponent } from 'react';
import Icon from 'Icon';
import { Link } from 'react-router-dom';
import { styleElement } from 'react-swiss';
import styles from './DownloadForDevice.swiss';

const DownloadForDeviceWrapper = styleElement('div', styles.DownloadForDeviceWrapper);
const Device = styleElement('a', styles.Device);
const DeviceSVG = styleElement(Icon, styles.DeviceSVG);
const AllDevices = styleElement('p', styles.AllDevices);
const AllDevicesLink = styleElement(Link, styles.AllDevicesLink);

const downloadLinks = {
  darwin: 'http://swipesapp.com/download-mac',
  win32: 'http://swipesapp.com/download-win',
  linux: 'http://swipesapp.com/download-linux',
  android: 'http://swipesapp.com/download-android',
  ios: 'http://swipesapp.com/download-ios',
};

class DownloadForDevice extends PureComponent {
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
      <Device href={downloadLinks.android} target="_blank" className="svg-hover">
        <DeviceSVG icon="AndroidDevice" />
        <p>Android</p>
      </Device>
    )
  }
  renderIos() {
    
    return (
      <Device href={downloadLinks.ios} target="_blank" className="svg-hover">
        <DeviceSVG icon="AndroidDevice" />
        <p>iOS</p>
      </Device>
    )
  }
  renderWindows(firstType) {
    if(firstType === 'renderWindows') {
      return undefined;
    }
    return (
      <Device href={downloadLinks.win32} target="_blank" className="svg-hover">
        <DeviceSVG icon="WindowsDevice" />
        <p>Download for Windows</p>
      </Device>
    );
  }
  renderMac(firstType) {
    if(firstType === 'renderMac') {
      return undefined;
    }
    return (
      <Device href={downloadLinks.darwin} target="_blank" className="svg-hover">
        <DeviceSVG icon="MacDevice" />
        <p>Download for macOS</p>
      </Device>
    );
  }
  renderLinux(firstType) {
    if(firstType === 'renderLinux') {
      return undefined;
    }
    return (
      <Device href={downloadLinks.linux} target="_blank" className="svg-hover">
        <DeviceSVG icon="LinuxDevice" />
        <p>Download for Linux</p>
      </Device>
    );
  }
  render() {
    const desktopType = this.desktopCheck();
    const mobileType = this.mobileCheck();
    const type = mobileType ? mobileType : desktopType;

    return (
      <DownloadForDeviceWrapper>
        {this.renderFirst(type)}
        <AllDevices>
          <AllDevicesLink to="/download">See all available platforms</AllDevicesLink>
        </AllDevices>
      </DownloadForDeviceWrapper>
    );
  }
}

export default DownloadForDevice;
