import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as a from 'actions';
import { setupDelegate } from 'react-delegate';
import { attachmentIconForService, bindAll } from 'swipes-core-js/classes/utils';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import Icon from 'Icon';

import './styles/attachment-item.scss';

class HOCAttachmentItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    bindAll(this, ['onClick', 'onClose']);
    setupDelegate(this, 'onAttachmentClose')
  }
  componentDidMount() {
  }
  onClick() {
    const { attachment, target, preview } = this.props;
    preview(target, attachment);
  }
  onClose(e) {
    const { index } = this.props;
    e.stopPropagation();
    this.onAttachmentClose(index, e);
  }
  renderCloseButton() {
    const { noClose } = this.props;
    if(noClose) {
      return null;
    }
    return (
      <div className="attachment-item__delete-icon" onClick={this.onClose}>
        <Icon
          icon="Close"
          className="attachment-item__svg"
        />
      </div>
    );
  }
  render() {
    const { attachment } = this.props;
    return (
      <div className="attachment-item" onClick={this.onClick}>
        <div className="attachment-item__type-icon">
          <Icon
            icon={attachmentIconForService(attachment.getIn(['link', 'service']))}
            className="attachment-item__svg"
          />
        </div>
        <div className="attachment-item__label">
          {attachment.get('title')}
        </div>
        {this.renderCloseButton()}
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default navWrapper(connect(mapStateToProps, {
  preview: a.links.preview,
})(HOCAttachmentItem));
