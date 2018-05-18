import React, { PureComponent } from 'react';
import { styleElement } from 'react-swiss';
import Icon from 'Icon';
import CompatibleCard from 'compatible/components/card/CompatibleCard';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
import GoToWorkspace from 'compatible/components/go-to-workspace/GoToWorkspace';
import styles from './CompatibleDownload.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Section = styleElement('div', styles.Section);
const SectionTitle = styleElement('div', styles.SectionTitle);
const DeviceWrapper = styleElement('div', styles.DeviceWrapper);
const Device = styleElement('a', styles.Device);
const DeviceSVG = styleElement(Icon, styles.DeviceSVG);

const downloadLinks = {
  darwin: 'http://swipesapp.com/download-mac',
  win32: 'http://swipesapp.com/download-win',
  linux: 'http://swipesapp.com/download-linux',
  android: 'http://swipesapp.com/download-android',
  ios: 'http://swipesapp.com/download-ios',
};

class CompatibleDownload extends PureComponent {
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
      <Device href={downloadLinks.win32} className="device-hover" target="_blank">
        <DeviceSVG icon="WindowsDevice" />
        <p>Windows</p>
      </Device>
    );
  }
  renderMac(firstType) {
    if(firstType === 'renderMac') {
      return undefined;
    }
    return (
      <Device href={downloadLinks.darwin} className="device-hover" target="_blank">
        <DeviceSVG icon="MacDevice" />
        <p>MacOS</p>
      </Device>
    );
  }
  renderLinux(firstType) {
    if(firstType === 'renderLinux') {
      return undefined;
    }
    return (
      <Device href={downloadLinks.linux} className="device-hover" target="_blank">
        <DeviceSVG icon="LinuxDevice"/>
        <p>Linux</p>
      </Device>
    );
  }
  renderDesktopDownloads() {
    const type = this.desktopCheck();

    return (
      <DeviceWrapper>
        {this.renderFirst(type)}
        {this.renderMac(type)}
        {this.renderWindows(type)}
        {this.renderLinux(type)}
      </DeviceWrapper>
    );
  }
  renderDownloadSections() {
    const isMobile = this.mobileCheck();

    if (isMobile) {
      return ([
        <Section key="mobile">
          <SectionTitle className="section-title">Mobile (In beta)</SectionTitle>
          <DeviceWrapper>
            <Device href={downloadLinks.ios} className="device-hover" target="_blank">
              <DeviceSVG icon="IphoneDevice" />
              <p>iOS</p>
            </Device>
            <Device href={downloadLinks.android} className="device-hover" target="_blank">
              <DeviceSVG icon="AndroidDevice" />
              <p>Android</p>
            </Device>
          </DeviceWrapper>
        </Section>,
        <Section key="desktop">
          <SectionTitle>Desktop</SectionTitle>
          {this.renderDesktopDownloads()}
        </Section>
      ])
    }

    return ([
      <Section key="desktop">
        <SectionTitle>Desktop</SectionTitle>
        {this.renderDesktopDownloads()}
      </Section>,
      <Section key="mobile">
        <SectionTitle>Mobile</SectionTitle>
        <DeviceWrapper>
          <Device href={downloadLinks.ios} className="device-hover" target="_blank">
            <DeviceSVG icon="IphoneDevice" />
            <p>iOS</p>
          </Device>
          <Device href={downloadLinks.android} className="device-hover" target="_blank">
            <DeviceSVG icon="AndroidDevice" />
            <p>Android</p>
          </Device>
        </DeviceWrapper>
      </Section>
    ])
  }
  renderWebSection() {
    const isMobile = this.mobileCheck();

    if (isMobile) return null;

    return (
      <Section className="section">
        <SectionTitle>Web version</SectionTitle>
        <GoToWorkspace noTitle={true} />
      </Section>
    )
  }
  render() {
    return (
      <CompatibleCard>
        <Wrapper>
          <CompatibleHeader title="Download the Workspace" subtitle="Start working with your team from anywhere" />
          {this.renderDownloadSections()}
          {this.renderWebSection()}
        </Wrapper>
      </CompatibleCard>
    );
  }
}

export default CompatibleDownload;
