import React, { PureComponent, PropTypes } from 'react';
import { map, mapContains, list, listOf } from 'react-immutable-proptypes';
import { setupCachedCallback } from 'classes/utils';

import './styles/select-step.scss';

class SelectStep extends PureComponent {
  constructor(props) {
    super(props);
    this.onClickCached = setupCachedCallback(props.onClick, this);
  }
  componentDidMount() {
    // this.onClickCached(obj.get('id'), obj);
  }
  renderSteps() {

  }
  render() {
    return (
      <div className="select-step" />
    );
  }
}

export default SelectStep;

const { string, bool, func, number } = PropTypes;

SelectStep.propTypes = {
  onClick: func.isRequired,
  numberOfCompleted: number,
  steps: listOf(mapContains({
    id: string,
    title: string,
    current: bool,
    next: bool,
  })),
};
