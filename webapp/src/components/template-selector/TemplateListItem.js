import React, { Component, PropTypes } from 'react'
import './styles/template-list-item.scss'

class TemplateListItem extends Component {
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
    const { img, title, subtitle } = this.props.data;
    let rootClass = 'template-list__item';

    return (
      <div className={rootClass}>
        {this.renderImage(rootClass, img)}
        <div className={rootClass + '__info'}>
          <div className={rootClass + '__title'}>{title}</div>
          <div className={rootClass + '__subtitle'}>{subtitle}</div>
        </div>
      </div>
    )
  }
}

export default TemplateListItem

const { shape, oneOf, string, func } = PropTypes;
TemplateListItem.propTypes = {
  data: shape({
    img: oneOf([
      string,
      func
    ]),
    title: string,
    subtitle: string
  })
}
