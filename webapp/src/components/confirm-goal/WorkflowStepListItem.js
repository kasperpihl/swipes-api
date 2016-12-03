import React, { Component, PropTypes } from 'react';
import Assigning from '../assigning/Assigning';

import './styles/workflow-steplist-item.scss';

class WorkflowStepListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.clickedAssign = this.clickedAssign.bind(this);
  }
  componentDidMount() {
  }
  clickedAssign(e) {
    this.props.clickedAssign(e, this.props.index);
  }
  render() {
    const rootClass = 'workflow__step-item';
    const { title, index, assignees } = this.props;

    return (
      <div className={rootClass}>
        <div className={`${rootClass}__number`}>{index + 1}</div>
        <div className={`${rootClass}__content`}>
          <div className={`${rootClass}__title`}>{title}</div>
        </div>
        <div className={`${rootClass}__assigning`}>
          <Assigning assignees={assignees} editable clickAssign={this.clickedAssign} />
        </div>
      </div>
    );
  }
}

export default WorkflowStepListItem;

const { string, func, number, object } = PropTypes;

WorkflowStepListItem.propTypes = {
  clickedAssign: func.isRequired,
  index: number,
  title: string,
  assignees: object,
};
