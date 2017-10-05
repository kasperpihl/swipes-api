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
  onOrganizationCreate(name, e) {
    const { createOrg, setUrl } = this.props;
    
    this.setLoading('creating');
    createOrg(name).then((res) => {
      if(!res.ok) {
        this.clearLoading('creating', '!Something went wrong', 5000);
      } else {
        setUrl('/invite');
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
});

export default connect(mapStateToProps, {
  createOrg: ca.organizations.create,
  setUrl: a.navigation.url,
})(HOCCompatibleWelcome);
