import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import WorkflowHeader from './WorkflowHeader';
import WorkflowStepList from './WorkflowStepList';
import { setupDelegate } from 'classes/utils';

import './styles/workflow-setup.scss';

class WorkflowSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.callDelegate = setupDelegate(props.delegate, this);
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
