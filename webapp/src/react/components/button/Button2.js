import React, { PureComponent } from 'react';
import { element } from 'react-swiss';
import Icon from 'Icon';
import sw from './Button.swiss';

const ATag = element('a', sw.ATag);
const Text = element('div', sw.Text);
const IconContainer = element('div', sw.IconContainer);
const IconComp = element(Icon, sw.Icon);

class Button extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderIcon() {
    const { icon, compact } = this.props;
    if(!icon) {
      return null;
    }
    return (
      <IconContainer compact={compact}>
        <IconComp icon={icon} />
      </IconContainer>
    )
  }
  renderText() {
    const { children, compact } = this.props;
    if(!children) {
      return null;
    }
    return (
      <Text compact={compact}>{children}</Text>
    );
  }
  render() {
    const {
      children,
      compact,
      icon,
      ...rest,
    } = this.props;
    return (
      <ATag className="gl-button" {...rest}>
        {this.renderIcon()}
        {this.renderText()}
      </ATag>
    );
  }
}

export default Button