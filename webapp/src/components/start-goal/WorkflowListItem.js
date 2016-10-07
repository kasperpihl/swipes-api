import React, { Component, PropTypes } from 'react'
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
    const { img, title, description } = this.props.data;
    let rootClass = 'workflow__item'; // Trying something new here because of BEM

    return (
      <div className={rootClass} onClick={this.callback}>
        {this.renderImage(rootClass, img)}
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
