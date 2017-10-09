import React, { PureComponent } from 'react';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupCachedCallback } from 'swipes-core-js/classes/utils';
import Icon from 'Icon';
import CompatibleCard from 'compatible/components/card/CompatibleCard';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
import CompatibleBackButton from 'compatible/components/compatible-back-button/CompatibleBackButton';
import './styles/download-page.scss';

const downloadLinks = {
  darwin: 'http://swipesapp.com/download-mac',
  win32: 'http://swipesapp.com/download-win',
  linux: 'http://swipesapp.com/download-linux',
  android: 'http://swipesapp.com/download-android',
  ios: 'http://swipesapp.com/download-ios',
};

class CompatibleDownload extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
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

    if (/windows phone/i.test(userAgent)) {
        return "windowsphone";
    }

    if (/android/i.test(userAgent)) {
        return "android";
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "ios";
    }

    return undefined;
  }
  renderDevice() {

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
  renderDesktopDownloads() {
    const type = this.desktopCheck();

    return (
      <div className="device-wrapper">
        {this.renderFirst(type)}
        {this.renderMac(type)}
        {this.renderWindows(type)}
        {this.renderLinux(type)}
      </div>
    );
  }
  renderBackButton() {

    return <CompatibleBackButton />;
  }
  render() {
    return (
      <CompatibleCard>
        <div className="download-page">
          {this.renderBackButton()}
          <CompatibleHeader title="Awesome! Download the Swipes Workspace" subtitle="Start working with your team from anywhere" />
          <div className="section">
            <div className="section-title">Desktop</div>
            {this.renderDesktopDownloads()}
          </div>

          <div className="section section--coming-soon">
            <div className="section-title">Mobile (In beta)</div>

            <div className="device-wrapper">
              <a href={downloadLinks.ios} target="_blank" className="device">
                <Icon icon="IphoneDevice" className="device-svg" />
                <p>iOS</p>
              </a>
              <a href={downloadLinks.android} target="_blank" className="device">
                <Icon icon="AndroidDevice" className="device-svg" />
                <p>Android</p>
              </a>
            </div>
          </div>
        </div>
      </CompatibleCard>
    );
  }
}

export default CompatibleDownload;

// const { string } = PropTypes;

CompatibleDownload.propTypes = {};