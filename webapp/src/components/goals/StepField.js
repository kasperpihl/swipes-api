import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Icon from '../icons/Icon';
import './styles/step-field.scss';

class StepField extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.clickedFullscreen = this.clickedFullscreen.bind(this);
  }
  clickedFullscreen() {
    const { delegate } = this.props;

    delegate('fullscreen');
  }
  renderIcon(icon, color) {
    const styles = {};

    if (color) {
      styles.fill = color;
    }

    return <Icon svg={icon} style={styles} className="step-field__icon step-field__icon--svg" />;
  }
  renderFullscreen() {
    const { fullscreen } = this.props;

    if (!fullscreen) return undefined;

    return (
      <div onClick={this.clickedFullscreen} className="step-field__action" title="Fullscreen">
        {this.renderIcon('ArrowLeftIcon')}
        {this.renderIcon('ArrowRightIcon')}
      </div>
    );
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
    );
  }
}

export default StepField;

const { string, object, bool } = PropTypes;

StepField.propTypes = {
  icon: string,
  title: string,
  delegate: object,
  fullscreen: bool,
  iconColor: string,
  children: object,
};
