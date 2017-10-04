import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll } from 'swipes-core-js/classes/utils';
// import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';
// import Button from 'Button';
import Icon from 'Icon';
import styles from  './styles/compatible-welcome.scss';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
import CompatibleAssignees from 'compatible/components/assignees/CompatibleAssignees';
import { Link } from 'react-router-dom';

const downloadLinks = {
  darwin: 'http://swipesapp.com/download-mac',
  win32: 'http://swipesapp.com/download-win',
  linux: 'http://swipesapp.com/download-linux',
  android: 'http://swipesapp.com/download-android',
  ios: 'http://swipesapp.com/download-ios',
};

const orgs = [
  {
    orgName: 'Swipes',
    inviter: 'UZTYMBVGO',
  },
  {
    orgName: 'Fill & Stroke',
    inviter: 'UZTYMBVGO',
  },
  {
    orgName: 'Harlem Globetrotters',
    inviter: 'UZTYMBVGO',
  },
];

class CompatibleWelcome extends PureComponent {
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
  renderHeader() {

    const subtitle = 'We\'re  glad to see that you have signed up. Here you can create a new org or join an existing one that you have been invited to.'

    return (
      <CompatibleHeader title="Hi folks" subtitle={subtitle} />
    )
  }
  renderInviter(user) {

    return (
      <div className="inviter">
        <img src="https://unsplash.it/30" alt=""/>
      </div>
    )
  }
  renderRow(name, inviter) {

    return (
      <div className="row" key={name}>
        <div className="row__item row__name">{name}</div>
        <div className="row__item row__inviter">
          {this.renderInviter(inviter)}
        </div>
        <div className="row__item row__button">
          <Icon icon="ArrowRightLong" className="row__svg" />
        </div>
      </div>
    )
  }
  renderJoinOrg() {

    const renderRows = orgs.map((o, i) => this.renderRow(o.orgName, o.inviter));

    return (
      <div className="table">
        <div className="table__header">
          <div className="col col--name">Organization name</div>
          <div className="col col--inviter">Invited by</div>
          <div className="clearfix"></div>
        </div>
        {renderRows}
      </div>
    )
  }
  renderCreateOrg() {
    
    return (
      <div className="create-org">
        <label htmlFor="create-org-input" className="create-org__wrapper">
          <div className="create-org__wrap">
            <input id="create-org-input" type="text" className="create-org__input" placeholder=" " />
            <div className="create-org__label">Enter Org name</div>
            <div className="create-org__button">
              <Icon icon="ArrowRightLong" className="create-org__svg" />
            </div>
          </div>
        </label>
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
      <div className="compatible-welcome">
        {this.renderHeader()}
        <h4 className="compatible-welcome__header">
          Join an organization you've been invited to
        </h4>
        {this.renderJoinOrg()}
        <h4 className="compatible-welcome__header">
          Create a new organization
        </h4>
        {this.renderCreateOrg()}
        <h4 className="compatible-welcome__header">
          Want to just download the app and start working? Here you go
        </h4>
        {this.renderDownload()}
      </div>
    );
  }
}

export default CompatibleWelcome

// const { string } = PropTypes;

CompatibleWelcome.propTypes = {};
