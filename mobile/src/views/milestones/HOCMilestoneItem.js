import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import RippleButton from 'RippleButton';
import { setupDelegate } from 'react-delegate';
import { colors, viewSize } from 'globalStyles';

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 18,
    width: viewSize.width - 30,
  },
  border: {
    width: viewSize.width - 30,
    height: 1,
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: colors.deepBlue5,
    marginHorizontal: 15,
  },
  title: {
    width: viewSize.width - 90 - 30,
    fontSize: 18,
    lineHeight: 24,
    color: colors.deepBlue100,
    paddingLeft: 15,
  },
  progressBar: {
    width: 90,
    height: 16,
    borderRadius: 12,
    backgroundColor: colors.greenWithOpacity(0.1),
    alignSelf: 'center',
    overflow: 'hidden',
  },
  goalProgress: {
    position: 'absolute',
    zIndex: 2,
    height: 16,
    backgroundColor: colors.green,
  },
  stepProgress: {
    position: 'absolute',
    zIndex: 1,
    height: 16,
    backgroundColor: colors.greenWithOpacity(0.3),
  },
});

class HOCMilestoneItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      goals: this.getFilteredGoals(props.milestone),
    };

    this.openMilestone = this.openMilestone.bind(this);
    setupDelegate(this, 'onOpenMilestone');
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ goals: this.getFilteredGoals(nextProps.milestone) });
  }
  getFilteredGoals(milestone) {
    return msgGen.milestones.getGoals(milestone);
  }
  getProgress() {
    const { milestone } = this.props;

    if (milestone.get('closed_at')) {
      return [100, 100];
    }

    const { goals } = this.state;
    const numberOfGoals = goals.size;
    let numberOfSteps = 0;
    let numberOfCompletedSteps = 0;
    const numberOfCompletedGoals = goals.filter((g) => {
      const goal = new GoalsUtil(g);
      if (!goal.getIsCompleted()) {
        const dSteps = goal.getNumberOfSteps();

        if (dSteps) {
          numberOfSteps += dSteps;
          numberOfCompletedSteps += goal.getNumberOfCompletedSteps();
        } else {
          numberOfSteps += 1;
        }
      }

      return goal.getIsCompleted();
    }).size;

    const goalPercentage = numberOfGoals ? parseInt((numberOfCompletedGoals / numberOfGoals) * 100, 10) : 0;
    let stepPercentage = numberOfSteps ? parseInt((numberOfCompletedSteps / numberOfSteps) * 100, 10) : 0;

    if (!stepPercentage) {
      stepPercentage = '0';
    } else {
      const remainingPercentage = 100 - goalPercentage;
      const extraWidth = (remainingPercentage / 100) * stepPercentage;

      stepPercentage = `${goalPercentage + extraWidth}`;
    }

    return [goalPercentage, stepPercentage];
  }
  openMilestone() {
    const { milestone } = this.props;

    this.onOpenMilestone(milestone);
  }
  renderHeader() {
    const { milestone } = this.props;

    return (
      <Text selectable style={styles.title}>{milestone.get('title')}</Text>
    );
  }
  renderProgressBar() {
    const [goalPercentage, stepPercentage] = this.getProgress();
    const stylesGoalProgress = StyleSheet.flatten([styles.goalProgress, { width: `${goalPercentage}%` }]);
    const stylesStepProgress = StyleSheet.flatten([styles.stepProgress, { width: `${stepPercentage}%` }]);

    return (
      <View style={styles.progressBar} >
        <View style={stylesGoalProgress} />
        <View style={stylesStepProgress} />
      </View>
    );
  }
  render() {
    return (
      <RippleButton rippleColor={colors.deepBlue60} rippleOpacity={0.8} onPress={this.openMilestone}>
        <View style={styles.button}>
          {this.renderProgressBar()}
          {this.renderHeader()}
          <View style={styles.border} />
        </View>
      </RippleButton>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  milestone: state.getIn(['milestones', ownProps.milestoneId]),
  goals: state.get('goals'),
});

export default connect(mapStateToProps, {})(HOCMilestoneItem);
