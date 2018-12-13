import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import { convertedUsers } from './testusers';
import SW from './AssigneeComponent.swiss';
import { fromJS } from 'immutable'
import AssigneeContextMenu from 'src/react/context-menus/assignee-component/AssigneeContextMenu';

const propsTestObj = {
  users: convertedUsers,
  team: 'Swips'
}
@connect(null, {
  contextMenu: mainActions.contextMenu,
})
class AssigneeComponent extends PureComponent {
  onClick = (e) => {
    const { contextMenu } = this.props;
    const options = this.getOptionsForE(e);

    contextMenu({
      options,
      component: AssigneeContextMenu,
      props: propsTestObj
    });
  }
  getOptionsForE = (e) => {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
      excludeY: true,
      // positionY: 10,
    };
  }
  render() {
    // console.log(convertedUsers.toJS());
    return (
      <SW.Wrapper onClick={this.onClick}>
        <SW.Icon icon='Assign' width="24" height="24" />
        <p>Assign People</p>
      </SW.Wrapper>
    )
  }
}

export default AssigneeComponent;