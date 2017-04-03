import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import * as a from 'actions';
import { map } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import ActivityFeed from './ActivityFeed';

class HOCActivityFeed extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  render() {
    const { goal } = this.props;
    return (
      <ActivityFeed
        delegate={this}
        goal={goal}
      />
    );
  }
}
// const { string } = PropTypes;

HOCActivityFeed.propTypes = {
  goal: map,
};

function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
  };
}

export default connect(mapStateToProps, {
})(HOCActivityFeed);
