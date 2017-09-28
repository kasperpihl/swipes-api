import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { ImmutableListView } from 'react-native-immutable-list-view';
import * as cs from 'swipes-core-js/selectors';
import * as ca from 'swipes-core-js/actions';
import HOCHeader from 'HOCHeader';
import HOCGoalItem from 'views/goallist/HOCGoalItem';
import WaitForUI from 'WaitForUI';
import RippleButton from 'RippleButton';
import Icon from 'Icon';
import EmptyListFooter from 'components/empty-list-footer/EmptyListFooter';
import { colors } from 'globalStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  list: {
    flex: 1,
  },
});

class HOCNoMilestoneOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.renderGoal = this.renderGoal.bind(this);
    this.onHeaderTap = this.onHeaderTap.bind(this);
    this.openCreateGoalModal = this.openCreateGoalModal.bind(this);

  }
  onPushStack(goalOverview) {
    const { navPush } = this.props;

    navPush(goalOverview);
  }
  onHeaderTap() {
    this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true})
  }
  openCreateGoalModal() {
    const { navPush } = this.props;

    navPush({
      id: 'CreateNewItemModal',
      title: 'CreateNewItemModal',
      props: {
        title: '',
        defAssignees: [this.props.myId],
        placeholder: "Add a new goal",
        actionLabel: "Add goal",
        delegate: this
      }
    })
  }
  onModalCreateAction(title, assignees, milestoneId ) {
    const { createGoal } = this.props;

    if (title.length > 0) {
      createGoal(title, milestoneId, assignees.toJS());
    }
  }
  renderHeader() {
    return (
      <HOCHeader title="Goals without a plan" delegate={this}>
        <RippleButton onPress={this.openCreateGoalModal}>
          <View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Plus" width="24" height="24" fill={colors.deepBlue80} />
          </View>
        </RippleButton>
      </HOCHeader>
    )
  }
  renderListLoader() {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={colors.blue100} size="large" style={styles.loader} />
      </View>
    );
  }
  renderGoal(goal) {
    return <HOCGoalItem goalId={goal.get('id')} delegate={this} />;
  }
  renderListFooter() {

    return <EmptyListFooter />
  }
  renderList() {
    const { goals } = this.props;

    return (
      <WaitForUI>
        <ImmutableListView
          ref="scrollView"
          style={styles.list}
          immutableData={goals}
          renderRow={this.renderGoal}
          renderFooter={this.renderListFooter}
        />
      </WaitForUI>
    )
  }
  render() {
    const { savedState, goals, myId } = this.props;
    const { limit } = this.state;

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderList()}
      </View> 
    );
  }
}

HOCNoMilestoneOverview.propTypes = {};

const mapStateToProps = (state) => ({
  goals: cs.goals.withoutMilestone(state),
})

export default connect(mapStateToProps, {
  createGoal: ca.goals.create,
})(HOCNoMilestoneOverview);
