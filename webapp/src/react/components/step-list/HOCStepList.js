import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as a from 'actions';
import { list } from 'react-immutable-proptypes';
import StepList from './StepList';

class HOCStepList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hoverIndex: -1,
      addStepValue: '',
      addFocus: false,
    };
  }
  render() {
    const {
      steps,
      addLoading,
      tooltip,
      currentStepIndex,
      loadingI,
    } = this.props;

    return (
      <StepList
        currentStepIndex={currentStepIndex}
        loadingI={loadingI}
        delegate={this}
        steps={steps}
        tooltip={tooltip}
        addLoading={addLoading}
      />
    );
  }
}

export default connect(null, {
  tooltip: a.main.tooltip,
})(HOCStepList);

const { string, number, object, func } = PropTypes;

HOCStepList.propTypes = {
  steps: list,
  loadingI: string,
  tooltip: func,
  currentStepIndex: number,
  addLoading: object,
};
