import React, { PureComponent } from 'react';
import { bindAll } from 'swipes-core-js/classes/utils';
import { setupDelegate } from 'react-delegate';
import { styleElement, SwissProvider } from 'react-swiss';
import Icon from 'Icon';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
import HOCLogoutButton from 'compatible/components/logout-button/HOCLogoutButton';
import CompatibleSubHeader from 'compatible/components/subheader/CompatibleSubHeader';
import CompatibleAssignees from 'compatible/components/assignees/CompatibleAssignees';
import { Link } from 'react-router-dom';
import styles from './CompatibleWelcome.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Hint = styleElement('div', styles.Hint);
const Table = styleElement('div', styles.Table);
const TableHeader = styleElement('div', styles.TableHeader);
const TableCol = styleElement('div', styles.TableCol);
const ClearFix = styleElement('div', styles.ClearFix);
const TableRow = styleElement('div', styles.TableRow);
const RowItemName = styleElement('div', styles.RowItemName);
const RowItemButton = styleElement('div', styles.RowItemButton);
const CreateOrganization = styleElement('div', styles.CreateOrganization);
const InputWrapper = styleElement('div', styles.InputWrapper);
const Input = styleElement('input', styles.Input);
const Label = styleElement('div', styles.Label);
const Button = styleElement('div', styles.Button);
const Loader = styleElement(Icon, styles.Loader);
const SVG = styleElement(Icon, styles.SVG);

class CompatibleWelcome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      createText: '',
      focused: false,
      float: false,
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
    const input = this.refs.floatingInput;

    this.setState({
      focused: !this.state.focused,
      float: input.props.value.length > 0 ? this.state.float : !this.state.float,
    });
  }
  onBlur() {
    const input = this.refs.floatingInput;

    this.setState({
      focused: !this.state.focused,
      float: input.props.value.length > 0 ? this.state.float : !this.state.float,
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
      <TableRow key={id} className="row-hover" onClick={this.onOrganizationJoinCached(id)}>
        <RowItemName>{name}</RowItemName>
        <RowItemButton>
          {isLoading(id) ? (
            <Icon icon="darkloader" width="12" height="12" />
          ) : (
            'Join'
          )}
        </RowItemButton>
      </TableRow>
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
      <Table key="2">
        <TableHeader>
          <TableCol>Pending invitations:</TableCol>
          <ClearFix></ClearFix>
        </TableHeader>
        {renderRows}
      </Table>
    ])
  }
  renderCreateOrg() {
    const { isLoading } = this.props;
    const { createText, focused, float } = this.state;

    return (

      <SwissProvider loading={isLoading('creating')} focused={focused} float={float}>
        <CreateOrganization>
          <label htmlFor="create-org-input">
            <InputWrapper>
              <Input 
                id="create-org-input"
                type="text" 
                className="input-focus" 
                placeholder=""
                onKeyDown={this.onKeyDown}
                value={createText} 
                ref="floatingInput"
                onChange={this.onChange} 
                onFocus={this.onFocus} 
                onBlur={this.onBlur} 
              />
              <Label>Name of company</Label>
              <Button className="button-hover" onClick={this.onCreate}>
                {isLoading('creating') ? (
                  <Loader icon="loader" width="12" height="12" />
                ) : (
                  <SVG icon="ArrowRightLong" />
                )}
              </Button>
            </InputWrapper>
          </label>
        </CreateOrganization>
      </SwissProvider>
    )
  }

  render() {
    const { me } = this.props;
    const hint = `Hint: If you haven’t received an invitation for ${me.get('email')} yet, ask your Account Admin for one. 😉`;

    return (
      <Wrapper>
        {this.renderHeader()}
        <Hint>{hint}</Hint>
        <CompatibleSubHeader subtitle="If your company does not have a Workspace account yet, create one below and invite your team." />
        {this.renderJoinOrg()}
        <CompatibleSubHeader title="Create a new organization" />
        {this.renderCreateOrg()}
        <HOCLogoutButton />
      </Wrapper>
    );
  }
}

export default CompatibleWelcome;