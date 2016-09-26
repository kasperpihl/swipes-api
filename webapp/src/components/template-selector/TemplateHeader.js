import React, { Component, PropTypes } from 'react'
import './styles/template-header.scss'

class TemplateHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    let rootClass = 'template__header';

    return (
      <div className={rootClass}>
        <div className={rootClass + '__col'}>
          <div className={rootClass + '__image'}>
            <img src="https://unsplash.it/400/?random" alt=""/>
          </div>
          <div className={rootClass + '__author'}>
            Created by Kasper Tornoe <br/>
            10 SEPT 2015
          </div>
        </div>
        <div className={rootClass + '__col ' + rootClass + '__col--text'}>
          <div className={rootClass + '__title'}>Reimbrusing company expenses</div>
          <div className={rootClass + '__subtitle'}>Containes 9 steps</div>
          <div className={rootClass + '__description'}> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates quam nam et laboriosam veniam hic aliquam voluptatum! Illo saepe vitae cupiditate ipsum tenetur ea, ullam quae repellat, eveniet molestiae labore possimus, quia in animi dolorum officiis esse eius odit laudantium. </div>
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
