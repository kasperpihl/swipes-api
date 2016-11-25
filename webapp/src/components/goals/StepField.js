import React, { Component, PropTypes } from 'react'
import * as Icons from '../icons'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import './styles/step-field.scss'

class StepField extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.clickedFullscreen = this.clickedFullscreen.bind(this);
  }
  renderIcon(icon, color) {
    const Comp = Icons[icon];
    const styles = {};

    if (color) {
      styles.fill = color;
    }

    if (Comp) {
      return <Comp style={styles} className="step-field__icon step-field__icon--svg"/>;
    } else {
      return <img className="step-field__icon step-field__icon--img" src={icon} />
    }
  }
  clickedFullscreen(index, e){
    const { delegate } = this.props;
    delegate('fullscreen');
  }
  renderFullscreen() {
    const { fullscreen } = this.props;
    if(!fullscreen) return;

    return (
      <div onClick={this.clickedFullscreen} className="step-field__action" title="Fullscreen">
        {this.renderIcon('ArrowLeftIcon')}
        {this.renderIcon('ArrowRightIcon')}
      </div>
    )
  }
  render() {
    const { icon, iconColor, title, children } = this.props;

    return (
      <div className="step-field">
        <div className="step-field__header">
          <div className="step-field__header-image">
            {this.renderIcon(icon, iconColor)}
          </div>
          <div className="step-field__title">
            {title}
          </div>
          {this.renderFullscreen()}
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
