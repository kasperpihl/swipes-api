import React, { PureComponent } from 'react';
import { bindAll } from 'swipes-core-js/classes/utils';
import { setupDelegate } from 'react-delegate';
import { SwissProvider } from 'swiss-react';
import Icon from 'Icon';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
import HOCLogoutButton from 'compatible/components/logout-button/HOCLogoutButton';
import CompatibleSubHeader from 'compatible/components/subheader/CompatibleSubHeader';
import SW from './CompatibleWelcome.swiss';

class CompatibleWelcome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      createText: '',
      focused: false,
    };
    setupDelegate(this, 'onOrganizationCreate', 'onOrganizationJoin');
    bindAll(this, ['onKeyDown', 'onChange', 'onCreate', 'onFocus', 'onBlur']);
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
  onFocus() {
    this.setState({
      focused: !this.state.focused,
    });
  }
  onBlur() {
    this.setState({
      focused: !this.state.focused,
    });
  }
  renderHeader() {

    const subtitle = 'You can join your team in an existing organization in the Workspace. Just accept the invitation for it.'

    return (
      <CompatibleHeader title="Great! Now let’s join in your organization" subtitle={subtitle} />
    )
  }
  renderRow(org) {
    const { isLoading } = this.props;
    const id = org.get('id');
    const name = org.get('name');

    return (
      <SW.TableRow key={id} className="row-hover" onClick={this.onOrganizationJoinCached(id)}>
        <SW.RowItemName>{name}</SW.RowItemName>
        <SW.RowItemButton>
          {isLoading(id) ? (
            <Icon icon="darkloader" width="12" height="12" />
          ) : (
            'Join'
          )}
        </SW.RowItemButton>
      </SW.TableRow>
    )
  }
  renderJoinOrg() {
    const { me } = this.props;
    const pendingOrgs = me.get('pending_organizations');

    if(!pendingOrgs || !pendingOrgs.size) {
      return undefined;
    }

    const renderRows = pendingOrgs.map(o => this.renderRow(o)).toArray();

    return ([
      <CompatibleSubHeader title="If your company does not have a Workspace account yet, create one below and invite your team." key="1" />,
      <SW.Table key="2">
        <SW.TableHeader>
          <SW.TableCol>Pending invitations:</SW.TableCol>
          <SW.ClearFix></SW.ClearFix>
        </SW.TableHeader>
        {renderRows}
      </SW.Table>
    ])
  }
  renderCreateOrg() {
    const { isLoading } = this.props;
    const { createText, focused } = this.state;

    return (
      <SwissProvider loading={isLoading('creating')} focused={focused}>
        <SW.CreateOrganization>
          <label htmlFor="create-org-input">
            <SW.InputWrapper>
              <SW.Input
                id="create-org-input"
                type="text"
                className="input-focus"
                placeholder="Name of company"
                onKeyDown={this.onKeyDown}
                value={createText}
                onChange={this.onChange}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
              />
              <SW.Button className="button-hover" onClick={this.onCreate}>
                {isLoading('creating') ? (
                  <SW.Loader icon="loader" width="12" height="12" />
                ) : (
                  <SW.SVG icon="ArrowRightLong" />
                )}
              </SW.Button>
            </SW.InputWrapper>
          </label>
        </SW.CreateOrganization>
      </SwissProvider>
    )
  }

  render() {
    const { me } = this.props;
    const hint = `Hint: If you haven’t received an invitation for ${me.get('email')} yet, ask your Account Admin for one. 😉`;

    return (
      <SW.Wrapper>
        {this.renderHeader()}
        <SW.Hint>{hint}</SW.Hint>
        <CompatibleSubHeader subtitle="If your company does not have a Workspace account yet, create one below and invite your team." />
        {this.renderJoinOrg()}
        <CompatibleSubHeader title="Create a new organization" />
        {this.renderCreateOrg()}
        <HOCLogoutButton />
      </SW.Wrapper>
    );
  }
}

export default CompatibleWelcome;
