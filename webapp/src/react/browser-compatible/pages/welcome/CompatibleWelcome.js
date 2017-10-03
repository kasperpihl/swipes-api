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
  renderRow(name, inviter) {
    
    return (
      <div className="row" key={name}>
        <div className="row__name">{name}</div>
        <div className="row__inviter">
          <CompatibleAssignees assignee={inviter} />
        </div>
        <div className="row__button">
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
          <div className="col">
            <div className="col__name">Organization name</div>
            <div className="col__inviter">Invited by</div>
          </div>
        </div>
        {renderRows}
      </div>
    )
  }
  renderCreateOrg() {

  }
  renderDownloadNav() {

  }
  render() {

    return (
      <div className="compatible-welcome">
        {this.renderHeader()}
        {this.renderJoinOrg()}
        {this.renderCreateOrg()}
        {this.renderDownloadNav()}
      </div>
    );
  }
}

export default CompatibleWelcome

// const { string } = PropTypes;

CompatibleWelcome.propTypes = {};
