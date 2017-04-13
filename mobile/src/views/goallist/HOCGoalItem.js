import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
import HOCAssigning from '../../components/assignees/HOCAssigning';
import FeedbackButton from '../../components/feedback-button/FeedbackButton';
import GoalsUtil from '../../../swipes-core-js/classes/goals-util';
import { setupDelegate } from '../../../swipes-core-js/classes/utils';
import { colors, viewSize } from '../../utils/globalStyles';

class HOCGoalItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.openOverview = this.openOverview.bind(this);
    setupDelegate(this);
  }
  openOverview() {
    const { goal } = this.props;

    const overview = {
      id: 'GoalOverview',
      title: 'Goal overview',
      props: {
        goalId: goal.get('id'),
      },
    };

    this.callDelegate('onPushStack', overview);
  }
  renderContent() {
    const { goal, filter } = this.props;
    const status = msgGen.goals.getSubtitle(goal, filter);

    return (
      <View style={styles.content}>
        <Text style={styles.title}>{goal.get('title')}</Text>
        <Text style={styles.status} numberOfLines={2}>{status}</Text>
      </View>
    );
  }
  renderAssignees() {
    const { goal } = this.props;
    const helper = new GoalsUtil(goal);
    const currentAssignees = helper.getCurrentAssignees();

    return (
      <View style={styles.assignees}>
        <HOCAssigning assignees={currentAssignees} />
      </View>
    );
  }
  render() {
    return (
      <FeedbackButton onPress={this.openOverview}>
        <View style={styles.row}>
          {this.renderContent()}
          {this.renderAssignees()}
          <View style={styles.seperator} />
        </View>
      </FeedbackButton>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
    filter: state.getIn(['filters', ownProps.filterId, 'filter']),
  };
}

export default connect(mapStateToProps, {
})(HOCGoalItem);

const styles = StyleSheet.create({
  row: {
    flex: 1,
    minHeight: 72,
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  seperator: {
    width: viewSize.width - 30,
    height: 1,
    backgroundColor: colors.deepBlue5,
    position: 'absolute',
    left: 15,
    bottom: 0,
  },
  assignees: {
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16.5,
    lineHeight: 21,
    color: colors.deepBlue100,
  },
  status: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.deepBlue40,
  },
});
