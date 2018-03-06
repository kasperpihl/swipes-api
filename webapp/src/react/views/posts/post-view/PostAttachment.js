import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { element } from 'react-swiss';
import { attachmentIconForService } from 'swipes-core-js/classes/utils';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import Icon from 'Icon';
import * as a from 'actions';
import sw from './PostAttachment.swiss';

const ATag = element('a', sw.ATag);
const Text = element('div', sw.Text);
const IconContainer = element('div', sw.IconContainer);
const IconComp = element(Icon, sw.Icon);

class PostAttachment extends PureComponent {
  onClick = () => {
    const { attachment, target, preview } = this.props;
    preview(target, attachment);
  }
  onClose = (e) => {
    const { onClose, attachment, index } = this.props;
    e.stopPropagation();
    onClose(attachment, index);
  }
  renderCloseButton() {
    const { onClose } = this.props;
    if(typeof onClose !== 'function') {
      return null;
    }
  }

  render() {
    const {
      attachment,
    } = this.props;
    const icon = attachmentIconForService(attachment.getIn(['link', 'service']));

    return (
      <ATag className="attachment-container" onClick={this.onClick}>
        <IconContainer>
          <IconComp icon={icon} />
        </IconContainer>
        <Text>{attachment.get('title')}</Text>
      </ATag>
    );
  }
}

export default navWrapper(connect(null, {
  preview: a.links.preview,
})(PostAttachment));