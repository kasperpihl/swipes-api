import React, { PureComponent } from 'react'
import { SortableContainer } from 'react-sortable-hoc';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupCachedCallback } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
// import './styles/SortableList.scss';
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
