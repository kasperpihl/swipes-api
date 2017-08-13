import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupDelegate } from 'react-delegate';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
// import { map, list } from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import { Creatable } from 'react-select';
import Icon from 'Icon';

import './styles/goal-selector.scss';
import './styles/react-select/default.scss';

class HOCGoalSelector extends PureComponent {
  constructor(props) {
    super(props);
    setupDelegate(this, 'onAddGoalToMilestone', 'onCreateGoal');
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
  }
  onChange(val) {
    const { goals, milestoneId, hide } = this.props;
    if (val.id) {
      this.onAddGoalToMilestone(val.id);
    } else {
      this.onCreateGoal(val.value);
    }
    hide();
  }
  renderGoalItem(option) {
    return (
      <div className="goal-row">
        {
          option.completed ? (
            <div className="goal-row__icon">
              <Icon icon="ActivityCheckmark" className="goal-row__svg" />
            </div>
          ) : (
            undefined
          )
        }
        <div className="goal-row__content">
          <div className="goal-row__title">
            {option.label}
          </div>
          <div className="goal-row__subtitle">{option.hasThisMilestone ? 'This goal is already a part of this milestone' : ''}</div>
        </div>
      </div>
    );
  }
  render() {
    const { milestoneId, goals } = this.props;
    const props = {
      options: goals.sort((g1, g2) => {
        const h1 = new GoalsUtil(g1);
        const h2 = new GoalsUtil(g2);
        if (h1.getIsCompleted() !== h2.getIsCompleted()) {
          return h1.getIsCompleted() ? 1 : -1;
        }
        return g1.get('title').localeCompare(g2.get('title'));
      }).map((g) => {
        const helper = new GoalsUtil(g);
        return {
          id: g.get('id'),
          label: g.get('title'),
          completed: !!helper.getIsCompleted(),
          disabled: (g.get('milestone_id') === milestoneId),
          hasThisMilestone: (g.get('milestone_id') === milestoneId),
        };
      }).toArray(),
      isOptionUnique: s => (s.option.label && s.option.label.length),
      promptTextCreator: s => `Create a new goal "${s}"`,
      autofocus: true,
      openOnFocus: true,
      onBlurResetsInput: false,
      onChange: this.onChange,
      optionRenderer: this.renderGoalItem,
      noResultsText: '',
      placeholder: 'Type the name of the goal',
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
