import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { ImmutableListView } from 'react-native-immutable-list-view';
import * as a from '../../actions';
import * as cs from '../../../swipes-core-js/selectors';
import * as ca from '../../../swipes-core-js/actions';
import HOCHeader from '../../components/header/HOCHeader';
import { colors, viewSize } from '../../utils/globalStyles';
import MilestoneItem from './MilestoneItem';
import EmptyListFooter from '../../components/empty-list-footer/EmptyListFooter';
import CreateNewItemModal from '../../modals/CreateNewItemModal';
import RippleButton from '../../components/ripple-button/RippleButton';
import Icon from '../../components/icons/Icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  list: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMilestoneWrapper: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    height: 126,
    paddingHorizontal: 15,
    paddingVertical: 18,
  },
  border: {
    width: viewSize.width - 30,
    height: 1,
    position: 'absolute',
    left: 0, bottom: 0,
    backgroundColor: colors.deepBlue5,
    marginHorizontal: 15,
  },
  noMilestoneTitle: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 24,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    color: colors.deepBlue100,
  },
  counter: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500', 
    color: colors.deepBlue50,
    paddingTop: 6,
  },
  noMilestoneSVG:{
    width: 90,
    height: 90,
  },
  noMilestoneCircle:{
    width: 32,
    height: 32,
    position: 'absolute',
    left: 45 - (32 / 2), top: 45 - (32 / 2),
    backgroundColor: 'white',
    borderRadius: 32 / 2, 
  },
  noMilestoneDot:{
    width: 6,
    height: 6,
    position: 'absolute',
    borderRadius: 3,
    backgroundColor: colors.deepBlue100,
    position: 'absolute',
    left: 16 - 3, top: 16 - 3,
  },
});

const emptyList = List();

class HOCMilestones extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabs: ['Current Milestones', 'Achieved'],
      tabIndex: 0,
      hasLoaded: false,
      fabOpen: false,
    };

    this.renderMilestoneItem = this.renderMilestoneItem.bind(this);
    this.handleModalState = this.handleModalState.bind(this);
    this.onHeaderTap = this.onHeaderTap.bind(this);
    this.renderListFooter = this.renderListFooter.bind(this);
    this.onOpenNoMilestone = this.onOpenNoMilestone.bind(this);
  }
  componentDidMount() {
    this.loadingTimeout = setTimeout(() => {
      this.setState({ hasLoaded: true });
    }, 1);
  }
  componentDidUpdate(prevProps) {
    if (!this.state.hasLoaded) {
      clearTimeout(this.loadingTimeout);

      this.loadingTimeout = setTimeout(() => {
        this.setState({ hasLoaded: true });
      }, 1);
    }
  }
  componentWillUnmount() {
    clearTimeout(this.loadingTimeout);
  }
  onChangeTab(index) {
    if (index !== this.state.tabIndex) {
      this.setState({ tabIndex: index, hasLoaded: false });
    }
  }
  onHeaderTap() {
    this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true})
  }
  onOpenNoMilestone() {
    const { navPush } = this.props;

    const overview = {
      id: 'NoMilestoneOverview',
      title: 'No Milestone overview',
      props: {
      },
    };

    navPush(overview);
  }
  onOpenMilestone(milestone) {
    const { navPush } = this.props;

    const overview = {
      id: 'MilestoneOverview',
      title: 'Milestone overview',
      props: {
        milestoneId: milestone.get('id'),
      },
    };

    navPush(overview);
  }
  onModalCreateAction(title) {
    const { createMilestone } = this.props;

    if (title.length > 0) {
      createMilestone(title).then((res) => {
        if (res && res.ok) {
          this.handleModalState()
        }
      });
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
  renderListLoader() {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={colors.blue100} size="large" style={styles.loader} />
      </View>
    );
  }
  renderHeader() {
    const { tabIndex, tabs } = this.state;
    const { milestones } = this.props;

    return (
      <HOCHeader
        title="Plan"
        currentTab={tabIndex}
        delegate={this}
        tabs={tabs.map((t) => {
          const size = (milestones.get(t) && milestones.get(t).size) || 0;

          if (size) {
            t += ` (${size})`;
          }

          return t;
        })}
      >
        <RippleButton onPress={this.handleModalState}>
          <View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Plus" width="24" height="24" fill={colors.deepBlue80} />
          </View>
        </RippleButton>
      </HOCHeader>
    );
  }
  renderMilestoneItem(milestone) {
    return (
      <MilestoneItem milestone={milestone} delegate={this} />
    );
  }
  renderNoMilestoneItems() {
    const { counter } = this.props;

    return (
      <RippleButton rippleColor={colors.deepBlue60} rippleOpacity={0.8} style={styles.noMilestoneWrapper} onPress={this.onOpenNoMilestone}>
        <View style={styles.noMilestoneWrapper}>
          <View style={styles.noMilestoneSVG}>
            <Icon name="NoMilestone" width="90" height="90" fill={colors.deepBlue5} />
            <View style={styles.noMilestoneCircle}><View style={styles.noMilestoneDot} /></View>
          </View>
          <View style={styles.noMilestoneTitle}>
            <Text style={styles.title}>Goals with no milestones</Text>
            <Text style={styles.counter}>{counter}</Text>
          </View>
          <View style={styles.border} />
        </View>
      </RippleButton>
    )
  }
  renderListFooter() {

    return (
      <View>
        {this.renderNoMilestoneItems()}
        <EmptyListFooter />
      </View>
    )
  }
  renderEmptyState() {

    return (
      <View style={{flex: 1, alignItems: 'center', flexDirection: 'column' }}>
        <Icon name="ESPlan" width="193" height="200"  />
        <Text style={{ fontSize: 15, lineHeight: 21, color: colors.deepBlue50, paddingTop: 24, textAlign: 'center'  }}>Create your first team Milestone</Text>
      </View>
    )
  }
  renderList() {
    const { tabIndex, tabs, hasLoaded } = this.state;
    const { milestones } = this.props;

    if (!hasLoaded) {
      return this.renderListLoader();
    }

    if (!milestones.get(tabs[tabIndex]).size) {
      return this.renderEmptyState();
    }

    return (
      <ImmutableListView
        ref="scrollView"
        style={styles.list}
        immutableData={milestones.get(tabs[tabIndex])}
        renderRow={this.renderMilestoneItem}
        renderFooter={this.renderListFooter}
        windowSize={2}
      />
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderList()}
        <CreateNewItemModal
          modalState={this.state.fabOpen}
          placeholder="Add a new milestone"
          actionLabel="Add milestone"
          delegate={this}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    milestones: cs.milestones.getGrouped(state),
    counter: cs.goals.withoutMilestone(state).size
  };
}

export default connect(mapStateToProps, {
  createMilestone: ca.milestones.create,
})(HOCMilestones);
