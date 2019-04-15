import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';

import cachedCallback from 'src/utils/cachedCallback';
import userGetFullName from 'core/utils/user/userGetFullName';
import UserImage from '_shared/UserImage/UserImage';

import Button from '_shared/Button/Button';
import EmptyState from '_shared/EmptyState/EmptyState';
import Spacing from '_shared/Spacing/Spacing';

import SW from './AssignMenu.swiss';

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

  goToCreateTeam = e => {
    const { nav, hide } = this.props;
    nav.push({
      screenId: 'TeamCreate',
      crumbTitle: 'TeamCreate'
    });
    hide();
  };

  renderEmptyState = () => {
    return (
      <EmptyState title="All members of this team are already added." small />
    );
  };

  renderTeamAssignees = (users, allAreSelected) => {
    const { selectedIds } = this.state;
    const { me, excludeMe, teamId, hide, hideRowOnSelect } = this.props;

    return (
      <>
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
                  excludeMe={
                    excludeMe && u.get('user_id') === me.get('user_id')
                  }
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
        <SW.OptionsRow row>
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
      </>
    );
  };

  renderCreateTeamNudge = () => {
    const { me, teamId } = this.props;
    const { selectedIds } = this.state;
    const rowSelected = selectedIds.indexOf(me.get('user_id')) !== -1;
    return (
      <>
        <SW.Dropdown>
          <SW.Row
            selected={rowSelected}
            onClick={this.handleToggleCached(me.get('user_id'))}
          >
            <UserImage userId={me.get('user_id')} size={36} />
            <SW.UserName>
              {userGetFullName(me.get('user_id'), teamId)}
            </SW.UserName>
          </SW.Row>
        </SW.Dropdown>
        <SW.OptionsRow>
          <SW.NudgeText>
            When collaborating with a team, you’ll be able to assign team
            members to tasks here.
          </SW.NudgeText>
          <Spacing height={20} />
          <SW.ButtonWrapper>
            <Button
              title="Create a team"
              onClick={this.goToCreateTeam}
              border
            />
          </SW.ButtonWrapper>
        </SW.OptionsRow>
      </>
    );
  };

  render() {
    const { selectedIds } = this.state;
    const { excludeMe, team, me, hideRowOnSelect, title } = this.props;
    const teamName = team ? team.get('name') : 'Personal';

    let users = team
      ? team
          .get('users')
          .toList()
          .filter(u => u.get('status') === 'active')
          .filter(u => u.get('user_id') !== me.get('user_id'))
      : fromJS([me]);

    if (!excludeMe) {
      users = users
        .filter(u => u.get('user_id') !== me.get('user_id'))
        .insert(0, me);
    }

    const allAreSelected = users.size === selectedIds.length;

    return (
      <SW.Wrapper>
        <SW.OptionsRow row>
          <SW.TeamName>{title || `Choose from: ${teamName}`}</SW.TeamName>
          {!hideRowOnSelect && !!selectedIds.length && (
            <SW.SelectedAmount>({selectedIds.length})</SW.SelectedAmount>
          )}
        </SW.OptionsRow>
        {!!team
          ? this.renderTeamAssignees(users, allAreSelected)
          : this.renderCreateTeamNudge()}
      </SW.Wrapper>
    );
  }
}
