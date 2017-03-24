import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
import HOCAssigning from '../../components/assignees/HOCAssigning';
import GoalsUtil from '../../../swipes-core-js/classes/goals-util';
import { colors, viewSize } from '../../utils/globalStyles';
// import * as a from 'actions';
// import { fromJS } from 'immutable';

class HOCGoalItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderContent() {
    const { goal, filter } = this.props;
    const status = msgGen.getGoalSubtitle(goal, filter);

    return (
      <View style={styles.content}>
        <Text style={styles.title}>{goal.get('title')}</Text>
        <Text style={styles.status} numberOfLines={2}>{status}</Text>
      </View>
    )
  }
  renderAssignees() {
    const { goal } = this.props;
    const helper = new GoalsUtil(goal);
    const currentAssignees = helper.getCurrentAssignees();

    return (
      <View style={styles.assignees}>
        <HOCAssigning assignees={currentAssignees} />
      </View>
    )
  }
  render() {
    return (
      <View style={styles.row}>
        {this.renderContent()}
        {this.renderAssignees()}
      </View>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
    filter: state.getIn(['filters', ownProps.filterId, 'filter'])
  };
}

export default connect(mapStateToProps, {
})(HOCGoalItem);

const styles = StyleSheet.create({
  row: {
    flex: 1,
    minHeight: 66,
    marginHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.deepBlue5,
    flexDirection: 'row'
  },
  assignees: {
    
  },
  content: {
    flex: 1
  },
  title: {
    fontSize: 16,
    lineHeight: 21,
    color: colors.deepBlue100
  },
  status: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.deepBlue40
  }
})