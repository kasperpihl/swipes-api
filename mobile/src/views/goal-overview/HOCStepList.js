import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Modal, TextInput } from 'react-native';
import ImmutableVirtualizedList from 'react-native-immutable-list-view';
import GoalsUtil from '../../../swipes-core-js/classes/goals-util';
import { setupDelegate } from '../../../swipes-core-js/classes/utils';
import HOCAssigning from '../../components/assignees/HOCAssigning';
import { colors, viewSize } from '../../utils/globalStyles';
import RippleButton from '../../components/ripple-button/RippleButton';
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
  createActionWrapper: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonWrapper: {
    position: 'absolute',
    width: 50,
    height: 50,
    top: 45,
    right: 15,
    backgroundColor: colors.deepBlue40,
    borderRadius: 50 / 2,
  },
  closeButton: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    width: viewSize.width - 30,
    height: 60,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  input: {
    width: viewSize.width - 30,
    fontSize: 15,
    lineHeight: 18,
    color: colors.deepBlue100,
    paddingHorizontal: 15,
  },
  addWrapper: {
    width: viewSize.width,
    height: 54,
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  addButton: {
    width: viewSize.width,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue100,
  },
  addButtonTitle: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: 'bold',
    color: 'white'
  }
});

class HOCStepList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fabOpen: false
    };

    setupDelegate(this, 'onComplete');

    this.renderSteps = this.renderSteps.bind(this);
    this.handleFABPress = this.handleFABPress.bind(this);
    this.onStepAdd = this.onStepAdd.bind(this);
  }
  getHelper() {
    const { goal } = this.props;

    return new GoalsUtil(goal);
  }
  handleFABPress() {
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
        <RippleButton rippleColor={colors.bgColor} rippleOpacity={0.5} style={styles.fabButton} onPress={this.handleFABPress}>
          <View style={styles.fabButton}>
            <Icon name="Plus" width="24" height="24" fill={colors.bgColor} />
          </View>
        </RippleButton>
      </View>
    )
  }
  renderCreateActionModal() {
    const { fabOpen } = this.state;

    return (
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={fabOpen}
        onRequestClose={this.handleFABPress}
      >
        <View style={styles.createActionWrapper}>
          <View style={styles.closeButtonWrapper}>
            <RippleButton rippleColor={colors.bgColor} rippleOpacity={0.5} style={styles.closeButton} onPress={this.handleFABPress}>
              <View style={styles.closeButton}>
                <Icon name="Close" width="24" height="24" fill={colors.bgColor} />
              </View>
            </RippleButton>
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.setState({text})}
              underlineColorAndroid="transparent"
              placeholder="Add a new step"
            />
          </View>
          <View style={styles.addWrapper}>
            <RippleButton rippleColor={colors.bgColor} rippleOpacity={0.5} style={styles.addButton} onPress={this.onStepAdd}>
              <View style={styles.addButton}>
                <Text style={styles.addButtonTitle}>Create a new step</Text>
              </View>
            </RippleButton>
          </View>
        </View>
      </Modal>
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
        {this.renderCreateActionModal()}
      </View>
    );
  }
}

export default HOCStepList;
