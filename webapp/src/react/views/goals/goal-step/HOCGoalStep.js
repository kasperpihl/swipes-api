import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import * as actions from 'actions';
import { fromJS } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import GoalsUtil from 'classes/goals-util';
import * as Fields from 'src/react/swipes-fields';
import GoalStep from './GoalStep';

class HOCGoalStep extends Component {
  constructor(props) {
    super(props);
    const helper = this.getHelper();
    this.state = {
      data: helper.getInitialDataForStepIndex(props.stepIndex),
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.cacheFormInput);
  }
  componentWillUnmount() {
    this.cacheFormInput();
    window.removeEventListener('beforeunload', this.cacheFormInput);
  }
  getHelper() {
    const { goal, me, cachedData } = this.props;
    return new GoalsUtil(goal, me.get('id'), cachedData);
  }
  cacheFormInput() {
    const { stepIndex } = this.props;
    const helper = this.getHelper();
    const data = {
      stepIndex: helper.currentStepIndex(),
      runCounter: helper.runCounter(),
    };
    const amIAssigned = helper.amIAssigned(stepIndex);
    const isCurrent = helper.isCurrentStep(stepIndex);
    if (amIAssigned && isCurrent) {
      data.data = this.generateRawObj(helper);
    }
    // this.callDelegate('goalStepCacheData', fromJS(data));
  }

  generateRawObj() {
    const { data } = this.state;
    const { step } = this.props;
    return step.get('fields').map((field, i) => {
      if (field.get('type') === 'link') {
        return null;
      }
      const Field = Fields[field.get('type')];
      let newData = data.get(i);
      if (Field && typeof Field.saveData === 'function') {
        newData = Field.saveData(data);
      }
      return newData;
    }).toJS();
  }
  goalStepCacheData() {

  }
  goalStepSubmit(goalStep, i) {
    const { goal, step } = this.props;
    let previousSteps;

    if (i) {
      previousSteps = goal.get('steps').slice(0, goal.get('currentStepIndex'));
    }
    const data = this.generateRawObj();
    this.setState({ isSubmitting: true });
    this.callDelegate('stepSubmit', step.get('id'), data, previousSteps, () => {
      this.setState({ isSubmitting: false });
    });
  }
  goalStepUpdatedFieldData(goalStep, fieldIndex, fieldData) {
    let { data } = this.state;
    data = data.set(fieldIndex, fieldData);
    this.setState({ data });
  }
  generateOptions() {
    return {
      showSubmission: false,
    };
  }
  generateFields() {
    const {
      step,
      stepIndex,
    } = this.props;
    const helper = this.getHelper();
    return step.get('fields').map((field) => {
      // Get icon/iconColor.
      const iconAndColor = helper.getIconWithColorForField(field, stepIndex);

      // Field-swap for links. Check if field is a link and find the link
      const fAndS = helper.getFieldAndSettingsFromField(field, stepIndex);
      field = fAndS[0];

      return field.merge({
        icon: iconAndColor[0],
        iconColor: iconAndColor[1],
        settings: fAndS[1],
      });
    });
  }

  render() {
    const {
      step,
      stepIndex,
    } = this.props;
    const {
      data,
    } = this.state;

    return (
      <GoalStep
        options={this.generateOptions()}
        stepIndex={stepIndex}
        step={step}
        fields={this.generateFields()}
        data={data}
        delegate={this}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { goalId, stepIndex } = ownProps;
  return {
    goal: state.getIn(['goals', goalId]),
    step: state.getIn(['goals', goalId, 'steps', stepIndex]),
    cachedData: state.getIn(['main', 'cache', goalId]),
    me: state.get('me'),
  };
}

const { number } = PropTypes;
HOCGoalStep.propTypes = {
  stepIndex: number,
  step: map,
  goal: map,
  me: map,
  cachedData: map,
  // removeThis: PropTypes.string.isRequired
};

const ConnectedHOCGoalStep = connect(mapStateToProps, {
  navPop: actions.navigation.pop,
})(HOCGoalStep);
export default ConnectedHOCGoalStep;
