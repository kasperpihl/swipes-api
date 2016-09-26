import React, { Component, PropTypes } from 'react'
import './styles/template-header.scss'

class TemplateHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {}
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
    const { title, subtitle, img, creator, description } = this.props.data;
    let rootClass = 'template__header';

    return (
      <div className={rootClass}>
        <div className={rootClass + '__col'}>
          {this.renderImage(rootClass, img)}
          <div className={rootClass + '__author'}>
            Created by {creator.author} <br/>
            {creator.time}
          </div>
        </div>
        <div className={rootClass + '__col ' + rootClass + '__col--text'}>
          <div className={rootClass + '__title'}>{title}</div>
          <div className={rootClass + '__subtitle'}>{subtitle}</div>
          <div className={rootClass + '__description'}>{description}</div>

        </div>
        <div className={rootClass + '__col'}>
          <div className={rootClass + '__cta'}>use process</div>
        </div>
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
