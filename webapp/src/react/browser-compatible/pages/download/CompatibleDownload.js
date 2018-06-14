import React, { PureComponent } from 'react';
import CompatibleCard from 'compatible/components/card/CompatibleCard';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
import GoToWorkspace from 'compatible/components/go-to-workspace/GoToWorkspace';
import SW from './CompatibleDownload.swiss';

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
      <SW.Device href={downloadLinks.win32} target="_blank">
        <SW.DeviceSVG icon="WindowsDevice" />
        <SW.DeviceName>Windows</SW.DeviceName>
      </SW.Device>
    );
  }
  renderMac(firstType) {
    if(firstType === 'renderMac') {
      return undefined;
    }
    return (
      <SW.Device href={downloadLinks.darwin} target="_blank">
        <SW.DeviceSVG icon="MacDevice" />
        <SW.DeviceName>MacOS</SW.DeviceName>
      </SW.Device>
    );
  }
  renderLinux(firstType) {
    if(firstType === 'renderLinux') {
      return undefined;
    }
    return (
      <SW.Device href={downloadLinks.linux} target="_blank">
        <SW.DeviceSVG icon="LinuxDevice"/>
        <SW.DeviceName>Linux</SW.DeviceName>
      </SW.Device>
    );
  }
  renderDesktopDownloads() {
    const type = this.desktopCheck();

    return (
      <SW.DeviceWrapper>
        {this.renderFirst(type)}
        {this.renderMac(type)}
        {this.renderWindows(type)}
        {this.renderLinux(type)}
      </SW.DeviceWrapper>
    );
  }
  renderDownloadSections() {
    const isMobile = this.mobileCheck();

    if (isMobile) {
      return ([
        <Section key="mobile">
          <SectionTitle>Mobile (In beta)</SectionTitle>
          <SW.DeviceWrapper>
            <SW.Device href={downloadLinks.ios} target="_blank">
              <SW.DeviceSVG icon="IphoneDevice" />
              <SW.DeviceName>iOS</SW.DeviceName>
            </SW.Device>
            <SW.Device href={downloadLinks.android} target="_blank">
              <SW.DeviceSVG icon="AndroidDevice" />
              <SW.DeviceName>Android</SW.DeviceName>
            </SW.Device>
          </SW.DeviceWrapper>
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
        <SW.DeviceWrapper>
          <SW.Device href={downloadLinks.ios} target="_blank">
            <SW.DeviceSVG icon="IphoneDevice" />
            <SW.DeviceName>iOS</SW.DeviceName>
          </SW.Device>
          <SW.Device href={downloadLinks.android} target="_blank">
            <SW.DeviceSVG icon="AndroidDevice" />
            <SW.DeviceName>Android</SW.DeviceName>
          </SW.Device>
        </SW.DeviceWrapper>
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
