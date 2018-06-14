import React, { PureComponent } from 'react';
import { SwissProvider } from 'swiss-react';
import { connect } from 'react-redux';
import { withOptimist } from 'react-optimist';
import * as ca from 'swipes-core-js/actions';
import { fromJS } from 'immutable';
import HOCAssigning from 'components/assigning/HOCAssigning';
import AutoCompleteInput from 'components/auto-complete-input/AutoCompleteInput';
import Button from 'src/react/components/button/Button';

import SW from './GoalAdd.swiss';

@connect(null, {
  createGoal: ca.goals.create,
})
@withOptimist
export default class GoalAdd extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      assignees: fromJS(props.defAssignees || []),
      milestoneId: props.milestoneId || null,
      isFocused: false,
    };
  }
  onFocus = () => {
    this.setState({ isFocused: true });
  }
  onBlur = (i) => {
    this.setState({ isFocused: false });
  }
  onGoalAdd = () => {
    const { createGoal } = this.props;
    const { assignees, milestoneId } = this.state;

    const title = this.editorState.getCurrentContent().getPlainText();
    if(!title) {
      return;
    }
    createGoal(title, milestoneId, assignees.toJS()).then((res) => {

      if (res.ok) {
        this.setState({
          resetDate: new Date(),
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
    const { assignees } = this.state;
    if (!assignees.contains(item.id)) {
      this.setState({ assignees: assignees.push(item.id) });
    }
  }
  onReturn = () => {
    this.onGoalAdd();
    return 'handled';
  }
  onChange = (editorState) => {
    this.editorState = editorState;
    this.setState({
      hasContent: !!editorState.getCurrentContent().getPlainText().length
    })
  }
  render() {
    const { placeholder } = this.props;
    const {
      isFocused,
      hasContent,
      assignees,
      resetDate,
    } = this.state;

    return (
      <SwissProvider hasContent={hasContent} isFocused={isFocused}>
        <SW.Wrapper>
          <SW.Indicator />
          <SW.InputWrapper>
            <AutoCompleteInput
              onAutoCompleteSelect={this.onAutoCompleteSelect}
              innerRef={c => this.inputRef = c}
              onChange={this.onChange}
              handleReturn={this.onReturn}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              reset={resetDate}
              placeholder={placeholder || 'Add a new goal'}
              clearMentions
            />
          </SW.InputWrapper>
          <SW.AssigneesWrapper hasAssignees={!!assignees.size}>
            <HOCAssigning
              assignees={assignees}
              delegate={this}
              rounded
              size={30}
              enableTooltip
            />
          </SW.AssigneesWrapper>
          <SW.SubmitWrapper>
            <Button icon="Enter" compact onClick={this.onGoalAdd} />
          </SW.SubmitWrapper>
        </SW.Wrapper>
      </SwissProvider>
    );
  }
}