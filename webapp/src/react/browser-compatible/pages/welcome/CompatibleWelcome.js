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
  renderDownloadNav() {

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
        {this.renderDownloadNav()}
      </div>
    );
  }
}

export default CompatibleWelcome

// const { string } = PropTypes;

CompatibleWelcome.propTypes = {};
