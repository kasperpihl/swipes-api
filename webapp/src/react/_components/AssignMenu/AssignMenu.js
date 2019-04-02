import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import cachedCallback from 'src/utils/cachedCallback';
import SW from './AssignMenu.swiss';
import UserImage from 'src/react/_components/UserImage/UserImage';
import userGetFullName from 'core/utils/user/userGetFullName';
import Button from 'src/react/_components/Button/Button';
import EmptyState from '_shared/EmptyState/EmptyState';

@connect((state, props) => ({
  team: state.teams.get(props.teamId),
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
    const { onClose } = this.props;
    if (onClose) {
      onClose(this.state.selectedIds);
    }
  }

  handleToggleCached = cachedCallback(id => {
    let arr = this.state.selectedIds;
    const index = arr.indexOf(id);
    if (index !== -1) {
      arr.splice(index, 1);
      if (typeof this.props.onDeselect === 'function') {
        this.props.onDeselect(id);
      }
    } else {
      arr.push(id);
      if (typeof this.props.onSelect === 'function') {
        this.props.onSelect(id);
      }
    }
    this.setState({ selectedIds: [...arr] });
  });

  toggleSelectAllCached = (users, allAreSelected) => {
    let arr = [];
    if (!allAreSelected) {
      arr = users.map(u => u.get('user_id')).toArray();
    }
    this.setState({ selectedIds: arr });
  };

  renderEmptyState = () => {
    return (
      <EmptyState title="All members of this team are already added." small />
    );
  };

  render() {
    const { selectedIds } = this.state;
    const {
      excludeMe,
      team,
      me,
      teamId,
      hide,
      hideRowOnSelect,
      title
    } = this.props;
    const teamName = team ? team.get('name') : 'Personal';
    let users = team
      ? team
          .get('users')
          .toList()
          .filter(u => u.get('status') === 'active')
      : fromJS([me]);
    users = users
      .filter(u => u.get('user_id') !== me.get('user_id'))
      .insert(0, me);

    const allAreSelected = users.size === selectedIds.length;
    return (
      <SW.Wrapper>
        <SW.OptionsRow>
          <SW.TeamName>{title || `Choose from: ${teamName}`}</SW.TeamName>
          {!hideRowOnSelect && !!selectedIds.length && (
            <SW.SelectedAmount>({selectedIds.length})</SW.SelectedAmount>
          )}
        </SW.OptionsRow>
        {!allAreSelected && (
          <SW.Dropdown>
            {users.map(u => {
              const rowSelected = selectedIds.indexOf(u.get('user_id')) !== -1;
              return (
                <SW.Row
                  key={u.get('user_id')}
                  selected={rowSelected}
                  hideRow={hideRowOnSelect && rowSelected}
                  onClick={this.handleToggleCached(u.get('user_id'))}
                  excludeMe={u.get('user_id') === me.get('user_id')}
                >
                  <UserImage
                    userId={u.get('user_id')}
                    size={36}
                    teamId={teamId}
                  />
                  <SW.UserName>{userGetFullName(u, teamId)}</SW.UserName>
                </SW.Row>
              );
            })}
          </SW.Dropdown>
        )}
        {allAreSelected && this.renderEmptyState()}
        <SW.OptionsRow>
          {!(hideRowOnSelect && allAreSelected) && (
            <SW.ButtonWrapper>
              <Button
                title={allAreSelected ? 'Deselect All' : 'Select All'}
                onClick={() =>
                  this.toggleSelectAllCached(users, allAreSelected)
                }
                border
              />
            </SW.ButtonWrapper>
          )}
          <SW.ButtonWrapper right>
            <Button title="Done" onClick={hide} border green />
          </SW.ButtonWrapper>
        </SW.OptionsRow>
      </SW.Wrapper>
    );
  }
}
