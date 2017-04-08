import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ImmutableListView from 'react-native-immutable-list-view';
import HOCAssigning from '../../components/assignees/HOCAssigning';
import { colors } from '../../utils/globalStyles';
import EmptyListFooter from '../../components/empty-list-footer/EmptyListFooter';
import FeedbackButton from '../../components/feedback-button/FeedbackButton';

class HOCStepList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  completeStep() {
    // console.log('complete step');
  }
  renderSteps(step, secI, i, completed) {
    const completedI = completed - 1;
    const currentStepIndex = completed;
    let indicatorStyles;
    let indicatorLabelStyles;
    let titleStyles;

    if (i <= completedI) {
      indicatorStyles = styles.indicatorCompleted;
      indicatorLabelStyles = styles.indicatorLabelCompleted;
      titleStyles = styles.titleCompleted;
    } else if (i === currentStepIndex) {
      indicatorStyles = styles.indicatorCurrent;
      indicatorLabelStyles = styles.indicatorLabelCurrent;
      titleStyles = styles.titleCurrent;
    } else {
      indicatorStyles = styles.indicatorFuture;
      indicatorLabelStyles = styles.indicatorLabelFuture;
      titleStyles = styles.titleFuture;
    }

    return (
      <FeedbackButton onPress={this.completeStep}>
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
      </FeedbackButton>
    );
  }
  renderFooter() {
    return <EmptyListFooter />;
  }
  render() {
    const { steps, completed, delegate } = this.props;

    return (
      <View style={styles.container}>
        <ImmutableListView
          immutableData={steps}
          renderRow={(step, sectionIndex, stepIndex) => this.renderSteps(step, sectionIndex, stepIndex, completed, delegate)}
          renderFooter={this.renderFooter}
        />
      </View>
    );
  }
}

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
  },
  indicatorCompleted: {
    backgroundColor: colors.greenColor,
  },
  indicatorCurrent: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.deepBlue90,
  },
  indicatorFuture: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.deepBlue30,
  },
  indicatorLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  indicatorLabelCompleted: {
    color: 'white',
  },
  indicatorLabelCurrent: {
    color: colors.deepBlue90,
  },
  indicatorLabelFuture: {
    color: colors.deepBlue30,
  },
  title: {
    flex: 1,
    paddingLeft: 21,
  },
  titleLabel: {
    fontSize: 16.5,
  },
  titleCompleted: {
    color: colors.deepBlue30,
  },
  titleCurrent: {
    color: colors.deepBlue90,
  },
  titleFuture: {
    color: colors.deepBlue30,
  },
});

export default HOCStepList;
