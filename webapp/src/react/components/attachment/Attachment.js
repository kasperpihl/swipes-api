import React, { PureComponent } from 'react';
import SW from './Attachment.swiss';

export default
class Attachment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showCloseIcon: null,
    };
  }
  onClick = (e) => {
    const { onClick } = this.props;
    if(typeof onClick === 'function') {
      e.stopPropagation();
      onClick(e);
    }
  }
  onClose = (e) => {
    const { onClose } = this.props;
    if(typeof onClose === 'function') {
      e.stopPropagation();
      onClose(e);
    }
  }
  onMouseEnter = () => {
    if(typeof this.props.onClose === 'function') {
      this.setState({ showCloseIcon: 'Close' });
    }
  }
  onMouseLeave = () => {
    if(this.state.showCloseIcon) {
      this.setState({ showCloseIcon: null });
    }
  }

  render() {
    const { showCloseIcon } = this.state;

    return (
      <SW.ATag 
        className="attachment-container"
        onClick={this.onClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <SW.IconContainer className="icon-container" onClick={this.onClose}>
          <SW.Icon
            icon={showCloseIcon || this.props.icon}
            isContext={!!this.props.isContext}
            hasCloseIcon={!!showCloseIcon}
          />
        </SW.IconContainer>
        <SW.Text hasCloseIcon={!!showCloseIcon}>{this.props.title}</SW.Text>
      </SW.ATag>
    );
  }
}
