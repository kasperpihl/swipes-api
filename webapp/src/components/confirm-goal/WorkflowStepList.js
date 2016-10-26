import React, { Component, PropTypes } from 'react'
import TagsInput from './TagsInput'
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
    setTimeout( () => {
      this.refs.input.focus();
    }, 0)
  }
  callDelegate(name){
    const { delegate } = this.props;
    if(delegate && typeof delegate[name] === "function"){
      return delegate[name].apply(delegate, [this].concat(Array.prototype.slice.call(arguments, 1)));
    }
  }
  onBlur(e){
    this.props.callDelegate('didUpdateTitle', this.refs.input.value)
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
      const totalAssignees = item.assignees.length;

      return <WorkflowStepListItem title={item.title} clickedAssign={this.clickedAssign} assignees={item.assignees} type={item.type} index={i} key={'step-list-item-' + i} />
    })

    const height = this.props.height || '100%';
    const style = {
      height
    };
    
    return (
      <div style={style} className={rootClass} ref="stepList">
        <input ref="input" key="input" className={rootClass + '__title'} onKeyUp={this.onKeyUp} onBlur={this.onBlur} placeholder="Name your goal" />
        <TagsInput callDelegate={this.callDelegate}/>
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
