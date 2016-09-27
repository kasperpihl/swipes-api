import React, { Component, PropTypes } from 'react'
import './styles/template-header.scss'

class TemplateHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.rootClass = 'template__side';
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
        <div className={btnClass}>use process</div>
      </div>
    )
  }
}

export default TemplateHeader

const { string, shape, oneOfType, func } = PropTypes;

TemplateHeader.propTypes = {
  data: shape({
    title: string,
    subtitle: string,
    img: oneOfType([string, func]),
    creator: shape({
      author: string,
      time: string
    }),
    description: string,
    callback: func
  })
}
