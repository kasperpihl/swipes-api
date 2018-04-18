import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import * as ca from 'swipes-core-js/actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
import CompatibleWelcome from './CompatibleWelcome';
import CompatibleCard from 'compatible/components/card/CompatibleCard';

class HOCCompatibleWelcome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupLoading(this);
  }
  onOrganizationJoin(orgId, e) {
    const { joinOrg, setUrl, isElectron, isBrowserSupported } = this.props;

    if (this.isJoining) {
      return;
    }

    this.setLoading(orgId);
    this.isJoining = true;

    joinOrg(orgId).then((res) => {
      this.isJoining = false;
      if(!res.ok) {
        this.clearLoading(orgId, '!Something went wrong', 5000);
      } else {
        if(!isElectron && isBrowserSupported) {
          setUrl({
            pathname: '/download',
            state: { goTo: '/' },
          });
        } else if(isElectron) {
          setUrl('/');
        } else {
          setUrl('/notsupported');
        }
      }
    })
  }
  onOrganizationCreate(name, e) {
    const { createOrg, setUrl, isBrowserSupported, isElectron } = this.props;

    if (this.isJoining || !name.length) {
      return;
    }

    this.isJoining = true;
    this.setLoading('creating');

    createOrg(name).then((res) => {
      this.isJoining = false;
      if(!res.ok) {
        this.clearLoading('creating', '!Something went wrong', 5000);
      } else {
        if(isBrowserSupported) {
          setUrl({
            pathname: '/invite',
            state: { goTo: isElectron ? '/' : '/download' },
          });
        } else {
          setUrl('/notsupported');
        }
        
      }
    })
  }
  render() {
    const { me } = this.props;
    return (
      <CompatibleCard>
        <CompatibleWelcome
          delegate={this}
          me={me}
          {...this.bindLoading()}
        />
      </CompatibleCard>
    );
  }
}
// const { string } = PropTypes;

HOCCompatibleWelcome.propTypes = {};

const mapStateToProps = (state) => ({
  me: state.get('me'),
  isElectron: state.getIn(['globals', 'isElectron']),
  isBrowserSupported: state.getIn(['globals', 'isBrowserSupported']),
});

export default connect(mapStateToProps, {
  createOrg: ca.organizations.create,
  joinOrg: ca.organizations.join,
  setUrl: navigationActions.url,
})(HOCCompatibleWelcome);
