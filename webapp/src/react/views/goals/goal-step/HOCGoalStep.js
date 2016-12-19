import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import * as actions from 'actions';
import { fromJS } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import GoalsUtil from 'classes/goals-util';
import { setupDelegate } from 'classes/utils';
import * as Fields from 'src/react/swipes-fields';
import GoalStep from './GoalStep';

class HOCGoalStep extends Component {
  constructor(props) {
    super(props);
    const helper = this.getHelper();
    this.state = {
      data: helper.getInitialDataForStepIndex(props.stepIndex),
    };
    this.cacheFormInput = this.cacheFormInput.bind(this);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.callDelegate = setupDelegate(props.delegate);
  }
  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
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
    const { stepIndex, cacheSave, goal } = this.props;
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
    cacheSave(goal.get('id'), fromJS(data));
  }

  generateRawObj(includeLinks) {
    const { data } = this.state;
    const { step } = this.props;
    const helper = this.getHelper();
    return step.get('fields').map((field, i) => {
      let tField = field;
      if (field.get('type') === 'link') {
        if (!includeLinks) {
          return null;
        }
        tField = helper.getTargetField(field);
      }
      const Field = Fields[tField.get('type')];
      let newData = data.get(i);
      if (Field && typeof Field.saveData === 'function') {
        newData = Field.saveData(newData);
      }
      return newData;
    }).toJS();
  }
  goalStepSubmit(i) {
    const { goal, step, submit } = this.props;
    let previousSteps;

    if (i) {
      previousSteps = goal.get('steps').slice(0, goal.get('currentStepIndex'));
    }
    const data = this.generateRawObj();
    this.setState({ isSubmitting: true });
    submit(goal.get('id'), step.get('id'), data, previousSteps).then(() => {
      this.setState({ isSubmitting: false });
    });
  }
  fullscreenField(fieldIndex) {
    const {
      overlayShow,
      step,
      stepIndex,
    } = this.props;

    const helper = this.getHelper();

    const field = helper.getFieldByIndex(step, fieldIndex);
    const fieldAndSettings = helper.getFieldAndSettingsFromField(
      field,
      stepIndex,
      { fullscreen: true },
    );
    this.isFullscreen = true;
    const data = fromJS(this.generateRawObj(true)[fieldIndex]);
    overlayShow({
      component: 'Field',
      props: {
        field: fieldAndSettings[0],
        settings: fieldAndSettings[1],
        data,
        delegate: this.delegateFromField.bind(this, fieldIndex),
      },
    });
  }
  delegateFromField(index, name) {
    if (name === 'change') {
      let { data } = this.state;
      data = data.set(index, arguments[2]);
      this.setState({ data });
    }
    if (name === 'fullscreen') {
      this.fullscreenField(index);
    }
  }
  generateOptions() {
    const {
      stepIndex: i,
    } = this.props;
    const h = this.getHelper();
    const showSubmission = (h.amIAssigned(i) && h.isCurrentStep(i));

    return {
      showSubmission,
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
      isSubmitting,
    } = this.state;

    return (
      <GoalStep
        options={this.generateOptions()}
        stepIndex={stepIndex}
        step={step}
        fields={this.generateFields()}
        isSubmitting={isSubmitting}
        data={data}
        delegate={this}
      />
    );
  }
}

const { number, func, object } = PropTypes;
HOCGoalStep.propTypes = {
  stepIndex: number,
  step: map,
  delegate: object,
  cacheSave: func,
  overlayShow: func,
  submit: func,
  goal: map,
  me: map,
  cachedData: map,
  // removeThis: PropTypes.string.isRequired
};


function mapStateToProps(state, ownProps) {
  const { goalId, stepIndex } = ownProps;
  return {
    goal: state.getIn(['goals', goalId]),
    step: state.getIn(['goals', goalId, 'steps', stepIndex]),
    cachedData: state.getIn(['main', 'cache', goalId]),
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  navPop: actions.navigation.pop,
  cacheSave: actions.main.cacheSave,
  overlayShow: actions.main.overlayShow,
  submit: actions.goals.submitStep,
})(HOCGoalStep);
