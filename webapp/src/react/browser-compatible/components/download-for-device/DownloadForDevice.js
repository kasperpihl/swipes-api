import React, { PureComponent } from 'react';

import SW from './DownloadForDevice.swiss';

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
      <SW.Device href={downloadLinks.android} target="_blank" className="svg-hover">
        <SW.DeviceSVG icon="AndroidDevice" />
        <p>Android</p>
      </SW.Device>
    )
  }
  renderIos() {
    
    return (
      <SW.Device href={downloadLinks.ios} target="_blank" className="svg-hover">
        <SW.DeviceSVG icon="AndroidDevice" />
        <p>iOS</p>
      </SW.Device>
    )
  }
  renderWindows(firstType) {
    if(firstType === 'renderWindows') {
      return undefined;
    }
    return (
      <SW.Device href={downloadLinks.win32} target="_blank" className="svg-hover">
        <SW.DeviceSVG icon="WindowsDevice" />
        <p>Download for Windows</p>
      </SW.Device>
    );
  }
  renderMac(firstType) {
    if(firstType === 'renderMac') {
      return undefined;
    }
    return (
      <SW.Device href={downloadLinks.darwin} target="_blank" className="svg-hover">
        <SW.DeviceSVG icon="MacDevice" />
        <p>Download for macOS</p>
      </SW.Device>
    );
  }
  renderLinux(firstType) {
    if(firstType === 'renderLinux') {
      return undefined;
    }
    return (
      <SW.Device href={downloadLinks.linux} target="_blank" className="svg-hover">
        <SW.DeviceSVG icon="LinuxDevice" />
        <p>Download for Linux</p>
      </SW.Device>
    );
  }
  render() {
    const desktopType = this.desktopCheck();
    const mobileType = this.mobileCheck();
    const type = mobileType ? mobileType : desktopType;

    return (
      <SW.Wrapper>
        {this.renderFirst(type)}
        <SW.AllDevices>
          <SW.AllDevicesLink to="/download">See all available platforms</SW.AllDevicesLink>
        </SW.AllDevices>
      </SW.Wrapper>
    );
  }
}

export default DownloadForDevice;
