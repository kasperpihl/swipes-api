import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import WorkflowStore from './WorkflowStore';

class HOCStore extends PureComponent {
  static minWidth() {
    return 800;
  }
  static maxWidth() {
    return 1296;
  }
  render() {
    return <WorkflowStore />;
  }
}

export default connect(null, {})(HOCStore);
