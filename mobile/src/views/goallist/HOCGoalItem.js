import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Platform, UIManager, LayoutAnimation, Alert, Vibration } from 'react-native';
import { fromJS } from 'immutable';
import HOCAssigning from '../../components/assignees/HOCAssigning';
import RippleButton from '../../components/ripple-button/RippleButton';
import * as a from '../../actions';
import * as ca from '../../../swipes-core-js/actions';
import GoalsUtil from '../../../swipes-core-js/classes/goals-util';
import { setupDelegate } from '../../../swipes-core-js/classes/utils';
import { colors, viewSize } from '../../utils/globalStyles';

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
    const isStarred = !!goal.get('starred');


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
    const { goal } = this.props;
    const helper = new GoalsUtil(goal);
    const isCompleted = helper.getIsCompleted();

    if (isCompleted) {

      return (
        <View style={styles.completedWrapper}>
          <View style={styles.completedDot} />
        </View>
      )
    }


    return undefined;
  }
  renderContent() {
    const { goal, filter } = this.props;
    const status = msgGen.goals.getListSubtitle(goal);

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
    const currentAssignees = helper.getAssignees();

    return (
      <View style={styles.assignees}>
        <HOCAssigning assignees={currentAssignees} />
      </View>
    );
  }
  render() {
    const { goal } = this.props;
    let rowStyles = styles.row;

    if (goal.get('starred')) {
      rowStyles = [styles.row, styles.starredRow];
    }

    return (
      <RippleButton onPress={this.openOverview} onLongPress={this.onPin}>
        <View style={rowStyles}>
          {this.completedDot()}
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
    minHeight: 72,
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  completedWrapper: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  completedDot: {
    width: 9,
    height: 9,
    backgroundColor: colors.greenColor,
    borderRadius: 4.5,
  },
  starredRow: {
    backgroundColor: colors.blue5,
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
