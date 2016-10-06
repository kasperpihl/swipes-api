import React, { Component, PropTypes } from 'react'
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
  renderImage(rootClass, img) {
    if (img) {
      let image;
      let modifier = ''; // Because BEM

      if (typeof img === 'string') {
        image = <img src={img} alt=""/>;
        modifier = '--img'
      } else {
        image = SVG = img;
        modifier = '--svg'
      }

      return (
        <div className={rootClass + '__image ' + rootClass + '__image' + modifier}>
          {image}
        </div>
      )
    }
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
        {this.renderImage(rootClass, img)}
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
