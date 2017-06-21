import React, { PureComponent } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { List } from 'immutable';
import ImmutableVirtualizedList from 'react-native-immutable-list-view';
import * as a from '../../actions';
import HOCHeader from '../../components/header/HOCHeader';
import { colors } from '../../utils/globalStyles';
import MilestoneItem from './MilestoneItem';
import EmptyListFooter from '../../components/empty-list-footer/EmptyListFooter';

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
  loader: {
    marginTop: -60,
  },
});

const emptyList = List();

class HOCMilestones extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabs: ['Open', 'Closed'],
      tabIndex: 0,
      hasLoaded: false,
    };

    this.renderMilestoneItem = this.renderMilestoneItem.bind(this);
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
  onOpenMilestone(milestone) {
    const { navPush } = this.props;

    const overview = {
      id: 'MilestoneOverview',
      title: 'Milestone overview',
      props: {
        milestone,
      },
    };

    navPush(overview);
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
    const group = milestones.groupBy(m => m.get('closed') ? 'Closed' : 'Open');

    return (
      <HOCHeader
        title="Milestones"
        currentTab={tabIndex}
        delegate={this}
        tabs={tabs.map((t) => {
          const size = (group.get(t) && group.get(t).size) || 0;

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
    const group = milestones.groupBy(m => m.get('closed') ? 'Closed' : 'Open');
    const milestonesToRender = group.get(tabs[tabIndex]) || emptyList;

    if (!hasLoaded) {
      return this.renderListLoader();
    }

    return (
      <ImmutableVirtualizedList
        style={styles.list}
        immutableData={milestonesToRender}
        renderRow={mS => this.renderMilestoneItem(mS)}
        onScroll={window.onScroll}
        windowSize={2}
      />
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderList()}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    milestones: state.get('milestones'),
  };
}

export default connect(mapStateToProps, {

})(HOCMilestones);
