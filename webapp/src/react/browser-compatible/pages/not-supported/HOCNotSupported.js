import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import CompatibleCard from 'compatible/components/card/CompatibleCard';
import NotSupported from './NotSupported';

class HOCNotSupported extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupLoading(this);
  }
  componentDidMount() {
  }
  onLeaveOrg(e) {
    const { me, organization, confirm, deleteOrg, leaveOrg } = this.props;
    const isOwner = me.get('id') === organization.get('owner_id');

    const options = { boundingRect: e.target.getBoundingClientRect() };
    
    const title = isOwner ? 'Delete organization' : 'Leave organization';
  
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
    const { browser: b, browserVersion: bV, me, organization } = this.props;
    
    if(!organization) return null;

    const subtitle = `You are using ${b} (${bV}). Supported browsers: Chrome (50+), Firefox (50+), Safari (10+) and Edge (14+)`;

    return (
      <CompatibleCard>
        <NotSupported 
          subtitle={subtitle}
          delegate={this}
          me={me}
          organization={organization}
          {...this.bindLoading()}
        />
      </CompatibleCard>
    );
  }
}
// const { string } = PropTypes;

HOCNotSupported.propTypes = {};

const mapStateToProps = (state) => ({
  browser: state.getIn(['globals', 'browser']),
  browserVersion: state.getIn(['globals', 'browserVersion']),
  me: state.get('me'),
  organization: state.getIn(['me', 'organizations', 0]),
});

export default connect(mapStateToProps, {
  confirm: a.menus.confirm,
  deleteOrg: ca.organizations.deleteOrg,
  leaveOrg: ca.organizations.leave,
})(HOCNotSupported);
