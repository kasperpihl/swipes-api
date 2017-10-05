import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll } from 'swipes-core-js/classes/utils';
import { setupDelegate } from 'react-delegate';
import Icon from 'Icon';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
import CompatibleSubHeader from 'compatible/components/subheader/CompatibleSubHeader';
import CompatibleInviteForm from './CompatibleInviteForm';
import CompatibleButton from 'compatible/components/button/CompatibleButton';
import { Link } from 'react-router-dom';
import './styles/compatible-invite.scss';

class CompatibleInvite extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupDelegate(this);
    // this.callDelegate.bindAll('onLala');
  }
  componentDidMount() {
  }
  renderInviteForm() {

    return (
      <div className="form">
        <CompatibleInviteForm />
        <div className="form__send-button">
          <CompatibleButton title="Send Invites" />
        </div>
      </div>
    )
  }
  render() {
    return (
      <div className="compatible-invite">
        <CompatibleHeader title="New Org Title" subtitle="You have now created a new org, here you can invite others or download the app" />
        <CompatibleSubHeader title="Add people to your org" />
        {this.renderInviteForm()}
        <div className="clearfix"></div>
      </div>
    );
  }
}

export default CompatibleInvite

// const { string } = PropTypes;

CompatibleInvite.propTypes = {};
