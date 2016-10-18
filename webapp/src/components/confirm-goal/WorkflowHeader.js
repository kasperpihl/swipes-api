import React, { Component, PropTypes } from 'react'
import * as Icons from '../icons'
import './styles/workflow-header.scss'

class WorkflowHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.rootClass = 'workflow__side';
    this.clickedStart = this.clickedStart.bind(this);
  }
  clickedStart(){
    this.props.callDelegate('didPressStart');
  }
  componentDidMount() {
  }
  renderIcon(icon){
    const Comp = Icons[icon];
    if(Comp){
      return <Comp className="workflow__side__icon workflow__side__icon--svg"/>;
    }
    return <i className="material-icons workflow__side__icon workflow__side__icon--font">{icon}</i>
  }
  render() {
    const { title, img, description, disabled } = this.props.data;
    let { rootClass } = this;
    let btnClass = rootClass + '__button '

    if (disabled) {
      btnClass += rootClass + '__button--disabled'
    }

    return (
      <div className={rootClass}>
        {this.renderIcon(img)}
        <div className={rootClass + '__title'}>{title}</div>
        <div className={rootClass + '__description'}>{description}</div>
        <div className={btnClass} onClick={this.clickedStart}>StArT GoAl</div>
      </div>
    )
  }
}

export default WorkflowHeader

const { string, shape, oneOfType, func } = PropTypes;

WorkflowHeader.propTypes = {
  data: shape({
    title: string,
    subtitle: string,
    img: oneOfType([string, func]),
    creator: shape({
      author: string,
      time: string
    }),
    description: string
  })
}
