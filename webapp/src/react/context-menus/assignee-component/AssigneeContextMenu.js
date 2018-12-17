import React, { Component } from 'react';
import SW from './AssigneeContextMenu.swiss';

export default class extends Component {
  componentWillUnmount() {
    this.props.hide();
  }

  mapUsers = () => {
    const convertedUsers = this.props.users.toJS();
    return (
      convertedUsers.map((u) => (
        <SW.Row key={u.id}>
          <SW.UserName onClick={() => this.handleSelectUser(u.id)}>
            {`${u.profile.first_name} ${u.profile.last_name}`}
          </SW.UserName>
          <SW.Button 
            user 
            selected={this.props.selectedIds.includes(u.id)}
            onClick={this.props.selectedIds.includes(u.id) ? () => this.handleUnselectUser(u.id) : () => this.handleSelectUser(u.id)}
          />
        </SW.Row>
      ))
    )
  }

  handleSelectUser = (id) => {
    this.props.selectUser(id)
  } 

  handleUnselectUser = (id) => {
    this.props.unselectUser(id)
  }

  render() {
    console.log(this.props);
    return (
      <SW.Wrapper>
        <SW.Row menu> 
          <SW.TeamName>{this.props.teamName}</SW.TeamName> 
          <SW.SelectedAmount>
            ({this.props.selectedIds.length})
          </SW.SelectedAmount>
          <SW.Button onClick={this.props.hide}/>
        </SW.Row>
        <SW.Dropdown>
          {this.mapUsers()}
        </SW.Dropdown>
      </SW.Wrapper>
    )
  }
}