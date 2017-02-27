import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import { bindAll, setupCachedCallback } from 'classes/utils';
import GoalsUtil from 'classes/goals-util';
import * as a from 'actions';

import Section from 'components/section/Section';
import ListMenu from 'components/list-menu/ListMenu';
import SWView from 'SWView';
import Button from 'Button';
import HOCAttachments from 'components/attachments/HOCAttachments';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import TabMenu from 'src/react/context-menus/tab-menu/TabMenu';
import InputMenu from 'context-menus/input-menu/InputMenu';
import HOCHistory from './HOCHistory';
import GoalSide from '../goal-step/GoalSide';
import './styles/goal-overview.scss';

class HOCGoalOverview extends PureComponent {
  static minWidth() {
    return 650;
  }
  static maxWidth() {
    return 900;
  }
  constructor(props) {
    super(props);
    bindAll(this, ['onHandoff', 'onNotify', 'onContext']);
    this.state = {
      loadingSteps: fromJS({}),
    };
    this.clearCB = setupCachedCallback(this.clearLoadingForStep, this);
  }
  componentDidMount() {
    const { goal, navPop } = this.props;
    if (!goal) {
      navPop();
    }
  }
  componentWillReceiveProps(nextProps) {
    const { goal, navPop } = this.props;
    const nextGoal = nextProps.goal;
    if (goal && !nextGoal) {
      navPop();
    }
  }

  onStepClick(i, e) {
    const { contextMenu, goal, removeStep, renameStep } = this.props;
    const helper = this.getHelper();
    const step = helper.getStepByIndex(i);
    const options = this.getOptionsForE(e);
    const items = [{ title: 'Rename' }, { title: 'Remove' }];
    const delegate = {
      onItemAction: (item) => {
        if (item.title === 'Rename') {
          contextMenu({
            options,
            component: InputMenu,
            props: {
              text: step.get('title'),
              buttonLabel: 'Rename',
              onResult: (title) => {
                contextMenu(null);
                if (title !== step.get('title') && title.length) {
                  this.setStepLoading(step.get('id'), true);
                  renameStep(goal.get('id'), step.get('id'), title).then(this.clearCB(step.get('id')));
                }
              },
            },
          });
        } else {
          contextMenu(null);
          this.setStepLoading(step.get('id'), true);
          removeStep(goal.get('id'), step.get('id')).then(this.clearCB(step.get('id')));
        }
      },
    };
    contextMenu({
      options,
      component: TabMenu,
      props: {
        delegate,
        items,
      },
    });
  }

  onStepCheck(i) {
    const helper = this.getHelper();
    const currentI = helper.getCurrentStepIndex();
    if (i >= currentI) {
      i += 1;
    }
    const step = helper.getStepByIndex(i);
    const _target = (step && step.get('id')) || '_complete';
    this.onHandoff(_target, 'Handoff');
  }

  onHandoff(_target, title, assignees) {
    const { navPush, goal } = this.props;
    navPush({
      component: 'GoalHandoff',
      title,
      props: {
        title,
        _target,
        assignees,
        goalId: goal.get('id'),
      },
    });
  }

  onNotify(e) {
    const { contextMenu } = this.props;
    const options = {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    };
    const items = [
      { title: 'Everyone in goal' },
      { title: 'Current step' },
      { title: 'Yourself' },
      { title: 'Choose People' },
    ];
    const delegate = {
      onItemAction: (item, side) => {
        console.log(item, side);
        if (item.id === 'choose') {

        }
      },
    };

    contextMenu({
      options,
      component: TabMenu,
      props: {
        delegate,
        items,
      },
    });

    // this.onHandoff('_notify', 'Notify', []);
  }

  onContext(e) {
    const {
      goal,
      archive,
      contextMenu,
      saveWay,
    } = this.props;
    const options = this.getOptionsForE(e);
    contextMenu({
      options,
      component: ListMenu,
      props: {
        items: [
          {
            title: 'Save as a Way',
            onClick: () => {
              const helper = this.getHelper();
              saveWay(options, helper.getObjectForWay());
            },
          },
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
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    };
  }
  getHelper() {
    const { goal, me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
  }
  setStepLoading(id, flag) {
    let { loadingSteps } = this.state;
    loadingSteps = loadingSteps.set(id, true);
    if (!flag) {
      loadingSteps = loadingSteps.delete(id);
    }
    this.setState({
      loadingSteps,
    });
  }
  clearLoadingForStep(id, res) {
    this.setStepLoading(id, false);
    console.log('ressy', res);
  }

  clickedAssign(i, e) {
    const { selectAssignees, reassignStep, goal } = this.props;
    const helper = this.getHelper();
    const step = helper.getStepByIndex(i);

    const options = this.getOptionsForE(e);
    let overrideAssignees;
    selectAssignees(options, step.get('assignees').toJS(), (newAssignees) => {
      if (newAssignees) {
        overrideAssignees = newAssignees;
      } else if (overrideAssignees) {
        if (i === helper.getCurrentStepIndex()) {
          this.onHandoff(helper.getCurrentStepId(), 'Handoff', overrideAssignees);
        } else {
          this.setStepLoading(step.get('id'), true);
          reassignStep(goal.get('id'), step.get('id'), overrideAssignees).then(this.clearCB(step.get('id')));
        }
      }
    });
  }

  renderHeader() {
    const { target } = this.props;
    return (
      <div className="add-goal__header">
        <HOCHeaderTitle target={target}>
          <Button
            text="Notify"
            onClick={this.onNotify}
          />
          <Button
            icon="ThreeDots"
            onClick={this.onContext}
          />
        </HOCHeaderTitle>
      </div>
    );
  }
  renderLeft() {
    const { goal } = this.props;

    return (
      <div className="goal-overview__column goal-overview__column--left">
        <Section title="Activity" />
        <HOCHistory goal={goal} />
      </div>
    );
  }
  renderRight() {
    const { goal } = this.props;
    const { loadingSteps } = this.state;
    return (
      <div className="goal-overview__column goal-overview__column--right">
        <GoalSide goal={goal} delegate={this} loadingSteps={loadingSteps} />
        <Section title="Attachments" />
        <HOCAttachments
          attachments={goal.get('attachments')}
          attachmentOrder={goal.get('attachment_order')}
          goalId={goal.get('id')}
          delegate={this}
        />
      </div>
    );
  }
  render() {
    const { goal } = this.props;
    if (!goal) {
      return <div />;
    }

    return (
      <SWView header={this.renderHeader()}>
        <div className="goal-overview">
          {this.renderLeft()}
          {this.renderRight()}
        </div>
      </SWView>
    );
  }
}

const { func, string } = PropTypes;

HOCGoalOverview.propTypes = {
  goal: map,
  navPush: func,
  me: map,
  navPop: func,
  target: string,
  archive: func,
  saveWay: func,
  selectAssignees: func,
  reassignStep: func,
  contextMenu: func,
};

function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  saveWay: a.ways.save,
  archive: a.goals.archive,
  contextMenu: a.main.contextMenu,
  removeStep: a.goals.removeStep,
  renameStep: a.goals.renameStep,
  reassignStep: a.goals.reassignStep,
  selectAssignees: a.goals.selectAssignees,
})(HOCGoalOverview);
