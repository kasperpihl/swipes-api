import React, { Component, PropTypes } from 'react';
import { bindAll, setupDelegate } from 'classes/utils';
import WorkflowStepListItem from './WorkflowStepListItem';
import { list } from 'react-immutable-proptypes';
import './styles/workflow-steplist.scss';

class WorkflowStepList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    bindAll(this, ['onKeyUp', 'onBlur', 'clickedAssign']);
    this.callDelegate = setupDelegate(props.delegate, this);
  }
  componentDidMount() {
    setTimeout(() => {
      this.refs.input.focus();
    }, 0);
  }
  onBlur() {
    this.callDelegate('didUpdateTitle', this.refs.input.value);
  }
  onKeyUp(e) {
    if (e.keyCode === 13) {
      this.refs.input.blur();
    }
  }
  clickedAssign(e, i) {
    this.callDelegate('setupStepPressedAssign', e, i);
  }
  render() {
    const { data } = this.props;
    const rootClass = 'workflow__step-list';

    const listItems = data.map((item, i) => (
      <WorkflowStepListItem
        title={item.get('title')}
        clickedAssign={this.clickedAssign}
        assignees={item.get('assignees')}
        type={item.get('type')}
        index={i}
        key={`step-list-item-${i}`}
      />
    ));

    const height = this.props.height || '100%';
    const style = {
      height,
    };

    return (
      <div style={style} className={rootClass} ref="stepList">
        <input
          ref="input"
          key="input"
          className={`${rootClass}__title`}
          onKeyUp={this.onKeyUp}
          onBlur={this.onBlur}
          placeholder="Name your goal"
        />
        {listItems}
      </div>
    );
  }
}

export default WorkflowStepList;

const { func, object, number, array } = PropTypes;

WorkflowStepList.propTypes = {
  delegate: object,
  data: list,
  height: number,
};
