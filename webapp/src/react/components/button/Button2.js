import React, { PureComponent } from 'react';
import { styleElement, addGlobalStyles, SwissProvider } from 'react-swiss';
import Icon from 'Icon';
import styles from './Button.swiss';

const ATag = styleElement('a', styles, 'ATag');
const Title = styleElement('div', styles, 'Title');
const Background = styleElement('div', styles, 'Background');
const IconContainer = styleElement('div', styles, 'IconContainer');
const SideLabel = styleElement('div', styles, 'SideLabel');
const IconComp = styleElement(Icon, styles, 'Icon');
const LoaderCircle = styleElement('div', styles, 'LoaderCircle');

addGlobalStyles({
  '@keyframes button-loader': {
    '0%': { 
      WebkitTransform: 'scale(0)',
    },
    '100%': {
      WebkitTransform: 'scale(1.0)',
      opacity: 0,
    }
  }
})

class Button extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderIcon(status) {
    let { icon } = this.props;
    if(!icon && status === 'default') {
      return null;
    }

    if(status === 'error') icon = 'Close';
    if(status === 'success') icon = 'ChecklistCheckmark';

    let innerEl = <IconComp icon={icon} />;
    
    // Add loader/success/error icons if needed
    if(status === 'loading') {
      innerEl = <LoaderCircle />;
    }

    return (
      <IconContainer>
        {innerEl}
      </IconContainer>
    )
  }
  renderTitle() {
    const { title, loading, error, success, sideLabel } = this.props;

    if(sideLabel || (!title && !success && !error)) return null;

    // Show loading/success/error if needed
    const label = loading || error || success || title;

    return (
      <Title>{label}</Title>
    );
  }
  renderSideLabel() {
    const { sideLabel, loading, error, success } = this.props;
    if(!sideLabel) return null;

    // Show loading/success/error if needed
    const label = loading || error || success || sideLabel;
    
    return sideLabel && (
      <SideLabel>{label}</SideLabel>
    )
  }
  render() {
    const {
      title,
      sideLabel,
      compact,
      icon,
      loading,
      error,
      success,
      ...rest,
    } = this.props;

    let status = 'default';
    if(loading) status = 'loading';
    if(success) status = 'success';
    if(error) status = 'error';

    return (
      <SwissProvider
        hasIcon={status !== 'default' || !!icon}
        compact={compact}
        status={status}>
        <ATag className="gl-button" {...rest}>
          <Background>
            {this.renderIcon(status)}
            {this.renderTitle(status)}
          </Background>
          {this.renderSideLabel(status)}
        </ATag>
      </SwissProvider>
    );
  }
}

export default Button