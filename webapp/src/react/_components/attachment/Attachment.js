import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import withNav from 'src/react/_hocs/Nav/withNav';
import SW from './Attachment.swiss';
import * as mainActions from 'src/redux/main/mainActions';

@withNav
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
    const { nav, attachment, browser } = this.props;
    const type = attachment.get('type');
    if (type === 'url') {
      return browser(nav.side, attachment.get('id'));
    }
    if (type === 'note') {
      return nav.openRight({
        screenId: 'Note',
        crumbTitle: 'Note',
        props: {
          noteId: attachment.get('id')
        }
      });
    }

    nav.openRight({
      screenId: 'File',
      crumbTitle: 'File',
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
        <SW.Text hasCloseIcon={!!showCloseIcon}>
          {attachment.get('title')}
        </SW.Text>
      </SW.ATag>
    );
  }
}
