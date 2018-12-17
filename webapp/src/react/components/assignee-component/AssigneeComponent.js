import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import { convertedUsers } from './testusers';
import SW from './AssigneeComponent.swiss';
import { fromJS } from 'immutable'
import AssigneeContextMenu from 'src/react/context-menus/assignee-component/AssigneeContextMenu';

@connect(null, {
  contextMenu: mainActions.contextMenu,
})
class AssigneeComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedIds: [],
    }
  }

  onClick = (e) => {
    const { contextMenu } = this.props;
    const options = this.getOptionsForE(e);

    const propsTestObj = {
      users: convertedUsers,
      teamName: 'Swipes',
      selectUser: this.selectUser,
      unselectUser: this.unselectUser,
      onClose: this.onClose,
      selectedIds: this.state.selectedIds
    }

    contextMenu({
      options,
      component: AssigneeContextMenu,
      props: propsTestObj
    });
  }

  getOptionsForE = (e) => {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'left',
      excludeY: true,
      positionY: 12,
    };
  }

  selectUser = (id) => {
    console.log('test');
    let arr = this.state.selectedIds;
    if(arr.includes(id)) {
      return null;
    } else {
      arr.push(id);
      this.setState({ selectedIds: arr })
    }
  } 

  unselectUser = (id) => {
    let arr = this.state.selectedIds
    if(arr.includes(id)) {
      const filteredArr = arr.filter((u) => u !== id)
      this.setState({ selectedIds: filteredArr })      
    } else { 
      return null;
    }
  }

  onClose = (selectedUsers) => {
    
  }
  render() {
    return (
      <SW.Wrapper onClick={this.onClick}>
        <SW.Icon icon='Assign' width="24" height="24" />
        <SW.Text>Assign People</SW.Text>
      </SW.Wrapper>
    )
  }
}

export default AssigneeComponent;