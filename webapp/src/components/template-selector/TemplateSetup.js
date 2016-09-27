import React, { Component, PropTypes } from 'react'
import TemplateHeader from './TemplateHeader'
import TemplateStepList from './TemplateStepList'

import './styles/template-setup.scss'

class TemplateSetup extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.callDelegate = this.callDelegate.bind(this);
  }
  callDelegate(name){
    const { delegate } = this.props;
    if(delegate && typeof delegate[name] === "function"){
      return delegate[name].apply(delegate, [this].concat(Array.prototype.slice.call(arguments, 1)));
    }
  }

  componentDidMount() {
  }
  render() {
    let rootClass = 'template__setup';
    const { delegate } = this.props;
    return (
      <div ref="container" className={rootClass}>
        <TemplateHeader data={this.props.data} callDelegate={this.callDelegate} />
        <TemplateStepList data={this.props.data.steps} callDelegate={this.callDelegate} />
      </div>
    )
  }
}

export default TemplateSetup

const { string, object } = PropTypes;

TemplateSetup.propTypes = {
  delegate: object
}
