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
    const { goal, me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
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
  generateHandoff() {
    const {
      users,
      goal,
    } = this.props;
    const helper = this.getHelper();
    const handOff = helper.getHandoffMessage();
    let handoffObj;
    if (handOff) {
      const {
        message,
        by,
        at,
      } = handOff;
      const user = users.get(handOff.by);

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
      me,
      goal,
    } = this.props;
    const {
      isSubmitting,
    } = this.state;

    return (
      <GoalStep
        goal={goal}
        handoff={this.generateHandoff()}
        me={me}
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
  // removeThis: PropTypes.string.isRequired
};


function mapStateToProps(state, ownProps) {
  const { goalId } = ownProps;
  const goal = state.getIn(['goals', goalId]);
  return {
    goal,
    users: state.get('users'),
    step: goal.getIn(['steps', goal.getIn(['status', 'current_step_id'])]),
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
