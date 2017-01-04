import React, { Component, PropTypes } from 'react';
import Button from 'Button';
import { fromJS, Map } from 'immutable';
import { setupDelegate, bindAll } from 'classes/utils';

import './styles/add-goal.scss';
import StepItem from './StepItem';

class AddGoal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: fromJS([]),
    };
    bindAll(this, ['clickedAdd']);
    this.callDelegate = setupDelegate(props.delegate);
  }

  componentDidMount() {
    this.refs.input.focus();
  }

  clickedAdd() {
    console.log(this.state.steps.toJS());
  }

  updateStepData(i, data) {
    console.log(i, data);
    const { steps } = this.state;
    let s;
    if (i === 'add') {
      s = steps.push(Map(data));
    }
    if (s) {
      this.setState({ steps: s });
    }
  }
  renderHeader() {
    return (
      <div className="add-goal__header">
        <input
          ref="input"
          type="text"
          className="add-goal__title add-goal__title--input"
          placeholder="Name your goal"
        />
      </div>
    );
  }
  renderStepList() {
    const { steps } = this.state;

    return (
      <div className="add-goal__step-list">
        {steps.map((s, i) => (
          <StepItem
            key={i}
            index={i}
            delegate={this}
            title={s.get('title')}
            assignees={s.get('assignees')}
          />
        ))}
        <StepItem key="add" add delegate={this} />
      </div>
    );
  }
  render() {
    return (
      <div className="add-goal">
        <div className="add-goal__wrapper">
          {this.renderHeader()}
          {this.renderStepList()}
          <Button text="Add Goal" onClick={this.clickedAdd} primary />
        </div>
      </div>
    );
  }
}

export default AddGoal;

const { func, object } = PropTypes;

AddGoal.propTypes = {
  clickedAssign: func,
  delegate: object,
};
