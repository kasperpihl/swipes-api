import React, { PureComponent } from 'react';
import { styleElement } from 'react-swiss';
import { connect } from 'react-redux';
import { setupLoading } from 'swipes-core-js/classes/utils';

import * as menuActions from 'src/redux/menu/menuActions';
import * as ca from 'swipes-core-js/actions';

import AutoCompleteInput from 'src/react/components/auto-complete-input/AutoCompleteInput';
import HOCAssigning from 'components/assigning/HOCAssigning';
import StepComplete from '../step-complete/StepComplete';
import Button from 'src/react/components/button/Button2';
import Icon from 'Icon';
import styles from './StepItem.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Drag = styleElement('div', styles.Drag);
const AssignWrapper = styleElement('div', styles.AssignWrapper);
const DragWrapper = styleElement('div', styles.DragWrapper);
const DragIcon = styleElement(Icon, styles.DragIcon);

class StepItem extends PureComponent {
  constructor(props) {
    super(props);
    setupLoading(this);
    this.state = {};
  }
  componentWillUnmount() {
    this.unmounted = true;
  }
  onChange = (editorState) => {
    this.editorState = editorState;
    this.setState({
      plainText: editorState.getCurrentContent().getPlainText()
    })
  }
  onStepRemove = (e) => {
    const { confirm, removeStep, goalId, step } = this.props;
    const options = {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    };
    confirm(Object.assign({}, options, {
      title: 'Remove step',
      message: 'This can\'t be undone.',
    }), (res) => {
      if (res === 1) {
        this.setLoading(step.get('id'), 'Removing...');
        removeStep(goalId, step.get('id')).then((res) => {
          this.clearLoading(step.get('id'));
          if(res.ok){
            window.analytics.sendEvent('Step removed', {});
          }
        });
      }
    });
  }
  onStepRename() {
    const { goalId, renameStep, step } = this.props;
    const { plainText } = this.state;

    if(!plainText || step.get('title') === plainText){
      if(!plainText) {
        this.setState({ resetDate: new Date() });
      }
      return;
    }
    renameStep(goalId, step.get('id'), plainText).then((res) => {
      if(res.ok){
        window.analytics.sendEvent('Step renamed', {});
      }
    });
  }
  onAutoCompleteSelect = (item) => {
    let { step } = this.props;
    if(!step.get('assignees').contains(item.id)) {
      this.onAssign(step.get('assignees').push(item.id));
    }
  }
  onReturn = () => {
    this.inputRef.blur();
    return 'handled';
  }
  onFocus = () => {
    this.setState({ focused: true });
  }
  onBlur = () => {
    this.setState({ focused: false });
    this.onStepRename();
  }
  onAssigningClose(assignees) {
    assignees && this.onAssign(assignees);
  }
  onAssign(assignees) {
    const { assignStep, goalId, step } = this.props;
    this.setState({ tempAssignees: assignees });
    assignStep(goalId, step.get('id'), assignees.toJS()).then((res) => {
      !this.unmounted && this.setState({ tempAssignees: null });
      if(res.ok){
        window.analytics.sendEvent('Step assigned', {
          'Number of assignees': assignees.size,
        });
      }
    });
  }
  renderLeftSide() {
    const {
      number,
      step,
      goalId,
      editMode,
    } = this.props;
    if(editMode) return null;

    return (
      <StepComplete
        number={number}
        goalId={goalId}
        stepId={step.get('id')}
        isComplete={!!step.get('completed_at')}
      />
    )
  }
  renderMiddle() {
    const { step } = this.props;
    const { resetDate } = this.state;
    return (
      <AutoCompleteInput
        innerRef={(c) => this.inputRef = c }
        onChange={this.onChange}
        placeholder="Edit this step"
        initialValue={step.get('title')}
        handleReturn={this.onReturn}
        onAutoCompleteSelect={this.onAutoCompleteSelect}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        reset={resetDate}
        clearMentions
      />
    )
  }
  renderRightSide() {
    const {
      editMode,
      step,
    } = this.props;
    const {
      tempAssignees,
      focused,
    } = this.state;
    const assignees = tempAssignees || step.get('assignees');
    if(editMode) {
      return (
        <Button
          icon="Close"
          onClick={this.onStepRemove}
          compact
        />
      )
    }
    return (
      <AssignWrapper show={focused || assignees.size}>
        <HOCAssigning
          assignees={assignees}
          maxImages={3}
          size={24}
          delegate={this}
          enableTooltip
        />
      </AssignWrapper>
    )
  }
  render() {
    const { dragProvided, editMode } = this.props;
    return (
      <Wrapper
        innerRef={dragProvided.innerRef}
        {...dragProvided.draggableProps}
        className="step-complete-hover assign-hover">
        <DragWrapper show={!!editMode} {...dragProvided.dragHandleProps}>
          <DragIcon icon="Reorder" />
        </DragWrapper>
        {this.renderLeftSide()}
        {this.renderMiddle()}
        {this.renderRightSide()}
      </Wrapper>
    );
  }
}

export default connect(null, {
  confirm: menuActions.confirm,
  removeStep: ca.steps.remove,
  renameStep: ca.steps.rename,
  assignStep: ca.steps.assign,
})(StepItem);