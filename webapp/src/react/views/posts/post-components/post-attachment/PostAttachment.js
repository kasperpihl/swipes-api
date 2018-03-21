import React, { PureComponent } from 'react';
import { element } from 'react-swiss';
import Icon from 'Icon';
import sw from './PostAttachment.swiss';

const ATag = element('a', sw.ATag);
const Text = element('div', sw.Text);
const IconContainer = element('div', sw.IconContainer);
const IconComp = element(Icon, sw.Icon);

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