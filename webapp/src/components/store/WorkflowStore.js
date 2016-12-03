import React, { Component } from 'react';
import StoreHeader from './StoreHeader';
import StoreCategories from './StoreCategories';
import './styles/workflow-store.scss';

class WorkflowStore extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  render() {
    const rootClass = 'store';

    return (
      <div className={rootClass}>
        <div className="store__section">
          <StoreHeader />
        </div>
        <div className="store__section">
          <StoreCategories />
        </div>
      </div>
    );
  }
}

export default WorkflowStore;
