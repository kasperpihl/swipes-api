import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import WorkflowHeader from './WorkflowHeader';
import WorkflowStepList from './WorkflowStepList';

import './styles/workflow-setup.scss';

class WorkflowSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.callDelegate = this.callDelegate.bind(this);
  }
  callDelegate(name) {
    const { delegate } = this.props;

    if (delegate && typeof delegate[name] === 'function') {
      return delegate[name](...[this].concat(Array.prototype.slice.call(arguments, 1)));
    }

    return undefined;
  }
  render() {
    const rootClass = 'workflow__setup';
    const { data } = this.props;

    return (
      <div ref="container" className={rootClass}>
        <WorkflowHeader data={data} callDelegate={this.callDelegate} />
        <WorkflowStepList data={data.steps} callDelegate={this.callDelegate} />
      </div>
    );
  }
}

export default WorkflowSetup;

const { object } = PropTypes;

WorkflowSetup.propTypes = {
  delegate: object,
  data: map,
};
