import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Modal, TextInput } from 'react-native';
import { connect } from 'react-redux';
import * as ca from '../../../swipes-core-js/actions';
import ImmutableVirtualizedList from 'react-native-immutable-list-view';
import GoalsUtil from '../../../swipes-core-js/classes/goals-util';
import { setupDelegate } from '../../../swipes-core-js/classes/utils';
import HOCAssigning from '../../components/assignees/HOCAssigning';
import { colors, viewSize } from '../../utils/globalStyles';
import RippleButton from '../../components/ripple-button/RippleButton';
import CreateNewItemModal from '../../modals/CreateNewItemModal';
import Icon from '../../components/icons/Icon';

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
    width: 30,
    height: 30,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.deepBlue90,
  },
  indicatorCompleted: {
    backgroundColor: colors.greenColor,
    borderColor: colors.greenColor,
    borderWidth: 1,
  },
  indicatorLabel: {
    fontSize: 12,
    fontWeight: 'bold',
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
    fontSize: 15,
    color: colors.deepBlue100,
  },
  titleCompleted: {
    color: colors.deepBlue50,
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

class HOCStepList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fabOpen: false
    };

    setupDelegate(this, 'onComplete');

    this.renderSteps = this.renderSteps.bind(this);
    this.handleModalState = this.handleModalState.bind(this);
    this.onStepAdd = this.onStepAdd.bind(this);
  }
  getHelper() {
    const { goal } = this.props;

    return new GoalsUtil(goal);
  }
  onModalCreateAction(title, assignees, milestoneId ) {
    const { addStep, goal } = this.props;

    addStep(goal.get('id'), title, assignees).then((res) => {

      if(res.ok){
        this.handleModalState()
      }
    });
  }
  handleModalState() {
    const { fabOpen } = this.state;

    if (!fabOpen) {
      this.setState({ fabOpen: true })
    } else {
      this.setState({ fabOpen: false })
    }
  }
  onStepAdd() {

  }
  renderSteps(step, secI, i) {
    const { isLoading, getLoading } = this.props;
    const helper = this.getHelper();
    let indicatorStyles;
    let indicatorLabelStyles;
    let titleStyles;
    let title = step.get('title');
    let opacity = 1;

    if (isLoading(step.get('id'))) {
      title = getLoading(step.get('id')).loadingLabel;
    }

    if (helper.getIsStepCompleted(step)) {
      indicatorStyles = styles.indicatorCompleted;
      indicatorLabelStyles = styles.indicatorLabelCompleted;
      titleStyles = styles.titleCompleted;
      opacity = 0.3;
    }

    return (
      <RippleButton rippleColor={colors.deepBlue40} rippleOpacity={0.8} onPress={this.onCompleteCached(step)}>
        <View style={styles.step}>
          <View style={[styles.indicator, indicatorStyles]}>
            <Text style={[styles.indicatorLabel, indicatorLabelStyles]}>{i + 1}</Text>
          </View>
          <View style={styles.title}>
            <Text style={[styles.titleLabel, titleStyles]}>{title}</Text>
          </View>
          <View style={[styles.assignees, { opacity }]}>
            <HOCAssigning assignees={step.get('assignees')} />
          </View>
        </View>
      </RippleButton>
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
    )
  }
  render() {
    const { steps, isLoading, getLoading } = this.props;

    return (
      <View style={styles.container}>
        <ImmutableVirtualizedList
          immutableData={steps.map(s => s.set('title', isLoading(s.get('id')) ? getLoading(s.get('id')).loadingLabel : s.get('title')))}
          renderRow={(step, sectionIndex, stepIndex) => this.renderSteps(step, sectionIndex, stepIndex)}
        />
        {this.renderFAB()}
        <CreateNewItemModal
          modalState={this.state.fabOpen}
          defAssignees={[this.props.myId]}
          placeholder="Add a new step"
          actionLabel="Add step"
          delegate={this}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {

  };
}

export default connect(mapStateToProps, {
  addStep: ca.steps.add,
})(HOCStepList);
