import React, { PureComponent } from 'react';
import { styleElement } from 'react-swiss';
import Icon from 'Icon';
import styles from './PostAttachment.swiss';

const ATag = styleElement('a', styles, 'ATag');
const Text = styleElement('div', styles, 'Text');
const IconContainer = styleElement('div', styles, 'IconContainer');
const IconComp = styleElement(Icon, styles, 'Icon');

class PostAttachment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showCloseIcon: null,
    };
  }
  onClick = (e) => {
    const { onClick } = this.props;
    e.stopPropagation();
    onClick(e);
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
      <ATag 
        className="attachment-container"
        onClick={this.onClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <IconContainer className="icon-container" onClick={this.onClose}>
          <IconComp
            icon={showCloseIcon || this.props.icon}
            isContext={!!this.props.isContext}
            hasCloseIcon={!!showCloseIcon}
          />
        </IconContainer>
        <Text hasCloseIcon={!!showCloseIcon}>{this.props.title}</Text>
      </ATag>
    );
  }
}

export default PostAttachment;