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
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import RippleButton from 'RippleButton';
import { setupDelegate } from 'swipes-core-js/classes/utils';
import { colors, viewSize } from 'globalStyles';

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
  componentWillReceiveProps(nextProps) {
    this.setState({ goals: this.getFilteredGoals(nextProps.milestone) })
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
      <Text selectable={true} style={styles.subtitle}>{numberOfCompletedGoals}/{numberOfGoals}</Text>
    );
  }
  renderHeader() {
    const { milestone } = this.props;

    return (
      <View style={styles.titleWrapper}>
        <Text selectable={true} style={styles.title}>{milestone.get('title')}</Text>
      </View>
    )
  }
  renderProgressCounter() {
    const { goals } = this.state;
    const numberOfGoals = goals.size;
    const numberOfCompletedGoals = goals.filter(g => new GoalsUtil(g).getIsCompleted()).size;

    return (
      <View style={styles.counterWrapper}>
        <Text selectable={true} style={styles.counter}>{numberOfCompletedGoals}/{numberOfGoals}</Text>
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
          <Svg viewBox="0 0 150 150" width="90" height="90" >
            <Path
              d="M75,24a51,51,0,1,0,51,51A51,51,0,0,0,75,24"
              stroke={colors.deepBlue5}
              fill="none"
              strokeWidth="48"
            />
          </Svg>
        </View>
        <View style={styles.progressWheel}>
          <Svg viewBox="0 0 150 150" width="90" height="90" >
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
        <View style={styles.button}>
          {this.renderProgressWheel()}
          <View style={styles.container}>
            {this.renderHeader()}
            {this.renderProgressCounter()}
          </View>

          <View style={styles.border} />
        </View>
      </RippleButton>
    )
  }
}

export default MilestoneItem;


const styles = StyleSheet.create({
  button: {
    flex: 1,
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
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 24,
  },
  titleWrapper: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    color: colors.deepBlue100,
  },
  counterWrapper: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingTop: 6,
  },
  counter: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500', 
    color: colors.deepBlue50,
  },
  shadowWheel: {
    width: 90,
    height: 90,
    position: 'absolute',
  },
  progressWheelContainer: {
    alignSelf: 'stretch',
    height: 90,
    justifyContent: 'center',
    alignItems: 'center'
  },
  progressWheel: {
    width: 90,
    height: 90,
    borderRadius: 90 / 2,
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
