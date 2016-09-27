import React, { Component, PropTypes } from 'react'
import TemplateHeader from './TemplateHeader'
import TemplateStepList from './TemplateStepList'

import './styles/template-setup.scss'

class TemplateSetup extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    let rootClass = 'template__setup';

    return (
      <div ref="container" className={rootClass}>
        <TemplateHeader data={this.props.data} />
        <TemplateStepList data={this.props.data.steps} />
      </div>
    )
  }
}

export default TemplateSetup

const { string } = PropTypes;

TemplateSetup.propTypes = {

}
