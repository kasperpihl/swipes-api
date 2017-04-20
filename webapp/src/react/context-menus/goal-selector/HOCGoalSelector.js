import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupDelegate } from 'swipes-core-js/classes/utils';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
// import { map, list } from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import { Creatable } from 'react-select';

import './styles/goal-selector.scss';
import './styles/react-select/default.scss';

class HOCGoalSelector extends PureComponent {
  constructor(props) {
    super(props);
    setupDelegate(this);
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
  }
  onChange(val) {
    const { goals, milestoneId, hide } = this.props;
    if(val.id) {
      this.callDelegate('onAddGoalToMilestone', val.id);
    } else {
      this.callDelegate('onCreateGoal', val.value);
    }
    hide();
  }
  renderGoalItem(option) {
    return (
      <div className="goal-row">
        {option.label}
      </div>
    )
  }
  render() {
    const { milestoneId, goals } = this.props;
    const props = {
      options: goals.sort((g1, g2) => g1.get('title').localeCompare(g2.get('title'))).map((g) => {
        const helper = new GoalsUtil(g);
        return {
          id: g.get('id'),
          label: g.get('title'),
          completed: !!helper.getIsCompleted(),
          disabled: (g.get('milestone_id') === milestoneId),
          hasThisMilestone: (g.get('milestone_id') === milestoneId),
        };
      }).toArray(),
      isOptionUnique: (s) => (s.option.label && s.option.label.length),
      promptTextCreator: (s) => `Create a new goal "${s}"`,
      autofocus: true,
      openOnFocus: true,
      onBlurResetsInput: false,
      onChange: this.onChange,
      optionRenderer: this.renderGoalItem,
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
  addGoalToMilestone: ca.milestones.addGoal,
})(HOCGoalSelector);
