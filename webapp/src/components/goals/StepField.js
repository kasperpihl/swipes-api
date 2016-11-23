import React, { Component, PropTypes } from 'react'
import * as Icons from '../icons'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import './styles/step-field.scss'

class StepField extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  }
  renderIcon(icon) {
    const Comp = Icons[icon];

    if (Comp) {
      return <Comp className="step-field__icon step-field__icon--svg"/>;
    } else {
      return <img className="step-field__icon step-field__icon--img" src={icon} />
    }
  }
  render() {
    const { icon, title, children } = this.props;

    return (
      <div className="step-field">
        <div className="step-field__header">
          <div className="step-field__header-image">
            {this.renderIcon(icon)}
          </div>
          <div className="step-field__title">
            {title}
          </div>
          <div className="step-field__action" title="Fullscreen">
            {this.renderIcon('ArrowLeftIcon')}
            {this.renderIcon('ArrowRightIcon')}
          </div>
        </div>
        {children}
      </div>
    )
  }
}

export default StepField

const { string } = PropTypes;

StepField.propTypes = {
  icon: string,
  title: string
}
