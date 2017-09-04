import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Use,
  Defs,
  Stop
} from 'react-native-svg';
import GoalsUtil from '../../../swipes-core-js/classes/goals-util';
import RippleButton from '../../components/ripple-button/RippleButton';
import { setupDelegate } from '../../../swipes-core-js/classes/utils';
import { colors, viewSize } from '../../utils/globalStyles';

const PROGRESS_DASH = 320.4876403808594;

class MilestoneItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goals: this.getFilteredGoals(props.milestone),
    };

    this.openMilestone = this.openMilestone.bind(this);
    setupDelegate(this, 'onOpenMilestone');
  }
  getFilteredGoals(milestone) {
    return msgGen.milestones.getGoals(milestone);
  }
  openMilestone() {
    const { milestone } = this.props;

    this.onOpenMilestone(milestone);
  }
  renderProgress() {
    const { goals } = this.state;
    const numberOfGoals = goals.size;
    const numberOfCompletedGoals = goals.filter(g => new GoalsUtil(g).getIsCompleted()).size;

    return (
      <Text style={styles.subtitle}>{numberOfCompletedGoals}/{numberOfGoals}</Text>
    );
  }
  renderHeader() {
    const { milestone } = this.props;

    return (
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{milestone.get('title')}</Text>
      </View>
    )
  }
  renderProgressCounter() {
    const { goals } = this.state;
    const numberOfGoals = goals.size;
    const numberOfCompletedGoals = goals.filter(g => new GoalsUtil(g).getIsCompleted()).size;

    return (
      <View style={styles.counterWrapper}>
        <Text style={styles.counter}>{numberOfCompletedGoals}/{numberOfGoals}</Text>
      </View>
    )
  }
  renderProgressWheel() {
    const { goals } = this.state;
    const numberOfGoals = goals.size;
    const numberOfCompletedGoals = goals.filter(g => new GoalsUtil(g).getIsCompleted()).size;
    const percentage = numberOfGoals ? parseInt((numberOfCompletedGoals / numberOfGoals) * 100, 10) : 0;
    const svgDashOffset = PROGRESS_DASH - ((PROGRESS_DASH * percentage) / 100);

    return (
      <View style={styles.progressWheelContainer}>
        <View style={styles.shadowWheel}>
          <Svg viewBox="0 0 150 150" width="150" height="150" >
            <Path
              d="M75,24a51,51,0,1,0,51,51A51,51,0,0,0,75,24"
              stroke={colors.deepBlue5}
              fill="none"
              strokeWidth="48"
            />
          </Svg>
        </View>
        <View style={styles.progressWheel}>
          <Svg viewBox="0 0 150 150" width="150" height="150" >
            <Path
              d="M75,24a51,51,0,1,0,51,51A51,51,0,0,0,75,24"
              stroke={colors.tishoGreen}
              fill="none"
              strokeWidth="48"
              strokeDasharray={[PROGRESS_DASH]}
              strokeDashoffset={svgDashOffset}
            />
          </Svg>
        </View>
        <View style={styles.progressDot}></View>
      </View>
    )
  }
  render() {

    return (
      <RippleButton rippleColor={colors.deepBlue60} rippleOpacity={0.8} style={styles.button} onPress={this.openMilestone}>
        <View style={styles.container}>
          {this.renderHeader()}
          {this.renderProgressCounter()}
          {this.renderProgressWheel()}
        </View>
      </RippleButton>
    )
  }
}

export default MilestoneItem;


const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  container: {
    width: viewSize.width - 30,
    marginHorizontal: 15,
    marginVertical: 4.5,
    paddingBottom: 15,
  },
  titleWrapper: {
    alignSelf: 'stretch',
    height: 57,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.deepBlue5,
  },
  title: {
    fontSize: 21,
    lineHeight: 27,
    color: colors.deepBlue100,
  },
  counterWrapper: {
    alignSelf: 'stretch',
    height: 30,
    justifyContent: 'center',
  },
  counter: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.deepBlue50,
  },
  shadowWheel: {
    width: 150,
    height: 150,
    position: 'absolute',
  },
  progressWheelContainer: {
    alignSelf: 'stretch',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center'
  },
  progressWheel: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    transform: [
      { rotateY: '180deg' }
    ]
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.deepBlue100,
    position: 'absolute'
  }
});
