import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { bindAll } from 'classes/utils';
import GoalsUtil from 'classes/goals-util';
// import * as a from 'actions';

import Section from 'components/section/Section';
import SWView from 'SWView';
import Button from 'Button';
import HOCAttachments from 'components/attachments/HOCAttachments';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import HOCTeam from './HOCTeam';
import HOCLastUpdate from './HOCLastUpdate';
import GoalSide from '../goal-step/GoalSide';
import './styles/goal-overview.scss';

class HOCGoalOverview extends PureComponent {
  static minWidth() {
    return 650;
  }
  constructor(props) {
    super(props);
    bindAll(this, ['onHandoff', 'onNotify']);
  }
  componentDidMount() {
  }
  onHandoff() {
    const { navPush, goal } = this.props;
    navPush({
      component: 'GoalHandoff',
      title: 'Handoff',
      props: {
        goalId: goal.get('id'),
      },
    });
  }
  onNotify() {
    const { navPush, goal } = this.props;
    navPush({
      component: 'GoalHandoff',
      title: 'Notify',
      props: {
        notify: true,
        goalId: goal.get('id'),
      },
    });
  }
  getHelper() {
    const { goal, me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
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
        </HOCHeaderTitle>
      </div>
    );
  }
  renderLeft() {
    const { goal } = this.props;
    const helper = this.getHelper();
    const handoff = helper.getLastHandoff();
    return (
      <div className="goal-overview__column goal-overview__column--left">
        <Section title="Latest update" />
        <HOCLastUpdate handoff={handoff} />
        <HOCAttachments
          attachments={goal.get('attachments')}
          attachmentOrder={goal.get('attachment_order')}
          goalId={goal.get('id')}
          delegate={this}
        />
      </div>
    );
  }
  renderRight() {
    const { goal } = this.props;
    return (
      <div className="goal-overview__column goal-overview__column--right">
        <Section title="Team" />
        <HOCTeam goal={goal} />
        <GoalSide goal={goal} />
      </div>
    );
  }
  renderHandoffBar() {
    const helper = this.getHelper();

    if (!helper.amIAssigned()) {
      return undefined;
    }

    return (
      <div className="handoff-bar">
        <div className="handoff-bar__label">It’s your turn to handoff work</div>
        <div className="handoff-bar__actions">
          <Button
            text="Handoff"
            primary
            className="handoff-bar__button"
            onClick={this.onHandoff}
          />
        </div>
      </div>
    );
  }
  render() {
    return (
      <SWView header={this.renderHeader()} footer={this.renderHandoffBar()}>
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
  target: string,
};

function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
})(HOCGoalOverview);
