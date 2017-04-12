import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
// import { map, list } from 'react-immutable-proptypes';
import { setupLoading } from 'swipes-core-js/classes/utils';
// import { fromJS } from 'immutable';
import TabMenu from 'context-menus/tab-menu/TabMenu';
import Organization from './Organization';

class HOCOrganization extends PureComponent {
  static minWidth() {
    return 900;
  }
  constructor(props) {
    super(props);
    this.state = {
      firstNameVal: '',
      emailVal: '',
    };
    setupLoading(this);
  }
  componentDidMount() {
  }
  onChange(key, val) {
    this.setState({ [key]: val});
  }
  onKeyDown(e) {
    if(e.keyCode === 13){
      this.onInvite();
    }
  }
  onInvite() {
    const { firstNameVal, emailVal } = this.state;
    const { invite } = this.props;
    this.setLoading('invite');
    invite(firstNameVal, emailVal).then((res) => {
      if(res.ok) {
        this.setState({ emailVal: '', firstNameVal: ''});
        this.clearLoading('invite', `Invited ${firstNameVal}`, 3000);
      } else {
        this.clearLoading('invite', '!Something went wrong', 3000);
      }
    });
  }
  onResend(uId) {
    const { users, invite } = this.props;
    const user = users.get(uId);
    const firstName = msgGen.users.getFirstName(user);
    const email = user.get('email');
    this.setLoading(uId);
    invite(firstName, email).then((res) => {
      if(res.ok) {
        this.clearLoading(uId, `Sent`, 3000);
      } else {
        this.clearLoading(uId, '!Something went wrong', 3000);
      }
    });
  }
  onContext(uId, e) {
    console.log('uId', uId, e);
    const { contextMenu, organization, users } = this.props;
    const user = users.get(uId);
    const options = this.getOptionsForE(e);

    const items = [
      {
        id: 'promote',
        title: 'Make an admin',
        subtitle: 'Admins have full access to the account including deactivate accounts and handle billing'
      },
    ];
    if(organization.get('admins').contains(uId)){
      items[0] = {
        id: 'demote',
        title: 'Demote to user',
        subtitle: 'Users cannot deactive accounts or handle billing',
      };
    }
    if(organization.get('owner_id') === uId){
      items[0].subtitle = "You can't demote the owner.";
      items[0].disabled = true;
    }
    items.push({
      id: 'deactive',
      title: 'Deactivate account',
      subtitle: 'If a user no longer needs an account, you can close it from here',
    })
    if(!user.get('activated')){

      items.push({
        id: 'resend',
        title: 'Resend invitation',
        subtitle: `Remind ${msgGen.users.getName(uId)} about the invitation to join in`,
      });
    }

    const delegate = {
      onItemAction: (item) => {
        contextMenu(null);
        console.log('chose item', item);
        if(item.id === 'resend') {
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
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    };
  }
  render() {
    const { users, organization } = this.props;
    const { firstNameVal, emailVal } = this.state;

    return (
      <Organization
        delegate={this}
        loadingState={this.getAllLoading()}
        firstNameVal={firstNameVal}
        emailVal={emailVal}
        organization={organization}
        users={users.sort(
          (u1, u2) => msgGen.users.getFirstName(u1).localeCompare(msgGen.users.getFirstName(u2))
        )}
      />
    );
  }
}
// const { string } = PropTypes;

HOCOrganization.propTypes = {};

function mapStateToProps(state) {
  return {
    users: state.get('users'),
    organization: state.getIn(['me', 'organizations', 0]),
  };
}

export default connect(mapStateToProps, {
  invite: ca.users.invite,
  contextMenu: a.main.contextMenu,
})(HOCOrganization);
