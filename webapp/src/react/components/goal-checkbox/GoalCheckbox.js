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
    // this.callDelegate.bindAll('onLinkClick')
  }
  componentDidMount() {
  }
  render() {
    const { completed } = this.props;
    const { rendered } = this.state;

    let className = 'goal-checkbox';

    if (completed) {
      className += ' goal-checkbox--completed'
    }

    return (
      <div className={className} onClick={this.onGoalCheckboxClick}>
        <Icon icon="ChecklistCheckmark" className="goal-checkbox__svg" />
      </div>
    )
  }
}

export default GoalCheckbox
// const { string } = PropTypes;
GoalCheckbox.propTypes = {};
