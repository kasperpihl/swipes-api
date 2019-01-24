import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import navWrapper from 'src/react/_Layout/view-controller/NavWrapper';
import SW from './Attachment.swiss';
import * as mainActions from 'src/redux/main/mainActions';

@navWrapper
@connect(
  null,
  {
    browser: mainActions.browser
  }
)
export default class Attachment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showCloseIcon: null
    };
  }
  handleClick = e => {
    const { openSecondary, attachment, browser, target } = this.props;
    const type = attachment.get('type');
    if (type === 'url') {
      return browser(target, attachment.get('id'));
    }
    if (type === 'note') {
      return openSecondary({
        id: 'Note',
        title: 'Note',
        props: {
          noteId: attachment.get('id')
        }
      });
    }

    openSecondary({
      id: 'File',
      title: 'File',
      props: {
        fileId: attachment.get('id')
      }
    });
  };
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
  getIcon() {
    const { attachment } = this.props;
    switch (attachment.get('type')) {
      case 'url':
        return 'Hyperlink';
      case 'note':
        return 'Note';
      default:
        return 'File';
    }
  }
  render() {
    const { showCloseIcon } = this.state;
    const { attachment, onClose } = this.props;
    const icon = this.getIcon();

    return (
      <SW.ATag
        className="attachment-container"
        onClick={this.handleClick}
        onMouseEnter={onClose && this.onMouseEnter}
        onMouseLeave={onClose && this.onMouseLeave}
      >
        <SW.IconContainer
          className="icon-container"
          onClick={showCloseIcon && this.handleClose}
        >
          <SW.Icon
            icon={showCloseIcon || icon}
            hasCloseIcon={!!showCloseIcon}
          />
        </SW.IconContainer>
        <SW.Text hasCloseIcon={!!showCloseIcon}>
          {attachment.get('title')}
        </SW.Text>
      </SW.ATag>
    );
  }
}
