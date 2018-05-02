import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { styleElement } from 'react-swiss';
import { setupLoading } from 'swipes-core-js/classes/utils';
import * as ca from 'swipes-core-js/actions';

import AutoCompleteInput from 'src/react/components/auto-complete-input/AutoCompleteInput2';
import HOCAssigning from 'src/react/components/assigning/HOCAssigning';
import Icon from 'Icon';
import Button from 'src/react/components/button/Button2';
import styles from './StepAdd.swiss';


const Wrapper = styleElement('div', styles.Wrapper);
const AssigneesWrapper = styleElement('div', styles.AssigneesWrapper);
const SubmitWrapper = styleElement('div', styles.SubmitWrapper);
const LeftIcon = styleElement(Icon, styles.LeftIcon);

class StepAdd extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      assignees: fromJS([]),
    }
    setupLoading(this);
  }
  onAdd = () => {
    const { addStep, goalId } = this.props;
    const { assignees } = this.state;
    let title;
    if(this.editorState) {
      title = this.editorState.getCurrentContent().getPlainText();
    }
    if(!title || this.isLoading('add')) {
      return;
    }
    this.setState({ resetDate: new Date() });
    this.setLoading('add', 'Adding...');
    addStep(goalId, title, assignees.toJS()).then((res) => {
      this.clearLoading('add');
      if(res.ok){
        window.analytics.sendEvent('Step added', {});
      }
    });
  }
  onChange = (editorState) => {
    this.editorState = editorState;
  }
  onReturn = () => {
    this.onAdd();
    return 'handled';
  }
  render() {
    const { assignees, resetDate } = this.state;
    return (
      <Wrapper>
        <LeftIcon icon="Plus" />
        <AutoCompleteInput
          onChange={this.onChange}
          placeholder="Add new step"
          onReturn={this.onReturn}
          reset={resetDate}
        />
        <AssigneesWrapper>
          <HOCAssigning
            assignees={assignees}
            delegate={this}
            rounded
            size={24}
          />
        </AssigneesWrapper>
        <SubmitWrapper>
          <Button
            icon="Enter"
            compact
            onClick={this.onAdd}
          />
        </SubmitWrapper>
      </Wrapper>
    );
  }
}

export default connect(null, {
  addStep: ca.steps.add,
})(StepAdd);