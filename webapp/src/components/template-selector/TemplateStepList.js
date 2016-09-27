import React, { Component, PropTypes } from 'react'
import TemplateStepListItem from './TemplateStepListItem'
import { bindAll } from '../../classes/utils'
import './styles/template-steplist.scss'

class TemplateStepList extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    bindAll(this, ['onKeyUp', 'onBlur', 'clickedAssign']);
  }
  componentDidMount() {
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
    let rootClass = 'template__step-list';

    const listItems = data.map( (item, i) => {
      return <TemplateStepListItem title={item.title} clickedAssign={this.clickedAssign} type={item.type} index={i} key={i} />
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

export default TemplateStepList

const { string, func } = PropTypes;

TemplateStepList.propTypes = {
  callDelegate: func
}
