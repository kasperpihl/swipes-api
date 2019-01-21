import React, { Component } from 'react';
import SW from './AssigneeContextMenu.swiss';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIds: props.selectedIds || []
    };
  }

  componentWillUnmount() {
    if (this.props.onSelect) {
      this.props.onSelect(this.state.selectedIds);
    }
  }

  toggleUser = id => {
    let arr = this.state.selectedIds;
    const index = arr.indexOf(id);
    console.log(index);
    if (index !== -1) {
      arr.splice(index, 1);
    } else {
      arr.push(id);
    }
    this.setState({
      selectedIds: arr
    });
  };

  mapUsers = () => {
    return this.props.users.map(u => (
      <SW.Row
        key={u.get('id')}
        selected={this.state.selectedIds.indexOf(u.get('id')) !== -1}
        onClick={() => this.toggleUser(u.get('id'))}
      >
        {/* <SW.Image src="testImage.svg" /> */}
        <SW.UserName>
          {`${u.getIn(['profile', 'first_name'])} ${u.getIn([
            'profile',
            'last_name'
          ])}`}
        </SW.UserName>
      </SW.Row>
    ));
  };

  render() {
    return (
      <SW.Wrapper>
        <SW.Row menu>
          <SW.TeamName>{this.props.teamName}</SW.TeamName>
          <SW.SelectedAmount>
            ({this.state.selectedIds.length})
          </SW.SelectedAmount>
        </SW.Row>
        <SW.Dropdown>{this.mapUsers()}</SW.Dropdown>
      </SW.Wrapper>
    );
  }
}
