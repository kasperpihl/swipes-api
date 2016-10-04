import React, { Component, PropTypes } from 'react'
import WorkflowStepListItem from './WorkflowStepListItem'
import { bindAll } from '../../classes/utils'
import './styles/workflow-steplist.scss'

class WorkflowStepList extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    bindAll(this, ['onKeyUp', 'onBlur', 'clickedAssign']);
  }
  componentDidMount() {
    this.refs.input.focus();
  }
  onBlur(e){
    this.props.callDelegate('setupSetTitle', this.refs.input.value)
  }
  onKeyUp(e){
    if(e.keyCode === 13){
      this.refs.input.blur();
    }
  }
  clickedAssign(e, i){
    this.props.callDelegate('setupStepPressedAssign', e, i)
  }
  render() {
    const { data } = this.props;
    let rootClass = 'workflow__step-list';

    const listItems = data.map( (item, i) => {
      return <WorkflowStepListItem title={item.title} clickedAssign={this.clickedAssign} type={item.type} index={i} key={i} />
    })
    const height = this.props.height || '100%';
    const style = {
      height
    };
    return (
      <div style={style} className={rootClass} ref="stepList">
        <input ref="input" className={rootClass + '__title'} onKeyUp={this.onKeyUp} onBlur={this.onBlur} placeholder="Name your goal" />
        {listItems}
      </div>
    )
  }
}

export default WorkflowStepList

const { string, func } = PropTypes;

WorkflowStepList.propTypes = {
  callDelegate: func
}
