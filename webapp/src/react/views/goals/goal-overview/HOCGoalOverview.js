import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { bindAll } from 'classes/utils';
import GoalsUtil from 'classes/goals-util';
import * as a from 'actions';

import Section from 'components/section/Section';
import ListMenu from 'components/list-menu/ListMenu';
import SWView from 'SWView';
import Button from 'Button';
import HOCAttachments from 'components/attachments/HOCAttachments';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
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

  onStepClick(i) {
    console.log('click!', i);
  }

  onStepCheck(i) {
    const helper = this.getHelper();
    const currentI = helper.getCurrentStepIndex();
    console.log(i, currentI);
    if (i >= currentI) {
      i += 1;
    }
    const step = helper.getStepByIndex(i);
    const _target = (step && step.get('id')) || '_complete';
    this.onHandoff(_target, 'Handoff');
  }

  onHandoff(_target, title) {
    const { navPush, goal } = this.props;
    navPush({
      component: 'GoalHandoff',
      title,
      props: {
        _target,
        goalId: goal.get('id'),
      },
    });
  }

  onNotify() {
    this.onHandoff('_notify', 'Notify');
  }

  onContext(e) {
    const {
      goal,
      archive,
      contextMenu,
      saveWay,
    } = this.props;
    const options = {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    };
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
            title: 'Complete Goal',
            onClick: () => {

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

  getHelper() {
    const { goal, me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
  }

  clickedAssign(i) {
    console.log('clicked assign', i);
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
    return (
      <div className="goal-overview__column goal-overview__column--right">
        <GoalSide goal={goal} delegate={this} />
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
})(HOCGoalOverview);
