import React, { PureComponent } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { List } from 'immutable';
import ImmutableVirtualizedList from 'react-native-immutable-list-view';
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
  fabWrapper: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    position: 'absolute',
    bottom: 30,
    right: 15,
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    backgroundColor: colors.blue100,
    alignItems: 'center',
    justifyContent: 'center',
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
        title="Milestones"
        currentTab={tabIndex}
        delegate={this}
        tabs={tabs.map((t) => {
          const size = (milestones.get(t) && milestones.get(t).size) || 0;

          if (size) {
            t += ` (${size})`;
          }

          return t;
        })}
      />
    );
  }
  renderMilestoneItem(milestone) {
    return (
      <MilestoneItem milestone={milestone} delegate={this} />
    );
  }
  renderList() {
    const { tabIndex, tabs, hasLoaded } = this.state;
    const { milestones } = this.props;

    if (!hasLoaded) {
      return this.renderListLoader();
    }

    return (
      <ImmutableVirtualizedList
        ref="scrollView"
        style={styles.list}
        immutableData={milestones.get(tabs[tabIndex])}
        renderRow={this.renderMilestoneItem}
        windowSize={2}
      />
    );
  }
  renderFAB() {
    const { fabOpen } = this.state;

    if (fabOpen) {
      return undefined;
    }

    return (
      <View style={styles.fabWrapper}>
        <RippleButton rippleColor={colors.bgColor} rippleOpacity={0.5} style={styles.fabButton} onPress={this.handleModalState}>
          <View style={styles.fabButton}>
            <Icon name="Plus" width="24" height="24" fill={colors.bgColor} />
          </View>
        </RippleButton>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderList()}
        {this.renderFAB()}
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
  };
}

export default connect(mapStateToProps, {
  createMilestone: ca.milestones.create,
})(HOCMilestones);
