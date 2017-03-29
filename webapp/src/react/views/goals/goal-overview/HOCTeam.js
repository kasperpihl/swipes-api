import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { map } from 'react-immutable-proptypes';
import HOCAssigning from 'components/assigning/HOCAssigning';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
/* global msgGen */

import './styles/team.scss';

class HOCTeam extends PureComponent {
  getHelper() {
    const { goal } = this.props;
    return new GoalsUtil(goal);
  }
  renderTeamImages(assignees) {
    return (
      <HOCAssigning
        assignees={assignees}
        maxImages={assignees.size}
        rounded
      />
    );
  }
  renderTeamLabel(assignees, helper) {
    const { me } = this.props;
    let string;
    if (helper.getIsCompleted()) {
      string = ' completed ';
    } else {
      string = assignees.size > 1 ? ' are ' : ' is ';
      if (assignees.size === 1 && assignees.get(0) === me.get('id')) {
        string = ' are ';
      }
      string += 'working on ';
    }
    string += 'this goal';
    return (
      <div className="team__label">
        {msgGen.users.getNames(assignees)}{string}
      </div>
    );
  }
  render() {
    const helper = this.getHelper();
    const assignees = helper.getAllInvolvedAssignees();

    return (
      <div className="team">
        <div className="team__images">
          {this.renderTeamImages(assignees)}
        </div>
        {this.renderTeamLabel(assignees, helper)}
      </div>
    );
  }
}
// const { string } = PropTypes;

HOCTeam.propTypes = {
  goal: map,
  me: map,
};

function mapStateToProps(state) {
  return {
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
})(HOCTeam);
