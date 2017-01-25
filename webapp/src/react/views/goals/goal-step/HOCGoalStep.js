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
    this.setState({ isHandingOff: true });
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

  render() {
    return (
      <div className="goal-step">

        <div className="goal-step__content">
          {this.renderHeader()}
          {this.renderHandoffMessage()}
          {this.renderAttachments()}
          {this.renderActions()}
        </div>
      </div>
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
  addToCollection: actions.goals.addToCollection,
  completeStep: actions.goals.completeStep,
})(HOCGoalStep);
