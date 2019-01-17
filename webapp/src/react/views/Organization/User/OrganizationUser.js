import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import UserImage from 'src/react/components/UserImage/UserImage';
import UserOptionsContextMenu from 'src/react/context-menus/UserOptions/UserOptionsContextMenu';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import SW from './OrganizationUser.swiss';

@navWrapper
@connect(
  null,
  {
    contextMenu: mainActions.contextMenu
  }
)
export default class OrganizationUser extends PureComponent {
  getOptionsForE = e => {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
      excludeY: true,
      positionY: 12
    };
  };

  handleClick = e => {
    const { contextMenu } = this.props;
    const options = this.getOptionsForE(e);

    contextMenu({
      options,
      component: UserOptionsContextMenu
    });
  };

  render() {
    const { user } = this.props;
    return (
      <SW.Wrapper>
        <UserImage userId={user.get('user_id')} size={36} />
        <SW.Name>
          {user.get('first_name')} {user.get('last_name')}
        </SW.Name>
        <SW.Email>{user.get('email')}</SW.Email>
        <SW.UserType>{user.get('admin') ? 'Admin' : 'User'}</SW.UserType>
        <SW.Button icon="ThreeDots" onClick={this.handleClick} />
      </SW.Wrapper>
    );
  }
}
