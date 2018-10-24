import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import * as menuActions from 'src/redux/menu/menuActions';
import * as ca from 'swipes-core-js/actions';
import * as cs from 'swipes-core-js/selectors';
import { setupLoading } from 'swipes-core-js/classes/utils';
import TabMenu from 'src/react/context-menus/tab-menu/TabMenu';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import Organization from './Organization';

@navWrapper
@connect(
  state => ({
    users: cs.users.getAllButSofi(state),
    me: state.me,
    organization: state.me.getIn(['organizations', 0]),
  }),
  {
    invite: ca.organizations.inviteUser,
    confirm: menuActions.confirm,
    deleteOrg: ca.organizations.deleteOrg,
    leaveOrg: ca.organizations.leave,
    demoteAnAdmin: ca.organizations.demoteAnAdmin,
    disableUser: ca.organizations.disableUser,
    enableUser: ca.organizations.enableUser,
    promoteToAdmin: ca.organizations.promoteToAdmin,
    contextMenu: mainActions.contextMenu,
  }
)
export default class extends PureComponent {
  static minWidth() {
    return 900;
  }
  constructor(props) {
    super(props);
    this.state = {
      firstNameVal: '',
      emailVal: '',
      tabs: ['Active accounts', 'Disabled accounts'],
      tabIndex: 0,
    };
    setupLoading(this);
  }
  onChange(key, val) {
    this.setState({ [key]: val });
  }
  onKeyDown(e) {
    if (e.keyCode === 13) {
      this.onInvite();
    }
  }
  onInvite() {
    const { firstNameVal, emailVal } = this.state;
    const { invite } = this.props;
    this.setLoading('invite');
    invite(firstNameVal, emailVal).then(res => {
      if (res.ok) {
        this.setState({ emailVal: '', firstNameVal: '' });
        this.clearLoading('invite', `Invited ${firstNameVal}`, 3000);
        window.analytics.sendEvent('Invitation sent', {
          User: res.user.id,
        });
      } else {
        if (res.error.message) {
          this.clearLoading('invite', '!' + res.error.message, 5000);
        } else {
          this.clearLoading('invite', '!Something went wrong', 3000);
        }
        console.log(res);
      }
    });
  }
  onResend(uId) {
    const { users, invite } = this.props;
    const user = users.get(uId);
    const firstName = msgGen.users.getFirstName(user);
    const email = msgGen.users.getEmail(user);
    this.setLoading(uId);
    invite(firstName, email).then(res => {
      if (res.ok) {
        this.clearLoading(uId, `Sent`, 3000);
        window.analytics.sendEvent('Invitation resent', {
          User: uId,
        });
      } else {
        this.clearLoading(uId, '!Something went wrong', 3000);
      }
    });
  }
  onPromoteUser(uId) {
    const { promoteToAdmin, organization } = this.props;
    this.setLoading(uId);
    promoteToAdmin(organization.get('id'), uId).then(res => {
      if (res.ok) {
        this.clearLoading(uId, `Promoted`, 3000);
      } else {
        this.clearLoading(uId, '!Something went wrong', 3000);
      }
    });
  }
  onDemoteUser(uId) {
    const { demoteAnAdmin, organization } = this.props;
    this.setLoading(uId);
    demoteAnAdmin(organization.get('id'), uId).then(res => {
      if (res.ok) {
        this.clearLoading(uId, `Demoted`, 3000);
      } else {
        this.clearLoading(uId, '!Something went wrong', 3000);
      }
    });
  }
  onDisableUser(uId) {
    const { disableUser, organization } = this.props;
    this.setLoading(uId);
    disableUser(organization.get('id'), uId).then(res => {
      if (res.ok) {
        this.clearLoading(uId, `Deactivated`, 3000);
      } else {
        this.clearLoading(uId, '!Something went wrong', 3000);
      }
    });
  }
  onEnableUser(uId) {
    const { enableUser, organization } = this.props;
    this.setLoading(uId);
    enableUser(organization.get('id'), uId).then(res => {
      if (res.ok) {
        this.clearLoading(uId, `Activated`, 3000);
      } else {
        this.clearLoading(uId, '!Something went wrong', 3000);
      }
    });
  }
  onThreeDots(e) {
    const {
      contextMenu,
      organization,
      me,
      confirm,
      leaveOrg,
      deleteOrg,
    } = this.props;
    const options = this.getOptionsForE(e);
    const isOwner = organization.get('owner_id') === me.get('id');
    const items = [
      {
        title: 'Delete account',
        subtitle:
          'Your account will be closed and all users removed. Any subscription will be canceled.',
      },
    ];
    if (!isOwner) {
      items[0].title = 'Leave organization';
      items[0].subtitle =
        'Leave ' +
        organization.get('name') +
        ' to be part of another organization';
    } else {
      items.push({
        title: 'Leave organization',
        disabled: true,
        subtitle: 'The owner cannot leave the organization',
      });
    }
    const delegate = {
      onItemAction: item => {
        confirm(
          Object.assign({}, options, {
            title: items[0].title,
            message: 'This cannot be undone. Are you sure?',
          }),
          i => {
            if (i === 1) {
              const actionFunc = isOwner ? deleteOrg : leaveOrg;
              this.setLoading('threedots');
              actionFunc().then(res => {
                if (!res.ok) {
                  this.clearLoading('threedots', '!Something went wrong');
                } else {
                  this.clearLoading('threedots');
                }
              });
            }
          }
        );
      },
    };

    contextMenu({
      options,
      component: TabMenu,
      props: {
        delegate,
        items,
        style: {
          width: '360px',
        },
      },
    });
  }
  onContext(uId, e) {
    const { contextMenu, organization, users } = this.props;
    const user = users.get(uId);
    const options = this.getOptionsForE(e);

    const items = [
      {
        id: 'promote',
        title: 'Make an admin',
        subtitle:
          'Admins have full access to the account including disable accounts and handle billing',
      },
    ];
    if (user.get('disabled')) {
      items[0] = {
        id: 'enable',
        title: 'Enable account',
        subtitle: 'If a user needs his account again, reopen it from here.',
      };
    } else {
      if (organization.get('admins').contains(uId)) {
        items[0] = {
          id: 'demote',
          title: 'Demote to user',
          subtitle: 'Users cannot deactive accounts or handle billing',
        };
      }
      if (organization.get('owner_id') === uId) {
        items[0].subtitle = "You can't demote the owner.";
        items[0].disabled = true;
      } else {
        items.push({
          id: 'disable',
          title: 'Disable account',
          subtitle:
            'If a user no longer needs an account, you can close it from here.',
        });
      }

      if (!user.get('activated')) {
        items.push({
          id: 'resend',
          title: 'Resend invitation',
          subtitle: `Remind ${msgGen.users.getName(
            uId
          )} about the invitation to join in`,
        });
      }
    }

    const delegate = {
      onItemAction: item => {
        contextMenu(null);
        console.log('chose item', item);
        if (item.id === 'promote') {
          this.onPromoteUser(uId);
        }
        if (item.id === 'demote') {
          this.onDemoteUser(uId);
        }
        if (item.id === 'disable') {
          this.onDisableUser(uId);
        }
        if (item.id === 'enable') {
          this.onEnableUser(uId);
        }
        if (item.id === 'resend') {
          this.onResend(uId);
        }
      },
    };

    contextMenu({
      options,
      component: TabMenu,
      props: {
        delegate,
        items,
        style: {
          width: '360px',
        },
      },
    });
  }
  tabDidChange(index) {
    const { tabIndex } = this.state;
    if (tabIndex !== index) {
      this.setState({
        tabIndex: index,
      });
    }
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    };
  }
  render() {
    const { users, organization, me } = this.props;
    const { firstNameVal, emailVal, tabs, tabIndex } = this.state;

    return (
      <Organization
        delegate={this}
        {...this.bindLoading()}
        firstNameVal={firstNameVal}
        emailVal={emailVal}
        tabs={tabs}
        tabIndex={tabIndex}
        organization={organization}
        isAdmin={msgGen.me.isAdmin()}
        users={users.filter(u => {
          if (u.get('disabled')) {
            return tabIndex === 1;
          } else return tabIndex === 0;
        })}
      />
    );
  }
}
