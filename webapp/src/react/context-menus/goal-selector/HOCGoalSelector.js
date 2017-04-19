import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
// import { map, list } from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import { Creatable } from 'react-select';

import GoalRow from './GoalRow';
import './styles/goal-selector.scss';
import './styles/react-select/default.scss';

class HOCGoalSelector extends PureComponent {
  constructor(props) {
    super(props);
    setupLoading(this);
  }
  componentDidMount() {
  }
  render() {
    const { milestoneId, goals } = this.props;
    const props = {
      options: goals.sort((g1, g2) => g1.get('title').localeCompare(g2.get('title'))).map((g) => {
        const helper = new GoalsUtil(g);
        return {
          ...this.getLoading(g.get('id')),
          title: g.get('title'),
          completed: !!helper.getIsCompleted(),
          hasThisMilestone: (g.get('milestone_id') === milestoneId),
        };
      }).toArray(),
      optionRenderer: GoalRow,
    };
    return (
      <div className="goal-selector">
        <Creatable
          {...props}
        />
      </div>
    );
  }
}
// const { string } = PropTypes;

HOCGoalSelector.propTypes = {};

function mapStateToProps(state) {
  return {
    goals: state.get('goals'),
  };
}

export default connect(mapStateToProps, {
})(HOCGoalSelector);
