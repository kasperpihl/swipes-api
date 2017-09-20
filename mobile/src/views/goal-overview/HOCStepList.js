import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Vibration } from 'react-native';
import { connect } from 'react-redux';
import { fromJS } from 'immutable'; 
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { ImmutableListView } from 'react-native-immutable-list-view';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import { setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import HOCAssigning from 'components/assignees/HOCAssigning';
import EmptyListFooter from 'components/empty-list-footer/EmptyListFooter';
import { colors, viewSize } from 'globalStyles';
import RippleButton from 'RippleButton';
import CreateNewItemModal from 'modals/CreateNewItemModal';
import Icon from 'Icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  step: {
    flex: 1,
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
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
    this.state = {};

    setupDelegate(this, 'onComplete');

    this.renderSteps = this.renderSteps.bind(this);
    this.renderListFooter = this.renderListFooter.bind(this);
    this.onPressCached = setupCachedCallback(this.onPress, this);
    this.onModalGoalActionCached = setupCachedCallback(this.onModalGoalAction, this);
    this.handleModalState = this.handleModalState.bind(this);
    this.onStepAdd = this.onStepAdd.bind(this);
  }
  getHelper() {
    const { goal } = this.props;

    return new GoalsUtil(goal);
  }
  onModalGoalAction(step, i) {
    const { showModal, assignStep, goal } = this.props;

    if (i.get('index') === 'complete') {
      this.onComplete(step);
      showModal();
    } else if (i.get('index') === 'assign') {
      const assignees = step.get('assignees');
      
      // assignStep(goal.get('id'), step.get('id'), overrideAssignees).then((res)

      showModal();
    }

  }
  onPress(step) {
    const { showModal, goal } = this.props;
    const helper = this.getHelper();
    const completeLabel = helper.getIsStepCompleted(step) ? 'Incomplete step' : 'Complete step';

    const modal = {
      title: 'Step actions',
      onClick: this.onModalGoalActionCached(step),
      items: fromJS([
        {
          title: completeLabel,
          index: 'complete',
        },
        {
          title: 'Reassign step',
          index: 'assign',
        },
      ]),
    };

    showModal(modal);
  }
  onModalCreateAction(title, assignees, milestoneId ) {
    const { addStep, goal } = this.props;

    addStep(goal.get('id'), title, assignees).then((res) => {});
  }
  handleModalState() {
    const { navPush } = this.props;

    navPush({
      id: 'CreateNewItemModal',
      title: 'CreateNewItemModal',
      props: {
        title: '',
          defAssignees: [this.props.myId],
          placeholder: "Add a new step",
          actionLabel: "Add step",
          delegate: this
      }
    })
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
      <RippleButton rippleColor={colors.deepBlue40} rippleOpacity={0.8} onPress={this.onPressCached(step)}>
        <View style={styles.step}>
          <View style={[styles.indicator, indicatorStyles]}>
            <Text selectable={true} style={[styles.indicatorLabel, indicatorLabelStyles]}>{i + 1}</Text>
          </View>
          <View style={styles.title}>
            <Text selectable={true} style={[styles.titleLabel, titleStyles]}>{title}</Text>
          </View>
          <View style={[styles.assignees, { opacity }]}>
            <HOCAssigning assignees={step.get('assignees')} maxImages={1} />
          </View>
        </View>
      </RippleButton>
    );
  }
  renderEmpty() {

    return <View />
  }
  renderListFooter() {

    return (
      <View>
        <RippleButton onPress={this.handleModalState}>
          <View style={{width: viewSize.width - 30, height: 60, flexDirection: 'row', marginHorizontal: 15, alignItems: 'center'}}>
            <View style={styles.indicator}>
              <Text selectable={true} style={styles.indicatorLabel}>{this.props.steps.size + 1}</Text>
            </View>
            <Text selectable={true} style={{ paddingLeft: 22, fontSize: 15, lineHeight: 24, color: colors.deepBlue50 }}>Add a step</Text>
          </View>
        </RippleButton>
        <EmptyListFooter />
      </View>
    )
  }
  render() {
    const { steps, isLoading, getLoading } = this.props;

    return (
      <View style={styles.container}>
        <ImmutableListView
          immutableData={steps.map(s => s.set('title', isLoading(s.get('id')) ? getLoading(s.get('id')).loadingLabel : s.get('title')))}
          renderRow={(step, sectionIndex, stepIndex) => this.renderSteps(step, sectionIndex, stepIndex)}
          renderEmptyInList={this.renderEmpty}
          renderFooter={this.renderListFooter}
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
  assignStep: ca.steps.assign,
  showModal: a.modals.show,
})(HOCStepList);
