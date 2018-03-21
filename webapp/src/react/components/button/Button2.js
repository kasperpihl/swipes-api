import React, { PureComponent } from 'react';
import { element } from 'react-swiss';
import Icon from 'Icon';
import sw from './Button.swiss';

const ATag = element('a', sw.ATag);
const Title = element('div', sw.Title);
const Background = element('div', sw.Background);
const IconContainer = element('div', sw.IconContainer);
const SideLabel = element('div', sw.SideLabel);
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
      <IconContainer>
        <IconComp icon={icon} />
      </IconContainer>
    )
  }
  renderTitle() {
    const { title, compact, icon } = this.props;

    return title && (
      <Title compact={compact} hasIcon={!!icon}>{title}</Title>
    );
  }
  renderSideLabel() {
    const { sideLabel, compact } = this.props;
    if(!sideLabel) {
      return null;
    }
    return sideLabel && (
      <SideLabel compact={compact}>{sideLabel}</SideLabel>
    )
  }
  render() {
    const {
      title,
      sideLabel,
      compact,
      icon,
      ...rest,
    } = this.props;
    return (
      <ATag className="gl-button" {...rest}>
        <Background compact={compact}>
          {this.renderIcon()}
          {this.renderTitle()}
        </Background>
        {this.renderSideLabel()}
      </ATag>
    );
  }
}

export default Button