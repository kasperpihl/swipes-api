import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, ActivityIndicator, Modal, TextInput } from 'react-native';
import { ImmutableListView } from 'react-native-immutable-list-view';
import HOCHeader from 'HOCHeader';
import Icon from 'Icon';
import RippleButton from 'RippleButton';
import EmptyListFooter from 'components/empty-list-footer/EmptyListFooter';
import CreateNewItemModal from 'modals/CreateNewItemModal';
import InteractionsHandlerWrapper from 'InteractionsHandlerWrapper';
import * as cs from 'swipes-core-js/selectors';
import * as ca from 'swipes-core-js/actions';
import { setupCachedCallback } from 'swipes-core-js/classes/utils';
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
    color: colors.deepBlue100
  },
});

class HOCGoalList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fabOpen: false,
      text: '',
    };

    this.renderGoal = this.renderGoal.bind(this);
    this.handleModalState = this.handleModalState.bind(this);
    this.onHeaderTap = this.onHeaderTap.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);

    this.navigateToMilestoneCached = setupCachedCallback(this.navigateToMilestone, this);
  }
  onPushStack(route) {
    const { navPush } = this.props;

    navPush(route);
  }
  onModalCreateAction(title, assignees, milestoneId ) {
    const { createGoal } = this.props;

    if (title.length > 0) {
      this.setState({ fabOpen: false })
      createGoal(title, milestoneId, assignees.toJS()).then((res) => {
      });
    }
  }
  onHeaderTap() {
    this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true})
  }
  navigateToMilestone(milestoneId) {
    const { navPush } = this.props;

    if (milestoneId !== 'none') {
      const overview = {
        id: 'MilestoneOverview',
        title: 'Milestone overview',
        props: {
          milestoneId: milestoneId,
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
  handleModalState() {
    const { fabOpen } = this.state;

    if (!fabOpen) {
      this.setState({ fabOpen: true })
    } else {
      this.setState({ fabOpen: false })
    }
  }
  renderHeader() {

    return (
      <HOCHeader
        title="Take Action"
        delegate={this}
      >
        <RippleButton onPress={this.handleModalState}>
          <View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Plus" width="24" height="24" fill={colors.deepBlue80} />
          </View>
        </RippleButton>
      </HOCHeader>
    );
  }
  renderSectionHeader(v1, sectionId) {
    let sectionTitle = sectionId === 'none' ? 'No milestone' : msgGen.milestones.getName(sectionId);
    let sectionIcon = sectionId === 'none' ? 'MiniNoMilestone' : 'MiniMilestone';

    return (
      <RippleButton onPress={this.navigateToMilestoneCached(sectionId)}>
        <View style={styles.sectionWrapper}>
          <View style={{flexDirection: 'row'}}>
            <Icon name={sectionIcon} fill={colors.deepBlue100} width="18" height="18" />
            <Text style={[styles.sectionTitle, { paddingLeft: 6 }]}>{sectionTitle}</Text>
          </View>
        </View>
      </RippleButton>
    )
  }
  renderGoal(g) {
    const gId = g.get('id');

    return <HOCGoalItem goalId={gId} key={gId} delegate={this} />;
  }
  renderListFooter() {

    return <EmptyListFooter />
  }
  renderEmptyState() {

    return (
      <View style={{flex: 1, alignItems: 'center', flexDirection: 'column' }}>
        <Icon name="ESTakeAction" width="290" height="300"  />
        <Text style={{ fontSize: 15, lineHeight: 21, color: colors.deepBlue50, paddingTop: 24 }}>Add your first goal</Text>
      </View>
    )
  }
  renderList() {
    const { goals } = this.props;
    const { hasLoaded } = this.state;

    if (goals.size === 1 && !goals.get('none').size) {
      return this.renderEmptyState();
    }

    return (
      <InteractionsHandlerWrapper>
        <ImmutableListView
          ref="scrollView"
          style={styles.list}
          immutableData={goals}
          renderRow={this.renderGoal}
          renderSectionHeader={this.renderSectionHeader}
          stickySectionHeadersEnabled={true}
          renderFooter={this.renderListFooter}
        />
      </InteractionsHandlerWrapper>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <View style={styles.list}>
          {this.renderList()}
        </View>
        <CreateNewItemModal
          modalState={this.state.fabOpen}
          title=''
          defAssignees={[this.props.myId]}
          placeholder="Add a new goal"
          actionLabel="Add goal"
          delegate={this}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    goals: cs.goals.assignedGroupedByMilestone(state),
    myId: state.getIn(['me', 'id']),
  };
}

export default connect(mapStateToProps, {
  createGoal: ca.goals.create,
})(HOCGoalList);
