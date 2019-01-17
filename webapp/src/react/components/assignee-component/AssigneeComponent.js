import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import { convertedUsers } from './testusers';
import AssigneeContextMenu from 'src/react/context-menus/assignee-component/AssigneeContextMenu';
import Button from 'src/react/components/Button/Button.js'

@connect(null, {
  contextMenu: mainActions.contextMenu,
})
class AssigneeComponent extends Component {
  state = {
    selectedIds: [convertedUsers.getIn([0, 'id'])]
  }

  handleClick = (e) => {
    const { contextMenu } = this.props;
    const options = this.getOptionsForE(e);

    const propsTestObj = {
      users: convertedUsers || this.props.users,
      teamName: 'Swipes' || this.props.teamName,
      onSelect: this.onSelect,
      selectedIds: this.state.selectedIds,
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

  onSelect = (selectedIds) => {
    this.setState({ selectedIds });
  }
  render() {
    return (
        <Button 
          icon='Assign'
          sideLabel={`${this.state.selectedIds.length} Assigned People`}
          onClick={this.handleClick}
        />
    )
  }
}

export default AssigneeComponent;