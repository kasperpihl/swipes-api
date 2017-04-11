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
  onContext(uId, e) {
    console.log('uId', uId, e);
    const { contextMenu, organization } = this.props;
    const options = this.getOptionsForE(e);

    const items = [
      { id: 'promote', title: 'Promote to admin' },
    ];
    if(organization.get('admins').contains(uId)){
      items[0] = { id: 'demote', title: 'Demote as admin' };
    }
    if(!uId.activated){
      items.push({ id: 'email', title: 'Resend email' });
    }

    const delegate = {
      onItemAction: (item) => {
        contextMenu(null);
        console.log('chose item', item);
      },
    };

    this.setLoading(uId);
    contextMenu({
      options,
      component: TabMenu,
      onClose: () => this.clearLoading(uId),
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
        users={users.sort((u1, u2) => u1.get('first_name').localeCompare(u2.get('first_name')))}
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
