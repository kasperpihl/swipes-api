import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll } from 'swipes-core-js/classes/utils';
import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';
// import Button from 'Button';
import Icon from 'Icon';
import styles from  './styles/compatible-welcome.scss';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
import CompatibleSubHeader from 'compatible/components/subheader/CompatibleSubHeader';
import CompatibleAssignees from 'compatible/components/assignees/CompatibleAssignees';
import { Link } from 'react-router-dom';

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
    this.state = { createText: '' };
    setupDelegate(this, 'onOrganizationCreate');
    bindAll(this, ['onKeyDown', 'onChange', 'onCreate']);
  }
  componentDidMount() {
  }
  onChange(e) {
    this.setState({ createText: e.target.value });
  }
  onKeyDown(e) {
    if(e.keyCode === 13) {
      this.onCreate(e);
      e.preventDefault();
    }
  }
  onCreate(e) {
    const { createText } = this.state;
    if(createText.length) {
      this.onOrganizationCreate(createText, e);
    }
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
    const { getLoading } = this.props;
    // getLoading('creating');
    const { createText } = this.state;
    return (
      <div className="create-org">
        <label htmlFor="create-org-input" className="create-org__wrapper">
          <div className="create-org__wrap">
            <input 
              id="create-org-input" 
              type="text" 
              className="create-org__input" 
              placeholder=" "
              onKeyDown={this.onKeyDown}
              value={createText}
              onChange={this.onChange} 
            />
            <div className="create-org__label">Enter Org name</div>
            <div className="create-org__button" onClick={this.onCreate}>
              <Icon icon="ArrowRightLong" className="create-org__svg" />
            </div>
          </div>
        </label>
      </div>
    )
  }

  render() {

    return (
      <div className="compatible-welcome">
        {this.renderHeader()}
        <CompatibleSubHeader title="Join an organization you've been invited to" />
        {this.renderJoinOrg()}
        <CompatibleSubHeader title="Create a new organization" />
        {this.renderCreateOrg()}
      </div>
    );
  }
}

export default CompatibleWelcome

// const { string } = PropTypes;

CompatibleWelcome.propTypes = {};
