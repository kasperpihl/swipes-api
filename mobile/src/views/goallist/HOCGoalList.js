import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fromJS, OrderedMap } from 'immutable';
import { View, Text, StyleSheet } from 'react-native';
import { ImmutableListView } from 'react-native-immutable-list-view';
import HOCHeader from 'HOCHeader';
import Icon from 'Icon';
import RippleButton from 'RippleButton';
import EmptyListFooter from 'components/empty-list-footer/EmptyListFooter';
import WaitForUI from 'WaitForUI';
import * as cs from 'swipes-core-js/selectors';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupCachedCallback } from 'react-delegate';
import { colors, viewSize } from 'globalStyles';
import HOCGoalItem from './HOCGoalItem';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  list: {
    flex: 1,
  },
  sectionWrapper: {
    alignSelf: 'stretch',
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: 'bold',
    color: colors.deepBlue100,
  },
});

class HOCGoalList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };

    this.renderGoal = this.renderGoal.bind(this);
    this.openCreateGoalModal = this.openCreateGoalModal.bind(this);
    this.onHeaderTap = this.onHeaderTap.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);

    this.navigateToMilestoneCached = setupCachedCallback(this.navigateToMilestone, this);
  }
  onPushStack(route) {
    const { navPush } = this.props;

    navPush(route);
  }
  onModalCreateAction(title, assignees, milestoneId) {
    const { createGoal } = this.props;

    if (title.length > 0) {
      createGoal(title, milestoneId, assignees.toJS()).then((res) => {
        if (res && res.ok) {
          // console.warn('goal added')
        }
      });
    }
  }
  onHeaderTap() {
    this.refs.scrollView.scrollTo({ x: 0, y: 0, animated: true });
  }
  navigateToMilestone(milestoneId) {
    const { navPush } = this.props;

    if (milestoneId !== 'none') {
      const overview = {
        id: 'MilestoneOverview',
        title: 'Milestone overview',
        props: {
          milestoneId,
        },
      };

      navPush(overview);
    } else {
      const overview = {
        id: 'NoMilestoneOverview',
        title: 'No Milestone overview',
        props: {},
      };

      navPush(overview);
    }
  }
  openCreateGoalModal() {
    const { navPush } = this.props;

    navPush({
      id: 'CreateNewItemModal',
      title: 'CreateNewItemModal',
      props: {
        title: '',
        defAssignees: [this.props.myId],
        placeholder: 'Add a new goal',
        actionLabel: 'Add goal',
        delegate: this,
      },
    });
  }
  renderHeader() {
    return (
      <HOCHeader
        title="Take Action"
        delegate={this}
      >
        <RippleButton onPress={this.openCreateGoalModal}>
          <View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Icon icon="Plus" width="24" height="24" fill={colors.deepBlue80} />
          </View>
        </RippleButton>
      </HOCHeader>
    );
  }
  renderSectionHeader(v1, sectionId) {
    const sectionTitle = sectionId === 'none' ? 'No plan' : msgGen.milestones.getName(sectionId);
    const sectionIcon = sectionId === 'none' ? 'MiniNoMilestone' : 'MiniMilestone';

    return (
      <RippleButton onPress={this.navigateToMilestoneCached(sectionId)}>
        <View style={styles.sectionWrapper}>
          <View style={{ flexDirection: 'row' }}>
            <Icon icon={sectionIcon} fill={colors.deepBlue100} width="18" height="18" />
            <Text selectable style={[styles.sectionTitle, { paddingLeft: 6 }]}>{sectionTitle}</Text>
          </View>
        </View>
      </RippleButton>
    );
  }
  renderGoal(g) {
    const gId = g.get('id');

    return <HOCGoalItem goalId={gId} key={gId} delegate={this} inTakeAction />;
  }
  renderListFooter() {
    return <EmptyListFooter />;
  }
  renderEmptyState() {
    return (
      <View style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }}>
        <Icon icon="ESTakeAction" width="290" height="300" />
        <Text selectable style={{ fontSize: 15, lineHeight: 21, color: colors.deepBlue50, paddingTop: 24 }}>Add your first goal</Text>
      </View>
    );
  }
  renderList() {
    const { goals, organization } = this.props;

    if (goals.size === 1 && !goals.get('none').size) {
      return this.renderEmptyState();
    }

    const plansOrder = organization.get('milestone_order');
    const filteredPlans = plansOrder.filter(planId => goals.get(planId)).push('none');
    const orderedGoals = new OrderedMap(filteredPlans.map(id => [id, goals.get(id)]));

    return (
      <WaitForUI>
        <ImmutableListView
          ref="scrollView"
          style={styles.list}
          immutableData={orderedGoals}
          renderRow={this.renderGoal}
          renderSectionHeader={this.renderSectionHeader}
          stickySectionHeadersEnabled
          renderFooter={this.renderListFooter}
        />
      </WaitForUI>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <View style={styles.list}>
          {this.renderList()}
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    organization: state.getIn(['me', 'organizations', 0]),
    goals: cs.goals.assignedGroupedByMilestone(state),
    myId: state.getIn(['me', 'id']),
  };
}

export default connect(mapStateToProps, {
  createGoal: ca.goals.create,
})(HOCGoalList);
