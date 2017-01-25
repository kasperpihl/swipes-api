import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import * as actions from 'actions';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import GoalsUtil from 'classes/goals-util';
import { setupDelegate, bindAll } from 'classes/utils';

import ListMenu from 'components/list-menu/ListMenu';
import Section from 'components/section/Section';
import HOCAttachments from 'components/attachments/HOCAttachments';
import HandoffHeader from './HandoffHeader';
import HandoffMessage from './HandoffMessage';
import GoalActions from './GoalActions';
import GoalSide from './GoalSide';

import './styles/goal-step';

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
    this.state = { isHandingOff: false, handoffText: '' };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, ['onCancel', 'onHandoff', 'onHandoffChange']);
    this.callDelegate = setupDelegate(props.delegate);
  }
  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.isHandingOff && !prevState.isHandingOff) {
      this.refs.handoffMessage.focus();
    }
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
  onCancel() {
    this.setState({ isHandingOff: false });
  }
  onHandoff() {
    const { completeStep, goal } = this.props;
    const { handoffText } = this.state;
    if (this.state.isHandingOff) {
      const helper = this.getHelper();
      const nextStep = helper.getNextStep();
      let nextStepId;
      if (nextStep) {
        nextStepId = nextStep.get('id');
      }
      completeStep(goal.get('id'), nextStepId, handoffText).then((res) => {
        console.log('res', res);
      });
    } else {
      this.setState({ isHandingOff: true });
    }
  }
  onHandoffChange(handoffText) {
    this.setState({ handoffText });
  }
  onAddAttachment(obj) {
    const {
      addToCollection,
      goal,
    } = this.props;
    addToCollection(goal.get('id'), obj);
  }
  getHelper() {
    const { goal, me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
  }

  mapStepToHeader(step, subtitle, index) {
    if (!step) {
      return undefined;
    }
    return {
      title: `${index}. ${step.get('title')}`,
      subtitle,
      assignees: step.get('assignees').toJS(),
    };
  }

  renderHeader() {
    const { isHandingOff } = this.state;
    const helper = this.getHelper();
    const fromIndex = helper.getCurrentStepIndex();
    const from = this.mapStepToHeader(helper.getCurrentStep(), 'Current Step', fromIndex + 1);
    const to = this.mapStepToHeader(helper.getNextStep(), 'Next step', fromIndex + 2);

    return (
      <HandoffHeader
        from={from}
        to={to}
        onChangeClick={this.onChangeClick}
        isHandingOff={isHandingOff}
      />
    );
  }

  renderHandoffMessage() {
    const { me, users } = this.props;
    let { handoffText, isHandingOff } = this.state;
    let src = me.get('profile_pic');
    let name;
    if (!isHandingOff) {
      const helper = this.getHelper();
      const handOff = helper.getHandoffMessage();
      if (handOff) {
        handoffText = handOff.message;
        const user = users.get(handOff.by);
        if (user) {
          name = user.get('name').split(' ')[0];
          src = user.get('profile_pic');
        }
      }
    }

    return (
      <Section title={name ? `${name} wrote` : undefined}>
        <HandoffMessage
          ref="handoffMessage"
          onChange={this.onHandoffChange}
          imgSrc={src}
          disabled={!isHandingOff}
          text={handoffText}
        />
      </Section>
    );
  }

  renderAttachments() {
    const { goal } = this.props;

    return (
      <Section title="Attachments">
        <HOCAttachments
          attachments={goal.get('attachments')}
          attachmentOrder={goal.get('attachment_order')}
          delegate={this}
        />
      </Section>
    );
  }
  renderActions() {
    const { isHandingOff } = this.state;
    return (
      <Section>
        <GoalActions
          onCancel={this.onCancel}
          onHandoff={this.onHandoff}
          isHandingOff={isHandingOff}
        />
      </Section>
    );
  }
  renderSide() {
    const { goal, me, sideNoteId } = this.props;
    if (sideNoteId) {
      return undefined;
    }
    return (
      <div className="goal-step__side">
        <GoalSide goal={goal} me={me} />
      </div>
    );
  }
  render() {
    const { isHandingOff } = this.state;
    let className = 'goal-step';

    if (isHandingOff) {
      className += ' goal-step__handing-off';
    }
    return (
      <div className={className}>
        <div className="goal-step__content">
          {this.renderHeader()}
          {this.renderHandoffMessage()}
          {this.renderAttachments()}
          {this.renderActions()}
        </div>

        {this.renderSide()}

      </div>
    );
  }
}

const { func, object, string } = PropTypes;
HOCGoalStep.propTypes = {
  archive: func,
  delegate: object,
  sideNoteId: string,
  addToCollection: func,
  completeStep: func,
  contextMenu: func,
  goal: map,
  me: map,
  users: map,
};


function mapStateToProps(state, ownProps) {
  const { goalId } = ownProps;
  const goal = state.getIn(['goals', goalId]);
  return {
    sideNoteId: state.getIn(['main', 'sideNoteId']),
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
  addToCollection: actions.goals.addToCollection,
  completeStep: actions.goals.completeStep,
})(HOCGoalStep);
