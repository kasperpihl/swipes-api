import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll } from 'swipes-core-js/classes/utils';
// import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
import './styles/login.scss';

class CompatibleLogin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupDelegate(this);
    // this.callDelegate.bindAll('onLala');
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="compatible-login" />
    );
  }
}

export default CompatibleLogin

// const { string } = PropTypes;

CompatibleLogin.propTypes = {};