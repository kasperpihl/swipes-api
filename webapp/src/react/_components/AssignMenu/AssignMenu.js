import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import cachedCallback from 'src/utils/cachedCallback';
import SW from './AssignMenu.swiss';
import UserImage from 'src/react/_components/UserImage/UserImage';
import userGetFullName from 'swipes-core-js/utils/user/userGetFullName';

@connect((state, props) => ({
  organization: state.organizations.get(props.organizationId),
  me: state.me
}))
export default class AssignMenu extends PureComponent {
  constructor(props) {
    super(props);
    let selectedIds = props.selectedIds || [];
    if (typeof selectedIds.toJS === 'function') {
      selectedIds = selectedIds.toJS();
    }
    this.state = { selectedIds };
  }

  componentWillUnmount() {
    const { onSelect } = this.props;
    if (onSelect) {
      onSelect(this.state.selectedIds);
    }
  }

  handleToggleCached = cachedCallback(id => {
    let arr = this.state.selectedIds;
    const index = arr.indexOf(id);
    if (index !== -1) {
      arr.splice(index, 1);
    } else {
      arr.push(id);
    }
    this.setState({ selectedIds: [...arr] });
  });

  render() {
    const { selectedIds } = this.state;
    const { excludeMe, organization, me, organizationId } = this.props;
    const teamName = organization ? organization.get('name') : 'Personal';
    let users = organization ? organization.get('users').toList() : [me];
    if (excludeMe) {
      users = users.filter(u => u.get('user_id') !== me.get('user_id'));
    }
    console.log(selectedIds);
    return (
      <SW.Wrapper>
        <SW.Row menu>
          <SW.TeamName>Choose from: {teamName}</SW.TeamName>
          {!!selectedIds.length && (
            <SW.SelectedAmount>({selectedIds.length})</SW.SelectedAmount>
          )}
        </SW.Row>
        <SW.Dropdown>
          {users.map(u => (
            <SW.Row
              key={u.get('user_id')}
              selected={selectedIds.indexOf(u.get('user_id')) !== -1}
              onClick={this.handleToggleCached(u.get('user_id'))}
            >
              <UserImage
                userId={u.get('user_id')}
                size={36}
                organizationId={organizationId}
              />
              <SW.UserName>{userGetFullName(u, organizationId)}</SW.UserName>
            </SW.Row>
          ))}
        </SW.Dropdown>
      </SW.Wrapper>
    );
  }
}
