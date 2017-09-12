import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { ImmutableListView } from 'react-native-immutable-list-view';
import * as cs from 'swipes-core-js/selectors';
import HOCHeader from 'HOCHeader';
import HOCGoalItem from 'views/goallist/HOCGoalItem';
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
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class HOCNoMilestoneOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasLoaded: false,
    };

    this.renderGoal = this.renderGoal.bind(this);
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
  onPushStack(goalOverview) {
    const { navPush } = this.props;

    navPush(goalOverview);
  }
  onHeaderTap() {
    this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true})
  }
  renderHeader() {

    return <HOCHeader title="Goals without a milestone" delegate={this} />
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
    const { hasLoaded } = this.state;
    const { goals } = this.props;

    if (!hasLoaded) {
      return this.renderListLoader();
    }

    return (
      <ImmutableListView
        ref="scrollView"
        style={styles.list}
        immutableData={goals}
        renderRow={this.renderGoal}
        renderFooter={this.renderListFooter}
      />
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

})(HOCNoMilestoneOverview);
