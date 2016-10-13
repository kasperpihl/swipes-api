import React, { Component, PropTypes } from 'react'
import StoreHeader from './StoreHeader'
import StoreCategories from './StoreCategories'
import './styles/workflow-store.scss'

class WorkflowStore extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    let rootClass = 'store';

    return (
      <div className={rootClass}>
        <div className="store__section">
          <StoreHeader />
        </div>
        <div className="store__section">
          <StoreCategories />
        </div>
      </div>
    )
  }
}

export default WorkflowStore

const { string } = PropTypes;

WorkflowStore.propTypes = {

}
