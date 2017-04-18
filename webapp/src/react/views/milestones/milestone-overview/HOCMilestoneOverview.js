import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import MilestoneOverview from './MilestoneOverview';

class HOCMilestoneOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  render() {
    const { milestone } = this.props;
    console.log(milestone.get('title'));
    return (
      <MilestoneOverview />
    );
  }
}
// const { string } = PropTypes;

HOCMilestoneOverview.propTypes = {};

function mapStateToProps(state, ownProps) {
  return {
    milestone: state.getIn(['milestones', ownProps.milestoneId]),
  };
}

export default connect(mapStateToProps, {
})(HOCMilestoneOverview);
