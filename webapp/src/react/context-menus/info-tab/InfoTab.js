import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
import Icon from 'Icon';
import './styles/info-tab.scss';

class InfoTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupDelegate(this);
    // this.callDelegate.bindAll('onLala');
  }
  componentDidMount() {
  }
  renderActions() {

  }
  renderInfo() {

  }
  renderAbout() {

  }
  render() {
    return (
      <div className="info-tab" />
    );
  }
}

export default InfoTab

// const { string } = PropTypes;

InfoTab.propTypes = {};
