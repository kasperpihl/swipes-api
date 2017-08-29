import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { setupDelegate } from 'react-delegate';
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
    setupDelegate(this, 'onInfoTabAction');
  }
  renderActions() {
    const { actions } = this.props;
    if(!actions) {
      return undefined;
    }
    return actions.map((act, i) => (
      <div onClick={this.onInfoTabActionCached(i)}>
        <Icon icon={act.icon} />
        {act.title}
      </div>
    ))
  }
  renderInfo() {
    const { info } = this.props;
    if(!info) {
      return undefined;
    }

    return info.map((obj, i) => (
      <div>
        {obj.title}
        {obj.text}
      </div>
    ))
  }
  renderAbout() {
    const { about } = this.props;

    return (
      <div className="about">
        {about.title}
        {about.text}
      </div>
    )
  }
  render() {
    return (
      <div className="info-tab">
        {this.renderActions()}
        {this.renderInfo()}
        {this.renderAbout()}
      </div>
    );
  }
}

export default InfoTab

// const { string } = PropTypes;

InfoTab.propTypes = {};
