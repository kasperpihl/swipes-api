import React, { Component, PropTypes } from 'react'
import './styles/template-steplist-item.scss'
import { AssignIcon } from '../icons'

class TemplateStepListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.clickedAssign = this.clickedAssign.bind(this)
  }
  componentDidMount() {
  }
  clickedAssign(e){
    this.props.clickedAssign(e, this.props.index);
  }
  render() {
    let rootClass = 'template__step-item';
    const { title, type, index } = this.props;

    return (
      <div className={rootClass}>
        <div className={rootClass + '__number'}>{index + 1}</div>
        <div className={rootClass + '__content'}>
          <div className={rootClass + '__title'}>{title}</div>
          <div className={rootClass + '__type'}>{type}</div>
        </div>
        <div className={rootClass + '__icons'} onClick={this.clickedAssign}>
          <AssignIcon className={rootClass + '__icon ' + rootClass + '--assign'} />
        </div>
      </div>
    )
  }
}

export default TemplateStepListItem

const { string, func } = PropTypes;

TemplateStepListItem.propTypes = {
  clickedAssign: func.isRequired
  // removeThis: string.isRequired
}
