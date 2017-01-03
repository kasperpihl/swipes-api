import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import * as actions from 'actions';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import AttachmentMenu from 'components/attachment-menu/AttachmentMenu';
import GoalsUtil from 'classes/goals-util';
import { setupDelegate } from 'classes/utils';
import ListMenu from 'components/list-menu/ListMenu';
import GoalStep from './GoalStep';


class HOCGoalStep extends Component {
  static contextButtons() {
    return [{
      component: 'Button',
      props: {
        icon: 'ThreeDotsIcon',
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

  goalStepClicked(att) {
    const { clickedAttachment } = this.props;
    clickedAttachment(att);
  }
  goalStepAdd(e) {
    const {
      contextMenu,
      addToCollection,
      createNote,
      navId,
      overlay,
      goal,
    } = this.props;

    contextMenu({
      component: AttachmentMenu,
      options: {
        boundingRect: e.target.getBoundingClientRect(),
        alignY: 'center',
        positionX: -15,
      },
      props: {
        callback: (type, data) => {
          if (type === 'note' && data && data.length) {
            createNote(navId, data).then((noteRes) => {
              if (noteRes && noteRes.ok) {
                addToCollection(goal.get('id'), {
                  type: 'note',
                  service: 'swipes',
                  id: noteRes.id,
                  title: data,
                });
              }
            });
          }
          if (type === 'link' && data && data.length) {
            addToCollection(goal.get('id'), {
              type: 'url',
              service: 'swipes',
              id: data,
              title: data,
            });
          }
          if (type === 'find') {
            overlay({
              component: 'Find',
            });
          }
          contextMenu(null);
        },
      },
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
          handoffObj.svg = 'PersonIcon';
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

const { number, func, object, string } = PropTypes;
HOCGoalStep.propTypes = {
  step: map,
  archive: func,
  delegate: object,
  submit: func,
  addToCollection: func,
  clickedAttachment: func,
  createNote: func,
  navId: string,
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
    navId: state.getIn(['navigation', 'id']),
    goal,
    users: state.get('users'),
    step: goal.getIn(['steps', goal.get('currentStepIndex')]),
    cachedData: state.getIn(['main', 'cache', goalId]),
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  contextMenu: actions.main.contextMenu,
  archive: actions.goals.archive,
  clickedAttachment: actions.goals.clickedAttachment,
  overlay: actions.main.overlay,
  addToCollection: actions.goals.addToCollection,
  showNote: actions.main.note.show,
  navPop: actions.navigation.pop,
  createNote: actions.main.note.create,
  submit: actions.goals.submitStep,
})(HOCGoalStep);
