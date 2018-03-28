import React, { PureComponent } from 'react'
import { SortableContainer } from 'react-sortable-hoc';

import StepListItem from './StepListItem';

class SortableList extends PureComponent {
  render() {
    const {
      stepOrder,
      steps,
    } = this.props;

    return (
      <div className="sortable-list" ref="root">
        {stepOrder.map((stepId, i) => (
          <StepListItem
            step={steps.get(stepId)}
            index={i}
            i={i}
            key={stepId}

            _loadingStates={this.props._loadingStates}
            getLoading={this.props.getLoading}
            isLoading={this.props.isLoading}
            delegate={this.props.delegate}
            editMode={this.props.editMode}
          />
        )).toArray()}
      </div>
    );
  }
}

export default SortableContainer(SortableList, { withRef: true})

// const { string } = PropTypes;

SortableList.propTypes = {};
