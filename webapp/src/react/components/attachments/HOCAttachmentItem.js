import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as a from 'actions';
import { attachmentIconForService, bindAll } from 'swipes-core-js/classes/utils';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import Icon from 'Icon';

import './styles/attachment-item.scss';

class HOCAttachmentItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    bindAll(this, ['onAttachmentClick']);
  }
  componentDidMount() {
  }
  onAttachmentClick() {
    const { attachment, target, preview } = this.props;
    preview(target, attachment);
  }
  render() {
    const { attachment } = this.props;
    return (
      <div className="attachment-item" onClick={this.onAttachmentClick}>
        <Icon
          icon={attachmentIconForService(attachment.getIn(['link', 'service']))}
          className="attachment-item__svg"
        />
        <div className="attachment-item__label">
          {attachment.get('title')}
        </div>
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