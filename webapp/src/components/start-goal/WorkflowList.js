import React, { Component, PropTypes } from 'react';
import WorkflowListItem from './WorkflowListItem';
import './styles/workflow-list.scss';

class WorkflowList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {

  }
  render() {
    const { data } = this.props;
    let workflows;

    if (data) {
      workflows = data.map((workflow, i) => (
        <WorkflowListItem data={workflow} i={i} callback={this.props.callback} key={i} />
        ));
    }

    return (
      <div className="workflow__list">
        {workflows}
      </div>
    );
  }
}

export default WorkflowList;

const { shape, arrayOf, func } = PropTypes;
WorkflowList.propTypes = {
  data: arrayOf(shape(WorkflowListItem.propTypes)),
  callback: func.isRequired,
};
