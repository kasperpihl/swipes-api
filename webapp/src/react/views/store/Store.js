import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import WorkflowStore from './WorkflowStore';

class Store extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  render() {
    return <WorkflowStore />;
  }
}

const ConnectedStore = connect(null, {})(Store);

export default ConnectedStore;
