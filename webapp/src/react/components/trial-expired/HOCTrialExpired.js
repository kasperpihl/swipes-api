import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';

class HOCTrialExpired extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupLoading(this);
  }
  componentDidMount() {
    this.interval = setInterval(this.updateTrial, 60000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const daysLeft = msgGen.orgs.getDaysLeft();
    const isAdmin = msgGen.me.isAdmin();

    return (
      <div className={`trial-expired`}>
      </div>
    );
  }
}
// const { string } = PropTypes;

HOCTrialExpired.propTypes = {};

const mapStateToProps = (state) => ({
  me: state.get('me'),
});

export default connect(mapStateToProps, {
})(HOCTrialExpired);
