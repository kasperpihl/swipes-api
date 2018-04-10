import React, { PureComponent } from 'react';
import { styleElement } from 'react-swiss';
import Icon from 'Icon';
import styles from './Button.swiss';

const ATag = styleElement('a', styles, 'ATag');
const Title = styleElement('div', styles, 'Title');
const Background = styleElement('div', styles, 'Background');
const IconContainer = styleElement('div', styles, 'IconContainer');
const SideLabel = styleElement('div', styles, 'SideLabel');
const IconComp = styleElement(Icon, styles, 'Icon');

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