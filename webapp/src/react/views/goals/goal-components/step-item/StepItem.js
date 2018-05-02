import React, { PureComponent } from 'react';
import { styleElement } from 'react-swiss';
import { connect } from 'react-redux';
import HOCAssigning from 'components/assigning/HOCAssigning';
import StepComplete from '../step-complete/StepComplete';
import Button from 'src/react/components/button/Button2';
import styles from './StepItem.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Title = styleElement('div', styles.Title);

class StepItem extends PureComponent {
  renderLeftSide() {
    const {
      editMode,
      number,
      step,
      goalId,
    } = this.props;

    if(editMode) {

    }
    return (
      <StepComplete
        number={number}
        goalId={goalId}
        stepId={step.get('id')}
        isComplete={!!step.get('completed_at')}
      />
    )
  }
  renderInput() {
    
  }
  renderRightSide() {
    const {
      editMode,
      step,
      onEdit,
    } = this.props;
    if(editMode) {
      return (
        <Button icon="ThreeDots" onClick={onEdit} />
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

export default connect()(StepItem);