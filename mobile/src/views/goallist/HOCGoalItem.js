import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Platform, UIManager, LayoutAnimation, Alert, Vibration } from 'react-native';
import { fromJS } from 'immutable';
import { setupDelegate } from 'react-delegate';
import * as ca from 'swipes-core-js/actions';
import * as a from 'actions';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import HOCAssigning from 'components/assignees/HOCAssigning';
import RippleButton from 'RippleButton';
import { colors, viewSize } from 'globalStyles';

class HOCGoalItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.onPin = this.onPin.bind(this);
    this.onModalGoalAction = this.onModalGoalAction.bind(this);
    this.openOverview = this.openOverview.bind(this);
    this.onArchiveGoal = this.onArchiveGoal.bind(this);
    setupDelegate(this, 'onPushStack');
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  onArchiveGoal() {
    const { goal, archive, showModal } = this.props;

    archive(goal.get('id'));
    showModal();
  }
  onModalGoalAction(i) {
    const { togglePinGoal, goal, showModal } = this.props;

    if (i.get('index') === 'pin') {
      togglePinGoal(goal.get('id'));
      showModal();
    } else if (i.get('index') === 'archive') {
      Alert.alert(
        'Archive goal',
        'This will make this goal inactive for all participants.',
        [
          { text: 'Cancel', onPress: () => showModal(), style: 'cancel' },
          { text: 'OK', onPress: () => this.onArchiveGoal() },
        ],
        { cancelable: true },
      );
    }
  }

  onPin() {
    const { showModal, goal } = this.props;

    const modal = {
      title: 'Goal',
      onClick: this.onModalGoalAction,
      items: fromJS([
        {
          title: 'Archive',
          index: 'archive',
        },
      ]),
    };

    Vibration.vibrate(50);
    showModal(modal);
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

    this.onPushStack(overview);
  }
  completedDot() {

    return (
      <View style={styles.dotWrapper}>
        <View style={styles.completedDot} />
      </View>
    )
  }
  renderDot() {
    const { goal } = this.props;
    const helper = new GoalsUtil(goal);
    const isCompleted = helper.getIsCompleted();

    if (isCompleted) {
      return this.completedDot();
    }

    return (
      <View style={styles.dotWrapper}>
        <View style={styles.regularDot} />
      </View>
    )
  }
  renderContent() {
    const { goal, filter } = this.props;
    const status = msgGen.goals.getListSubtitle(goal);

    return (
      <View style={styles.content}>
        <Text style={styles.title}>{goal.get('title')}</Text>
      </View>
    );
  }
  renderAssignees() {
    const { goal } = this.props;
    const helper = new GoalsUtil(goal);
    const currentAssignees = helper.getAssignees();

    return (
      <View style={styles.assignees}>
        <HOCAssigning assignees={currentAssignees} maxImages={1} />
      </View>
    );
  }
  render() {
    const { goal } = this.props;
    let rowStyles = styles.row;

    return (
      <RippleButton onPress={this.openOverview} onLongPress={this.onPin}>
        <View style={rowStyles}>
          {this.renderDot()}
          {this.renderContent()}
          {this.renderAssignees()}
          <View style={styles.seperator} />
        </View>
      </RippleButton>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
  };
}

export default connect(mapStateToProps, {
  togglePinGoal: ca.me.togglePinGoal,
  archive: ca.goals.archive,
  showModal: a.modals.show,
})(HOCGoalItem);

const styles = StyleSheet.create({
  row: {
    flex: 1,
    minHeight: 64,
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  dotWrapper: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 3,
  },
  completedDot: {
    width: 14,
    height: 14,
    backgroundColor: colors.greenColor,
    borderRadius: 14 /2,
  },
  regularDot:{
    width: 10,
    height: 10,
    borderRadius: 10 /2,
    borderWidth: 2,
    borderColor: colors.deepBlue50,
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
    includeFontPadding: false,
  },
  status: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.deepBlue40,
  },
});
