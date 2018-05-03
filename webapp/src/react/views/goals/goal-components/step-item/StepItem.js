import React, { PureComponent } from 'react';
import { styleElement } from 'react-swiss';
import { connect } from 'react-redux';
import { setupLoading } from 'swipes-core-js/classes/utils';

import * as menuActions from 'src/redux/menu/menuActions';
import * as ca from 'swipes-core-js/actions';

import HOCAssigning from 'components/assigning/HOCAssigning';
import StepComplete from '../step-complete/StepComplete';
import Button from 'src/react/components/button/Button2';
import styles from './StepItem.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Title = styleElement('div', styles.Title);

class StepItem extends PureComponent {
  constructor(props) {
    super(props);
    setupLoading(this);
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
  onStepRename(title) {
    const { goalId, renameStep, step } = this.props;
    if(this.isLoading(step.get('id'))){
      return;
    }
    this.setLoading(step.get('id'), 'Renaming...');
    renameStep(goalId, step.get('id'), title).then((res) => {
      this.clearLoading(step.get('id'));
      if(res.ok){
        window.analytics.sendEvent('Step renamed', {});
      }
    });
  }
  renderLeftSide() {
    const {
      editMode,
      number,
      step,
      goalId,
      pending,
    } = this.props;

    return (
      <StepComplete
        number={number}
        goalId={goalId}
        stepId={step.get('id')}
        isComplete={!!step.get('completed_at')}
        pending={pending}
      />
    )
  }
  renderInput() {
    
  }
  renderRightSide() {
    const {
      editMode,
      step,
    } = this.props;
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
      <HOCAssigning
        assignees={step.get('assignees')}
        rounded
        size={24}
      />
    )
  }
  render() {
    const {
      step,
    } = this.props;

    return (
      <Wrapper className="step-complete-hover">
        {this.renderLeftSide()}
        <Title>{step.get('title')}</Title>
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