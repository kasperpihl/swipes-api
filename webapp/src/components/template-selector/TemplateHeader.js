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
    let rootClass = 'template-header';

    return (
      <div className={rootClass}>
        <div className={rootClass + '__col ' + rootClass + '--icon'}></div>
        <div className={rootClass + '__col ' + rootClass + '--info'}></div>
        <div className={rootClass + '__col ' + rootClass + '--cta'}></div>
      </div>
    )
  }
}

export default TemplateHeader

const { string } = PropTypes;

TemplateHeader.propTypes = {
  // removeThis: string.isRequired
}
