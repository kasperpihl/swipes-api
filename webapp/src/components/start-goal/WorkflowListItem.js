import React, { Component, PropTypes } from 'react'
import * as Icons from '../icons'
import './styles/workflow-list-item.scss'

class WorkflowListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.callback = this.callback.bind(this);
  }
  componentDidMount() {
  }
  callback(){
    this.props.callback(this.props.data.id);
  }
  renderIcon(icon){
    const Comp = Icons[icon];
    if(Comp){
      return <Comp className="workflow__item__icon workflow__item__icon--svg"/>;
    }
    return <i className="material-icons workflow__item__icon workflow__item__icon--font">{icon}</i>
  }
  render() {
    const { img, title, description } = this.props.data;
    let rootClass = 'workflow__item'; // Trying something new here because of BEM

    return (
      <div className={rootClass} onClick={this.callback}>
        {this.renderIcon(img)}
        <div className={rootClass + '__content'}>
          <div className={rootClass + '__title'}>{title}</div>
          <div className={rootClass + '__description'}>{description}</div>
        </div>
      </div>
    )
  }
}

export default WorkflowListItem

const { shape, oneOfType, string, func } = PropTypes;
WorkflowListItem.propTypes = {
  data: shape({
    img: oneOfType([
      string,
      func
    ]),
    title: string,
    subtitle: string
  }),
  callback: func
}
