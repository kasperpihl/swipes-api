import React, { PureComponent } from 'react';
import withNav from 'src/react/_hocs/Nav/withNav';
import SW from './Attachment.swiss';
import AttachmentHOC from './AttachmentHOC';

@withNav
export default class Attachment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showCloseIcon: null
    };
  }
  handleClose = e => {
    const { onClose } = this.props;
    if (typeof onClose === 'function') {
      e.stopPropagation();
      onClose(e);
    }
  };
  onMouseEnter = () => {
    this.setState({ showCloseIcon: 'Close' });
  };
  onMouseLeave = () => {
    this.setState({ showCloseIcon: null });
  };
  render() {
    const { showCloseIcon } = this.state;
    const { attachment, onClose } = this.props;

    return (
      <AttachmentHOC attachment={attachment}>
        {(icon, onClick) => (
          <SW.ATag
            onClick={this.handleClick}
            onMouseEnter={onClose && this.onMouseEnter}
            onMouseLeave={onClose && this.onMouseLeave}
          >
            <SW.IconContainer onClick={showCloseIcon && this.handleClose}>
              <SW.Icon
                icon={showCloseIcon || icon}
                hasCloseIcon={!!showCloseIcon}
              />
            </SW.IconContainer>
            <SW.Text hasCloseIcon={!!showCloseIcon}>{attachment.title}</SW.Text>
          </SW.ATag>
        )}
      </AttachmentHOC>
    );
  }
}
