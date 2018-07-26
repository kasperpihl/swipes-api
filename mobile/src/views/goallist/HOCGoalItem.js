import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Alert, Vibration } from 'react-native';
import { fromJS } from 'immutable';
import { setupDelegate } from 'react-delegate';
import * as ca from 'swipes-core-js/actions';
import * as a from 'actions';
import * as gs from 'styles';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import HOCAssigning from 'components/assignees/HOCAssigning';
import RippleButton from 'RippleButton';
import { viewSize } from 'globalStyles';
const DOT_SIZE = 10;

const styles = StyleSheet.create({
  row: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('row', 'stretch', 'center'),
    ...gs.mixins.padding(15),
    minHeight: 64,
  },
  dotWrapper: {
    ...gs.mixins.size(40),
    ...gs.mixins.flex('center'),
  },
  doneDot: {
    ...gs.mixins.size(DOT_SIZE),
    backgroundColor: gs.colors.greenColor,
    borderRadius: DOT_SIZE / 2,
  },
  nowDot:{
    ...gs.mixins.size(DOT_SIZE),
    backgroundColor: gs.colors.yellowColor,
    borderRadius: DOT_SIZE / 2,
  },
  laterDot:{
    ...gs.mixins.size(DOT_SIZE),
    backgroundColor: gs.colors.deepBlue50,
    borderRadius: DOT_SIZE / 2,
  },
  seperator: {
    ...gs.mixins.size(viewSize.width - 40, 1),
    backgroundColor: gs.colors.deepBlue5,
    position: 'absolute',
    left: 15, bottom: 0,
  },
  assignees: {
    justifyContent: 'center',
  },
  content: {
    ...gs.mixins.size(1),
    justifyContent: 'center',
  },
  title: {
    ...gs.mixins.font(16.5, gs.colors.deepBlue100, 21),
  },
  status: {
    ...gs.mixins.font(12, gs.colors.deepBlue40, 18),
  },
});


class HOCGoalItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.onLongPress = this.onLongPress.bind(this);
    this.onModalGoalAction = this.onModalGoalAction.bind(this);
    this.openOverview = this.openOverview.bind(this);
    this.onArchiveGoal = this.onArchiveGoal.bind(this);
    setupDelegate(this, 'onPushStack');
  }
  onArchiveGoal() {
    const { goal, archive } = this.props;

    archive(goal.get('id'));
  }
  onModalGoalAction(id) {
    const { togglePinGoal, goal, alertModal, reorderGoals, setLoading } = this.props;

    if (id === 'delete') {
      alertModal({
        title: 'Delete goal',
        message: 'This will remove this goal for all participants.',
        onConfirmPress: this.onArchiveGoal,
      });
    } else if (['now', 'later', 'done'].indexOf(id) > -1) {
      const loadingLabel = `Moving to ${id}`;

      setLoading(loadingLabel);
      reorderGoals(goal.get('milestone_id'), goal.get('id'), id, 0).then((res) => {
        setLoading();
      });
    }
  }

  onLongPress() {
    const { actionModal, goal, inTakeAction } = this.props;
    const status = msgGen.goals.getStatus(goal);

    let items = [{
      title: 'Delete',
      id: 'delete',
    }];

    if (!inTakeAction && goal.get('milestone_id')) {
      if(status !== 'later') {
        items.push({
          title: 'Move to later',
          id: 'later',
        });
      }
      if(status !== 'now') {
        items.push({
          title: 'Move to now',
          id: 'now',
        });
      }
      if(status !== 'done') {
        items.push({
          title: 'Move to done',
          id: 'done',
        });
      }
    }

    Vibration.vibrate(5);
    actionModal({
      title: 'Goal',
      onItemPress: this.onModalGoalAction,
      items: fromJS(items),
    });
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
  renderDot() {
    const { goal } = this.props;
    const status = msgGen.goals.getStatus(goal);

    const dotStyles = styles[`${status}Dot`];

    return (
      <View style={styles.dotWrapper}>
        <View style={dotStyles} />
      </View>
    )
  }
  renderContent() {
    const { goal, filter } = this.props;

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
      <RippleButton onPress={this.openOverview} onLongPress={this.onLongPress}>
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
    goal: state.goals.get(ownProps.goalId),
  };
}

export default connect(mapStateToProps, {
  reorderGoals: ca.milestones.reorderGoals,
  archive: ca.goals.archive,
  actionModal: a.modals.action,
  alertModal: a.modals.alert,
  setLoading: a.main.loading,
})(HOCGoalItem);
