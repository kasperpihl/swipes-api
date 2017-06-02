import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ImmutableListView from 'react-native-immutable-list-view';
import GoalsUtil from '../../../swipes-core-js/classes/goals-util';
import { setupDelegate } from '../../../swipes-core-js/classes/utils';
import HOCAssigning from '../../components/assignees/HOCAssigning';
import { colors } from '../../utils/globalStyles';
import RippleButton from '../../components/ripple-button/RippleButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  step: {
    flex: 1,
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.deepBlue5,
  },
  indicator: {
    width: 33,
    height: 33,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.deepBlue90,
  },
  indicatorCompleted: {
    backgroundColor: colors.greenColor,
    borderColor: colors.greenColor,
    borderWidth: 2,
  },
  indicatorLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.deepBlue90,
  },
  indicatorLabelCompleted: {
    color: 'white',
  },
  title: {
    flex: 1,
    paddingLeft: 21,
  },
  titleLabel: {
    fontSize: 16.5,
    color: colors.deepBlue90,
  },
  titleCompleted: {
    color: colors.deepBlue30,
  },
});

class HOCStepList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this);
    this.callDelegate.bindAll('onComplete');
  }
  getHelper() {
    const { goal } = this.props;

    return new GoalsUtil(goal);
  }
  renderSteps(step, secI, i, completed) {
    const helper = this.getHelper();
    let indicatorStyles;
    let indicatorLabelStyles;
    let titleStyles;

    if (helper.getIsStepCompleted(step)) {
      indicatorStyles = styles.indicatorCompleted;
      indicatorLabelStyles = styles.indicatorLabelCompleted;
      titleStyles = styles.titleCompleted;
    }

    return (
      <RippleButton rippleColor={colors.deepBlue40} rippleOpacity={0.8} onPress={this.onCompleteCached(step)}>
        <View style={styles.step}>
          <View style={[styles.indicator, indicatorStyles]}>
            <Text style={[styles.indicatorLabel, indicatorLabelStyles]}>{i + 1}</Text>
          </View>
          <View style={styles.title}>
            <Text style={[styles.titleLabel, titleStyles]}>{step.get('title')}</Text>
          </View>
          <View style={styles.assignees}>
            <HOCAssigning assignees={step.get('assignees')} />
          </View>
        </View>
      </RippleButton>
    );
  }
  render() {
    const { steps, completed, delegate } = this.props;

    return (
      <View style={styles.container}>
        <ImmutableListView
          immutableData={steps}
          renderRow={(step, sectionIndex, stepIndex) => this.renderSteps(step, sectionIndex, stepIndex, completed, delegate)}
        />
      </View>
    );
  }
}

export default HOCStepList;
