import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import * as actions from 'actions';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import GoalsUtil from 'classes/goals-util';
import { setupDelegate } from 'classes/utils';
import GoalStep from './GoalStep';

class HOCGoalStep extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.callDelegate = setupDelegate(props.delegate);
  }
  getHelper() {
    const { goal, me, cachedData } = this.props;
    return new GoalsUtil(goal, me.get('id'), cachedData);
  }

  goalStepClicked(att) {
    const { showNote } = this.props;

    if (att.get('service') === 'swipes' && att.get('type') === 'note') {
      showNote(att.get('id'));
    }
  }
  goalStepAdd() {
    const {
      loadModal,
      addToCollection,
      createNote,
      navId,
      goal,
    } = this.props;

    const modalOpt = {
      title: 'Add',
      data: {
        list: {
          items: [
            { title: 'Text/URL' },
            { title: 'Note' },
            { title: 'Upload' },
            { title: 'Find' },
          ],
        },
      },
    };
    loadModal(modalOpt, (result) => {
      if (result) {
        switch (result.item) {
          case 1: {
            createNote(navId).then((noteRes) => {
              if (noteRes && noteRes.ok) {
                addToCollection(goal.get('id'), {
                  type: 'note',
                  service: 'swipes',
                  id: noteRes.id,
                });
              }
            });
            break;
          }
          default:
            break;
        }

        // addToCollection(goal.get('id'), 'test string');
      }
    });
  }
  goalStepSubmit(i, message) {
    const { goal, step, submit } = this.props;
    let previousSteps;

    if (i) {
      previousSteps = goal.get('steps').slice(0, goal.get('currentStepIndex'));
    }

    this.setState({ isSubmitting: true });
    submit(goal.get('id'), step.get('id'), message, previousSteps).then(() => {
      this.setState({ isSubmitting: false });
    });
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
  generateHandoff() {
    const {
      users,
      stepIndex,
    } = this.props;
    const helper = this.getHelper();
    const handOff = helper.getHandoffMessageForStepIndex(stepIndex);
    let handoffObj;
    if (handOff) {
      const firstMessage = handOff.findEntry(() => true);

      if (!firstMessage) {
        return undefined;
      }

      const user = users.get(firstMessage[0]);
      const message = firstMessage[1];

      if (user && message && message.length) {
        handoffObj = {
          message,
          name: user.get('name'),
          src: user.get('profile_pic'),
        };
        if (!handoffObj.src) {
          handoffObj.svg = 'PersonIcon';
        }
      }
    }

    return handoffObj;
  }
  render() {
    const {
      step,
      stepIndex,
      goal,
    } = this.props;
    const {
      isSubmitting,
    } = this.state;

    return (
      <GoalStep
        options={this.generateOptions()}
        collection={goal.get('collection')}
        stepIndex={stepIndex}
        step={step}
        handoff={this.generateHandoff()}
        isSubmitting={isSubmitting}
        delegate={this}
      />
    );
  }
}

const { number, func, object, string } = PropTypes;
HOCGoalStep.propTypes = {
  stepIndex: number,
  step: map,
  delegate: object,
  submit: func,
  addToCollection: func,
  showNote: func,
  createNote: func,
  navId: string,
  loadModal: func,
  goal: map,
  me: map,
  users: map,
  cachedData: map,
  // removeThis: PropTypes.string.isRequired
};


function mapStateToProps(state, ownProps) {
  const { goalId, stepIndex } = ownProps;
  return {
    navId: state.getIn(['navigation', 'id']),
    goal: state.getIn(['goals', goalId]),
    users: state.get('users'),
    step: state.getIn(['goals', goalId, 'steps', stepIndex]),
    cachedData: state.getIn(['main', 'cache', goalId]),
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  loadModal: actions.modal.load,
  addToCollection: actions.goals.addToCollection,
  showNote: actions.main.note.show,
  navPop: actions.navigation.pop,
  createNote: actions.main.note.create,
  submit: actions.goals.submitStep,
})(HOCGoalStep);
