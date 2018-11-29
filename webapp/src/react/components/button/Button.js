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
  renderSideLabel(status) {
    const { sideLabel } = this.props;
    if (!sideLabel) return null;

    return sideLabel && <SW.SideLabel>{status}</SW.SideLabel>;
  }
  render() {
    const {
      title,
      sideLabel,
      icon,
      loading,
      error,
      success,
      className,
      size,
      rounded,
      textOutside,
      selected,
      showPopupText,
      popupText,
      numberOfLines,
      ...rest
    } = this.props;

    let status = '';
    if (loading) status = 'loading';
    if (success) status = 'success';
    if (error) status = 'error';

    return (
      <SwissProvider
        hasIcon={status !== 'default' || !!icon}
        status={status}
        rounded={rounded}
        size={size}
        selected={selected}
      >
        <SW.ATag className={`gl-button ${className || ''}`.trim()} {...rest}>
          <SW.PopupBox show={showPopupText} numberOfLines={numberOfLines}>
            <SW.PopupText>{popupText}</SW.PopupText>
          </SW.PopupBox>
          <SW.Background>
            {this.renderIcon(status)}
            {this.renderTitle()}
          </SW.Background>
          {this.renderSideLabel(status)}
          <SW.Title textOutside={!!textOutside}>Text</SW.Title>
        </SW.ATag>
      </SwissProvider>
    );
  }
}
