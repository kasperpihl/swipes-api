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
import CompatibleWelcome from './CompatibleWelcome';
import CompatibleCard from 'compatible/components/card/CompatibleCard';

class HOCCompatibleWelcome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupLoading(this);
  }

  componentDidMount() {
  }
  onOrganizationJoin(orgId, e) {
    const { joinOrg, setUrl, isElectron } = this.props;

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
        this.setLoading(orgId, null, 100, () => {
          isElectron ? setUrl('/') : setUrl('/download');
        });
      }
    })
  }
  onOrganizationCreate(name, e) {
    const { createOrg, setUrl } = this.props;

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
        console.log('finished');
        this.setLoading('creating', null, 1000, () => {
          console.log('change to invite');
          setUrl('/invite');
        });
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
});

export default connect(mapStateToProps, {
  createOrg: ca.organizations.create,
  joinOrg: ca.organizations.join,
  setUrl: a.navigation.url,
})(HOCCompatibleWelcome);