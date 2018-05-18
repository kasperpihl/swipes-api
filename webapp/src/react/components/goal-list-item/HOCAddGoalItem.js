import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import * as ca from 'swipes-core-js/actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
import camelCaseToUnderscore from 'swipes-core-js/utils/camelCaseToUnderscore';
import { fromJS } from 'immutable';
import HOCAssigning from 'components/assigning/HOCAssigning';
import RotateLoader from 'components/loaders/RotateLoader';
import AutoCompleteInput from 'components/auto-complete-input/AutoCompleteInput';
import Button from 'src/react/components/button/Button2';
import './styles/add-goal-item.scss';

class HOCAddGoalItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      assignees: fromJS(props.defAssignees || []),
      milestoneId: props.milestoneId || null,
      addFocus: false,
    };

    setupLoading(this);
  }
  onFocus = () => {
    this.setState({ addFocus: true });
  }
  onBlur = (i) => {
    this.setState({ addFocus: false });
  }
  onGoalAdd = () => {
    const { createGoal } = this.props;
    const { title, assignees, milestoneId } = this.state;

    this.setLoading('add', 'Adding...');

    createGoal(title, milestoneId, assignees.toJS()).then((res) => {
      this.clearLoading('add');

      if (res.ok) {
        this.setState({
          title: '',
          assignees: fromJS(this.props.defAssignees || []),
        });
      }
    });
  }
  onAssigningClose(assignees) {
    this.inputRef.focus();
    if(assignees) {
      this.setState({ assignees });
    }
  }
  onAutoCompleteSelect = (item) => {
    let { assignees, title } = this.state;
    if (!assignees.contains(item.id)) {
      assignees = assignees.push(item.id);
    }
    const msgArr = title.split('@');
    title = msgArr.slice(0, -1).join('@');
    this.setState({ title, assignees });
  }
  onChange = (e) => {
  }
  render() {
    const { placeholder } = this.props;
    const { title, assignees } = this.state;
    let value = title;

    return (
      <div className="add-goal-item">
        <div className="add-goal-item__indicator" />
        <AutoCompleteInput
          onAutoCompleteSelect={this.onAutoCompleteSelect}
          innerRef={c => this.inputRef = c}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          placeholder={placeholder || 'Add a new goal'}
          clearMentions
        />
        
        <div className="add-goal-item__assignees">
          <HOCAssigning
            assignees={assignees}
            delegate={this}
            rounded
            size={30}
            enableTooltip
          />
        </div>
        <div className="add-goal-item__button" onClick={this.onGoalAdd} >
          <Button icon="subdirectory_arrow_left" compact />
        </div>
      </div>
    );
  }
}

export default connect(null, {
  createGoal: ca.goals.create,
})(HOCAddGoalItem);
