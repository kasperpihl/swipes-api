import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { setupDelegate } from 'react-delegate';
import * as a from 'actions';
import AttachmentView from './AttachmentView';

class HOCAttachmentView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      attachments: props.initialAttachments || fromJS([]),
    };
    this.onChooseAttachmentTypeToAdd = this.onChooseAttachmentTypeToAdd.bind(this);
    this.onAddAttachment = this.onAddAttachment.bind(this);
    setupDelegate(this, 'handleAttach');
  }
  onChooseAttachmentTypeToAdd() {
    const { actionModal } = this.props;

    actionModal({
      title: 'Add attachment',
      onItemPress: this.onAddAttachment,
      items: fromJS([
        { id: 'url', title: 'Add a URL' },
        { id: 'image', title: 'Upload an image' },
      ]),
    });
  }
  onAddAttachment(id) {
    const { uploadAttachment } = this.props;

    uploadAttachment(id, (att) => {
      const { attachments } = this.state;
      this.handleAttach(att);

      this.setState({
        attachments: attachments.push(att),
      });
    });
  }
  onAttachmentPress(att) {
    const { preview } = this.props;

    preview(att);
  }
  render() {
    const { attachments } = this.state;

    return (
      <AttachmentView delegate={this} attachments={attachments} />
    );
  }
}
// const { string } = PropTypes;

HOCAttachmentView.propTypes = {};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {
  uploadAttachment: a.attachments.upload,
  preview: a.attachments.preview,
  actionModal: a.modals.action,
})(HOCAttachmentView);
