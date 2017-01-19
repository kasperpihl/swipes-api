import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import * as actions from 'actions';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import GoalsUtil from 'classes/goals-util';
import { setupDelegate } from 'classes/utils';
import ListMenu from 'components/list-menu/ListMenu';
import GoalStep from './GoalStep';


class HOCGoalStep extends Component {
  static contextButtons() {
    return [{
      component: 'Button',
      props: {
        icon: 'ThreeDots',
      },
    }];
  }
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.callDelegate = setupDelegate(props.delegate);
  }
  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
  }
  onContextClick(i, e) {
    const {
      goal,
      archive,
      contextMenu,
    } = this.props;

    contextMenu({
      options: {
        boundingRect: e.target.getBoundingClientRect(),
        alignX: 'right',
      },
      component: ListMenu,
      props: {
        items: [
          {
            title: 'Archive Goal',
            onClick: () => {
              archive(goal.get('id'));
              contextMenu(null);
            },
          },
        ],
      },
    });
  }
  getHelper() {
    const { goal, me, cachedData } = this.props;
    return new GoalsUtil(goal, me.get('id'), cachedData);
  }

  goalStepAddAttachment(obj) {
    const {
      addToCollection,
      goal,
    } = this.props;
    addToCollection(goal.get('id'), obj);
  }
  goalStepSubmit(i, message) {
    const { goal, step, submit, overlay } = this.props;
    let previousSteps;

    if (i) {
      previousSteps = goal.get('steps').slice(0, goal.get('currentStepIndex'));
    }

    this.setState({ isSubmitting: true });
    submit(goal.get('id'), step.get('id'), message, previousSteps).then((didSubmit) => {
      this.setState({ isSubmitting: false });
      if (didSubmit) {
        overlay({
          component: 'Completed',
          opaque: true,
          props: {
            onClose: () => {
              console.log('closing the overlay, we should figure out how to animate progress here');
            },
          },
        });
      }
    });
  }
  generateStatus() {
    const helper = this.getHelper();
    return helper.getStatusForCurrentStep();
  }
  generateOptions() {
    const {
      goal,
    } = this.props;
    const i = goal.get('currentStepIndex');
    const h = this.getHelper();
    const showSubmission = (h.amIAssigned(i) && h.isCurrentStep(i));

    return {
      showSubmission,
    };
  }
  generateHandoff() {
    const {
      users,
      goal,
    } = this.props;
    const helper = this.getHelper();
    const handOff = helper.getHandoffMessageForStepIndex(goal.get('currentStepIndex'));
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
          handoffObj.svg = 'Person';
        }
      }
    }

    return handoffObj;
  }
  render() {
    const {
      step,
      goal,
    } = this.props;
    const {
      isSubmitting,
    } = this.state;

    return (
      <GoalStep
        goal={goal}
        options={this.generateOptions()}
        collection={goal.get('collection')}
        stepIndex={goal.get('currentStepIndex')}
        step={step}
        status={this.generateStatus()}
        handoff={this.generateHandoff()}
        isSubmitting={isSubmitting}
        delegate={this}
      />
    );
  }
}

const { func, object } = PropTypes;
HOCGoalStep.propTypes = {
  step: map,
  archive: func,
  delegate: object,
  submit: func,
  addToCollection: func,
  clickLink: func,
  contextMenu: func,
  overlay: func,
  goal: map,
  me: map,
  users: map,
  cachedData: map,
  // removeThis: PropTypes.string.isRequired
};


function mapStateToProps(state, ownProps) {
  const { goalId } = ownProps;
  const goal = state.getIn(['goals', goalId]);
  return {
    goal,

    users: state.get('users'),
    step: goal.getIn(['steps', goal.get('currentStepIndex')]),
    cachedData: state.getIn(['main', 'cache', goalId]),
    me: state.get('me'),
  };
}
export default connect(mapStateToProps, {
  addLinkMenu: actions.links.addMenu,
  overlay: actions.main.overlay,
  contextMenu: actions.main.contextMenu,
  archive: actions.goals.archive,
  clickLink: actions.links.click,
  getLinks: actions.links.get,
  addToCollection: actions.goals.addToCollection,
  submit: actions.goals.submitStep,
})(HOCGoalStep);
