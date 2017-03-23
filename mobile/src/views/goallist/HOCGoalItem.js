import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
// import * as a from 'actions';
import { map } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';

class HOCGoalItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  render() {
    const { goal } = this.props;
    return (
      <View><Text>{goal.get('title')}</Text></View>
    );
  }
}
// const { string } = PropTypes;

HOCGoalItem.propTypes = {
  goal: map,
};

function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
    filter: state.getIn(['filters', ownProps.filterId, 'filter'])
  };
}

export default connect(mapStateToProps, {
})(HOCGoalItem);
