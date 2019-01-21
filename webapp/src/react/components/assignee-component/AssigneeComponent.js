import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import { convertedUsers } from './testusers';
import AssigneeContextMenu from 'src/react/components/AssigneeMenu/AssigneeContextMenu';
import Button from 'src/react/components/Button/Button.js';

@connect(
  null,
  {
    contextMenu: mainActions.contextMenu
  }
)
class AssigneeComponent extends Component {
  state = {
    selectedIds: [convertedUsers.getIn([0, 'id'])]
  };

  handleClick = e => {
    const { contextMenu } = this.props;
    const options = this.getOptionsForE(e);

    const propsTestObj = {
      users: convertedUsers || this.props.users,
      teamName: 'Swipes' || this.props.teamName,
      onSelect: this.onSelect,
      selectedIds: this.state.selectedIds
    };

    contextMenu({
      options,
      component: AssigneeContextMenu,
      props: propsTestObj
    });
  };

  getOptionsForE = e => {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'left',
      excludeY: true,
      positionY: 12
    };
  };

  onSelect = selectedIds => {
    this.setState({ selectedIds });
  };
  render() {
    return <Button.Rounded icon="Assign" onClick={this.handleClick} />;
  }
}

export default AssigneeComponent;
