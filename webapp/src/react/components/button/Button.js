import React, { PureComponent } from 'react';
import { SwissProvider } from 'swiss-react';
import SW from './Button.swiss';

export default class extends PureComponent {
  renderIcon(status) {
    let { icon } = this.props;
    if (!icon && status === 'default') {
      return null;
    }

    if (status === 'error') icon = 'Close';
    if (status === 'success') icon = 'ChecklistCheckmark';

    let innerEl = <SW.IconComp icon={icon} />;

    // Add loader/success/error icons if needed
    if (status === 'loading') {
      innerEl = <SW.LoaderCircle />;
    }

    return <SW.IconContainer>{innerEl}</SW.IconContainer>;
  }
  renderTitle() {
    const { title, loading, error, success, sideLabel } = this.props;

    if (sideLabel || (!title && !success && !error)) return null;

    // Show loading/success/error if needed
    const label = loading || error || success || title;

    return <SW.Title>{label}</SW.Title>;
  }
  renderSideLabel() {
    const { sideLabel, loading, error, success } = this.props;
    if (!sideLabel) return null;

    // Show loading/success/error if needed
    const label = loading || error || success || sideLabel;

    return sideLabel && <SW.SideLabel>{label}</SW.SideLabel>;
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
      className,
      ...rest
    } = this.props;

    let status = 'default';
    if (loading) status = 'loading';
    if (success) status = 'success';
    if (error) status = 'error';

    return (
      <SwissProvider
        hasIcon={status !== 'default' || !!icon}
        compact={compact}
        status={status}
      >
        <SW.ATag className={`gl-button ${className || ''}`.trim()} {...rest}>
          <SW.Background>
            {this.renderIcon(status)}
            {this.renderTitle(status)}
          </SW.Background>
          {this.renderSideLabel(status)}
        </SW.ATag>
      </SwissProvider>
    );
  }
}
