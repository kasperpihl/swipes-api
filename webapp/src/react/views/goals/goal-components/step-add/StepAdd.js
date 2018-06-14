import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { setupLoading } from 'swipes-core-js/classes/utils';
import randomString from 'swipes-core-js/utils/randomString';
import * as ca from 'swipes-core-js/actions';

import AutoCompleteInput from 'src/react/components/auto-complete-input/AutoCompleteInput';
import HOCAssigning from 'src/react/components/assigning/HOCAssigning';
import Button from 'src/react/components/button/Button';
import SW from './StepAdd.swiss';

@connect(null, {
  addStep: ca.steps.add,
})
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      assignees: fromJS([]),
      queue: fromJS([]),
    }
  }
  onAdd = () => {
    let { queue, assignees } = this.state;

    let title;
    if(this.editorState) {
      title = this.editorState.getCurrentContent().getPlainText();
    }
    if(!title) {
      return;
    }

    queue = queue.push(fromJS({
      title,
      assignees,
      status: 'ready',
      id: randomString(6),
    }));
    this.setState({
      resetDate: new Date(),
      assignees: fromJS([]),
      queue,
    }, this.runQueue);

  }
  onChange = (editorState) => {
    this.editorState = editorState;
    this.setState({
      textLength: editorState.getCurrentContent().getPlainText().length
    })
  }
  onFocus = () => {
    this.setState({ isFocused: true });
  }
  onBlur = () => {
    this.setState({ isFocused: false });
  }
  onReturn = () => {
    this.onAdd();
    return 'handled';
  }
  onAssigningClose(assignees) {
    if(assignees) {
      this.setState({ assignees });
    }
  }
  onAutoCompleteSelect = (item) => {
    let { assignees } = this.state;
    if(!assignees.contains(item.id)) {
      assignees = assignees.push(item.id);
      this.setState({ assignees });
    }
  }
  runQueue = () => {
    if(this.running) return;

    const { addStep, goalId } = this.props;
    const index = this.state.queue.findIndex((row) => row.get('status') === 'ready');

    if(index === -1) return;

    const { title, assignees } = this.state.queue.get(index).toJS();

    this.running = true;
    addStep(goalId, title, assignees).then((res) => {
      this.running = false;
      let queue = this.state.queue.setIn([index, 'status'], 'error');
      if(res.ok){
        queue = queue.splice(index, 1);
        window.analytics.sendEvent('Step added', {});
      }
      this.setState({ queue }, this.runQueue);
    });
  }
  onClick = (i) => {
    let { queue } = this.state;
    queue = queue.setIn([i, 'status'], 'ready');
    this.setState({ queue }, this.runQueue);
  }
  renderPending() {
    return this.state.queue.map((row, i) => (
      <SW.Wrapper key={row.get('id')}>
        {row.get('status') != 'error' && <LoaderCircle />}
        {row.get('status') === 'error' && (
          <SW.ReuploadWrapper>
            <Button icon="cloud_upload" onClick={this.onClick.bind(this, i)} />
          </SW.ReuploadWrapper>
        )}

        <SW.InputWrapper>
          <AutoCompleteInput
            initialValue={row.get('title')}
          />
        </SW.InputWrapper>
        <SW.AssigneesWrapper>
          <HOCAssigning
            assignees={row.get('assignees')}
            maxImages={3}
            size={24}
          />
        </SW.AssigneesWrapper>
      </SW.Wrapper>
    )).toArray();
  }
  render() {
    const { assignees, resetDate, textLength, isFocused } = this.state;
    return (
      <Fragment>
        {this.renderPending()}
        <SW.Wrapper>
          <SW.LeftIcon icon="Plus" />
          <SW.InputWrapper>
            <AutoCompleteInput
              onChange={this.onChange}
              placeholder="Add new step"
              handleReturn={this.onReturn}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onAutoCompleteSelect={this.onAutoCompleteSelect}
              reset={resetDate}
              autoFocus
              clearMentions
            />
          </SW.InputWrapper>
          <SW.AssigneesWrapper shown={assignees.size || isFocused || textLength}>
            <HOCAssigning
              assignees={assignees}
              delegate={this}
              maxImages={3}
              size={24}
              enableTooltip
            />
          </SW.AssigneesWrapper>
          <SW.SubmitWrapper hidden={!textLength}>
            <Button
              icon="Enter"
              compact
              onClick={this.onAdd}
            />
          </SW.SubmitWrapper>
        </SW.Wrapper>
      </Fragment>
    );
  }
}
