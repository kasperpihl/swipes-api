import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import * as a from 'actions';

import Section from 'components/section/Section';
import SWView from 'SWView';
import HOCAttachments from 'components/attachments/HOCAttachments';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import HOCTeam from './HOCTeam';
import GoalSide from '../goal-step/GoalSide';
import './styles/goal-overview.scss';

class HOCGoalOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  renderHeader() {
    const { target } = this.props;
    return (
      <div className="add-goal__header">
        <HOCHeaderTitle target={target} />
      </div>
    );
  }
  renderLeft() {
    const { goal } = this.props;
    return (
      <div className="goal-overview__column goal-overview__column--left">
        <Section title="Latest update" />
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
        <Section title="Team">
          <HOCTeam goal={goal} />
        </Section>
        <GoalSide goal={goal} />
      </div>
    );
  }
  renderHandoffBar() {

  }
  render() {
    return (
      <SWView header={this.renderHeader()}>
        <div className="goal-overview">
          {this.renderLeft()}
          {this.renderRight()}
          {this.renderHandoffBar()}
        </div>
      </SWView>
    );
  }
}
const { string } = PropTypes;

HOCGoalOverview.propTypes = {
  goal: map,
};

function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
  };
}

export default connect(mapStateToProps, {
})(HOCGoalOverview);
