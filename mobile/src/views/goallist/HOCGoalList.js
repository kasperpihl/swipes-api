import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ImmutableVirtualizedList from 'react-native-immutable-list-view';
import HOCHeader from '../../components/header/HOCHeader';
import Icon from '../../components/icons/Icon';
import * as cs from '../../../swipes-core-js/selectors';
import { colors } from '../../utils/globalStyles';
import HOCGoalItem from './HOCGoalItem';

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
  },
  sectionWrapper: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: 'bold',
    color: colors.deepBlue100
  }
});

class HOCGoalList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasLoaded: false,
    };

    this.renderGoal = this.renderGoal.bind(this);
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
  onPushStack(route) {
    const { navPush } = this.props;

    navPush(route);
  }
  onChangeTab(index) {
    if (index !== this.state.tabIndex) {
      this.setState({ tabIndex: index, hasLoaded: false });
    }
  }
  renderHeader() {

    return (
      <HOCHeader
        title="Take Action"
        delegate={this}
      />
    );
  }
  renderSectionHeader(v1, section) {

    if (section === 'none') {
      return (
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>No milestone</Text>
        </View>
      );
    }

    return (
      <View style={styles.sectionWrapper}>
        <Icon name="MiniGoal" fill={colors.deepBlue100} width="18" height="18" />
        <Text style={[styles.sectionTitle, { paddingLeft: 3 }]}>{msgGen.milestones.getName(section)}</Text>
      </View>
    )
  }
  renderGoal(g) {
    const gId = g.get('id');

    return <HOCGoalItem goalId={gId} key={gId} delegate={this} />;
  }
  renderListLoader() {

    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={colors.blue100} size="large" style={styles.loader} />
      </View>
    );
  }
  renderList() {
    const { goals } = this.props;
    const { hasLoaded } = this.state;

    if (!hasLoaded) {
      return this.renderListLoader();
    }

    return (
      <ImmutableVirtualizedList
        style={styles.list}
        immutableData={goals}
        renderRow={this.renderGoal}
        renderSectionHeader={this.renderSectionHeader}
        onScroll={window.onScroll}
      />
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
    goals: cs.goals.assignedGroupedByMilestone(state),
  };
}

export default connect(mapStateToProps, {

})(HOCGoalList);
