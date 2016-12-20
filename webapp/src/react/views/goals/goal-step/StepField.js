import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Icon from 'Icon';
import './styles/step-field.scss';

class StepField extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  renderIcon(color) {
    const { svg, src } = this.props;
    const styles = {};

    if (color) {
      styles.fill = color;
    }

    return (
      <Icon
        svg={svg}
        src={src}
        style={styles}
        className="step-field__icon step-field__icon--svg"
      />
    );
  }
  render() {
    const { iconColor, title, children, description } = this.props;

    return (
      <div className="step-field">
        <div className="step-field__header">
          <div className="step-field__header-image">
            {this.renderIcon(iconColor)}
          </div>
          <div className="step-field__title">
            {title}
          </div>
        </div>
        <div className="step-field__description">{description}</div>
        {children}
      </div>
    );
  }
}

export default StepField;

const { string, object, array, oneOfType } = PropTypes;

StepField.propTypes = {
  svg: string,
  src: string,
  title: string,
  description: string,
  iconColor: string,
  children: oneOfType([
    object,
    array,
  ]),
};
