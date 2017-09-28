import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { setupDelegate } from 'react-delegate';
import * as a from 'actions';
import AttachmentView from './AttachmentView'

class HOCAttachmentView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      attachments: props.initialAttachments || fromJS([]),
    };

    setupDelegate(this, 'handleAttach');
  }
  onAddAttachment() {
    const { uploadAttachment } = this.props;
    uploadAttachment((att) => {
      const { attachments } = this.state;
      this.handleAttach(att);

      this.setState({
        attachments: attachments.push(att)
      })
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

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
  uploadAttachment: a.attachments.upload,
  preview: a.attachments.preview,
})(HOCAttachmentView);
