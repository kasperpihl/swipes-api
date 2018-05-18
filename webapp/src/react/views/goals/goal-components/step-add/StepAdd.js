import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { styleElement } from 'react-swiss';
import { setupLoading } from 'swipes-core-js/classes/utils';
import randomString from 'swipes-core-js/utils/randomString';
import * as ca from 'swipes-core-js/actions';

import AutoCompleteInput from 'src/react/components/auto-complete-input/AutoCompleteInput';
import HOCAssigning from 'src/react/components/assigning/HOCAssigning';
import Icon from 'Icon';
import Button from 'src/react/components/button/Button2';
import styles from './StepAdd.swiss';


const Wrapper = styleElement('div', styles.Wrapper);
const AssigneesWrapper = styleElement('div', styles.AssigneesWrapper);
const SubmitWrapper = styleElement('div', styles.SubmitWrapper);
const LeftIcon = styleElement(Icon, styles.LeftIcon);
const InputWrapper = styleElement('div', styles.InputWrapper);
const LoaderCircle = styleElement('div', styles.LoaderCircle);
const ReuploadWrapper = styleElement('div', styles.ReuploadWrapper);
const ErrorLabel = styleElement('div', styles.ErrorLabel);

class StepAdd extends PureComponent {
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
    console.log('focused');
    this.setState({ isFocused: true });
  }
  onBlur = () => {
    console.log('blurred');
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
      <Wrapper key={row.get('id')}>
        {row.get('status') != 'error' && <LoaderCircle />}
        {row.get('status') === 'error' && (
          <ReuploadWrapper>
            <Button icon="cloud_upload" onClick={this.onClick.bind(this, i)} />
          </ReuploadWrapper>
        )}

        <InputWrapper>
          <AutoCompleteInput
            initialValue={row.get('title')}
          />
        </InputWrapper>
        <AssigneesWrapper>
          <HOCAssigning
            assignees={row.get('assignees')}
            maxImages={3}
            size={24}
          />
        </AssigneesWrapper>
      </Wrapper>
    )).toArray();
  }
  render() {
    const { assignees, resetDate, textLength, isFocused } = this.state;
    return (
      <Fragment>
        {this.renderPending()}
        <Wrapper>
          <LeftIcon icon="Plus" />
          <InputWrapper>
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
          </InputWrapper>
          <AssigneesWrapper shown={isFocused || textLength}>
            <HOCAssigning
              assignees={assignees}
              delegate={this}
              maxImages={3}
              size={24}
              enableTooltip
            />
          </AssigneesWrapper>
          <SubmitWrapper hidden={!textLength}>
            <Button
              icon="Enter"
              compact
              onClick={this.onAdd}
            />
          </SubmitWrapper>
        </Wrapper>
      </Fragment>
    );
  }
}

export default connect(null, {
  addStep: ca.steps.add,
})(StepAdd);