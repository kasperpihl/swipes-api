import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import * as menuActions from 'src/redux/menu/menuActions';
import * as ca from 'swipes-core-js/actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
import CompatibleCard from 'compatible/components/card/CompatibleCard';
import NotSupported from './NotSupported';

@connect(state => ({
  me: state.me,
  organization: state.me.getIn(['organizations', 0]),
}), {
  confirm: menuActions.confirm,
  deleteOrg: ca.organizations.deleteOrg,
  leaveOrg: ca.organizations.leave,
})

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupLoading(this);
  }
  onLeaveOrg(e) {
    const { me, organization, confirm, deleteOrg, leaveOrg } = this.props;
    const isOwner = me.get('id') === organization.get('owner_id');

    const options = { boundingRect: e.target.getBoundingClientRect() };
    
    const title = isOwner ? 'Delete account' : 'Leave organization';
  
    confirm(Object.assign({}, options, {
      title,
      message: 'This cannot be undone. Are you sure?',
    }), (i) => {
      if (i === 1) {
        const actionFunc = isOwner ? deleteOrg : leaveOrg;
        this.setLoading('delete');
        actionFunc().then((res) => {
          if(!res.ok) {
            this.clearLoading('delete', '!Something went wrong');
          } else {
            this.clearLoading('delete');
          }
        })
      }
    });
  }
  render() {
    const { me, organization } = this.props;
    
    if(!organization) return null;

    // let subtitle = `You are using ${b} (${bV}). Supported browsers: Chrome (50+), Firefox (50+), Safari (10+) and Edge (14+)`;

    return (
      <CompatibleCard>
        <NotSupported 
          delegate={this}
          me={me}
          organization={organization}
          {...this.bindLoading()}
        />
      </CompatibleCard>
    );
  }
}
