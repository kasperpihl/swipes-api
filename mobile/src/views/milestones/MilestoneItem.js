import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GoalsUtil from '../../../swipes-core-js/classes/goals-util';
import RippleButton from '../../components/ripple-button/RippleButton';
import { setupDelegate } from '../../../swipes-core-js/classes/utils';
import { colors, viewSize } from '../../utils/globalStyles';

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: 72,
  },
  milestone: {
    flex: 1,
    minHeight: 72,
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16.5,
    lineHeight: 21,
    color: colors.deepBlue100,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.deepBlue40,
  },
  seperator: {
    width: viewSize.width - 30,
    height: 1,
    backgroundColor: colors.deepBlue5,
    position: 'absolute',
    left: 15,
    bottom: 0,
  },
});

class MilestoneItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goals: this.getFilteredGoals(props.milestone),
    };

    this.openMilestone = this.openMilestone.bind(this);
    setupDelegate(this);
  }
  getFilteredGoals(milestone) {
    return msgGen.milestones.getGoals(milestone);
  }
  openMilestone() {
    const { milestone } = this.props;

    this.callDelegate('onOpenMilestone', milestone);
  }
  renderProgress() {
    const { goals } = this.state;
    const numberOfGoals = goals.size;
    const numberOfCompletedGoals = goals.filter(g => new GoalsUtil(g).getIsCompleted()).size;

    return (
      <Text style={styles.subtitle}>{numberOfCompletedGoals}/{numberOfGoals}</Text>
    );
  }
  render() {
    const { milestone } = this.props;

    return (
      <RippleButton rippleColor={colors.deepBlue60} rippleOpacity={0.8} style={styles.button} onPress={this.openMilestone}>
        <View style={styles.milestone}>
          <Text style={styles.title}>{milestone.get('title')}</Text>
          {this.renderProgress()}
          <View style={styles.seperator} />
        </View>
      </RippleButton>
    );
  }
}


export default MilestoneItem;
