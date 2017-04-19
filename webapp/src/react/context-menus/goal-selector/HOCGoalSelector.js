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
import 'react-select/dist/react-select.css';

import GoalRow from './GoalRow';
import './styles/goal-selector.scss';

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
      options: goals.sort((g1, g2) => {
        return g1.get('title').localeCompare(g2.get('title'));
      }).map((g) => {
        const helper = new GoalsUtil(g)
        return {
          ...this.getLoading(g.get('id')),
          title: g.get('title'),
          completed: !!helper.getIsCompleted(),
          hasThisMilestone: (g.get('milestone_id') === milestoneId),
        };

      }).toArray(),
      ref: function setValue(selectInstance) {
        const originalSetValue = selectInstance.setValue;
        console.log('here1!');
        selectInstance.setValue = function() {
          originalSetValue.apply(this, arguments);
          console.log('here!');
          selectInstance.setState({
            isOpen: true,
          });
        }
      },
      optionRenderer: GoalRow,
    }
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
    goals: state.get('goals')
  };
}

export default connect(mapStateToProps, {
})(HOCGoalSelector);
