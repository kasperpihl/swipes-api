import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { styleElement } from 'react-swiss';
import AutoCompleteInput from 'src/react/components/auto-complete-input/AutoCompleteInput2';
import styles from './StepAdd.swiss';

const Wrapper = styleElement('div', styles.Wrapper);

class StepAdd extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }
  onChange(editorState) {
    
  }
  render() {
    const { isLoading, getLoading, stepOrder } = this.props;
    const { addFocus, addStepValue, addStepAssignees } = this.state;

    if (addStepValue.length && !isLoading('add')) {
      addClass += ' add-step--active'
    }

    if (addFocus || addStepValue.length) {
      addClass += ' add-step--focused';
    }

    const placeholder = this.getPlaceholder();

    return (
      <Wrapper>
        <AutoCompleteInput
          initialValue="Yeah baby"
          onChange={}
        />
        <div className="add-step__indicator">
          <div className="add-step__indicator--number">{stepOrder.size + 1}</div>
        </div>
        <div className="add-step__assignees">
          <HOCAssigning
            index="add"
            assignees={addStepAssignees}
            delegate={this}
            rounded
            size={24}
          />
        </div>
        <div className="add-step__button">
          <Button icon="subdirectory_arrow_left" small frameless onClick={this.onAddStep} />
        </div>
      </Wrapper>
    );
  }
}

export default connect((state) => ({
}), {})(StepAdd);