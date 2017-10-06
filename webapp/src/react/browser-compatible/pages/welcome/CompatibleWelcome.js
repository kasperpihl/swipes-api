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
import HOCLogoutButton from 'compatible/components/logout-button/HOCLogoutButton';
import CompatibleSubHeader from 'compatible/components/subheader/CompatibleSubHeader';
import CompatibleAssignees from 'compatible/components/assignees/CompatibleAssignees';
import { Link } from 'react-router-dom';

class CompatibleWelcome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { createText: '' };
    setupDelegate(this, 'onOrganizationCreate', 'onOrganizationJoin');
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

    const subtitle = 'First we need you be part of an organization. You have two options.'

    return (
      <CompatibleHeader title="Welcome to Swipes." subtitle={subtitle} />
    )
  }
  renderRow(org) {
    const { getLoading } = this.props;
    const id = org.get('id');
    const name = org.get('name');

    return (
      <div className="row" key={id}  onClick={this.onOrganizationJoinCached(id)}>
        <div className="row__item row__name">{name}</div>
        <div className="row__item row__button">
          {getLoading(id).loading ? (
            <Icon icon="darkloader" width="12" height="12" />
          ) : (
            'Join'
          )}
        </div>
      </div>
    )
  }
  renderJoinOrg() {
    const { me } = this.props;

    const pendingOrgs = me.get('pending_organizations');
    if(!pendingOrgs || !pendingOrgs.size) {
      const title = `Get someone to invite your email: "${me.get('email')}" to their organization.`
      return <CompatibleSubHeader title={title} />
    }

    const renderRows = pendingOrgs.map(o => this.renderRow(o)).toArray();

    return ([
          <CompatibleSubHeader title="Get invited to an organization." key="1" />,
          <div className="table" key="2">
            <div className="table__header">
              <div className="col col--name">Current invitations</div>
              <div className="clearfix"></div>
            </div>
            {renderRows}
          </div>
        ])
  }
  renderCreateOrg() {
    const { getLoading } = this.props;
    const { createText } = this.state;
    const buttonClass = getLoading('creating').loading ? 'create-org__button create-org__button--loading' : 'create-org__button';

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
            <div className="create-org__label">Name of organization</div>
            <div className={buttonClass} onClick={this.onCreate}>
              {getLoading('creating').loading ? (
                <Icon icon="loader" width="12" height="12" className="create-org__loading" />
              ) : (
                <Icon icon="ArrowRightLong" className="create-org__svg" />
              )}
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
        {this.renderJoinOrg()}
        <CompatibleSubHeader title="Create a new organization" />
        {this.renderCreateOrg()}
        <HOCLogoutButton />
      </div>
    );
  }
}

export default CompatibleWelcome

// const { string } = PropTypes;

CompatibleWelcome.propTypes = {};
