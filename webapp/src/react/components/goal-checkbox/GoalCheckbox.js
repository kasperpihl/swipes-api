import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';
// import Button from 'Button';
import Icon from 'Icon';
import './styles/goal-checkbox.scss';

class GoalCheckbox extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      rendered: false
    }

    setupDelegate(this, 'onGoalCheckboxClick');
  }
  render() {
    const { completed, loading } = this.props;
    const { rendered } = this.state;

    let className = 'goal-checkbox';

    if (completed) {
      className += ' goal-checkbox--completed'
    }

    if (loading) {
      className += ' goal-checkbox--loading'
    }

    return (
      <div className={className} onClick={this.onGoalCheckboxClick}>
        <Icon icon="ChecklistCheckmark" className="goal-checkbox__svg" />
        <div className="goal-checkbox__loader">
          <svg className="goal-checkbox__spinner" viewBox="0 0 50 50">
            <circle className="goal-checkbox__path" cx="25" cy="25" r="20" fill="none" />
          </svg>
        </div>
      </div>
    )
  }
}

export default GoalCheckbox
// const { string } = PropTypes;
GoalCheckbox.propTypes = {};
