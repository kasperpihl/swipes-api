import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import moment from 'moment';
import mime from 'react-native-mime-types';
import ImagePicker from 'react-native-image-picker';
import { setupDelegate } from 'react-delegate';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import AttachmentView from './AttachmentView'

class HOCAttachmentView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      attachments: props.initialAttachments || fromJS([]),
    };

    setupDelegate(this, 'handleAttach');
  }
  componentDidMount() {
  }
  getSwipesLinkObj(type, id, title) {
    const { myId } = this.props;
    return {
      service: {
        name: 'swipes',
        type,
        id,
      },
      permission: {
        account_id: myId,
      },
      meta: {
        title,
      },
    };
  }
  onAddAttachment() {
    const { createFile, createLink, showLoading } = this.props;

    const options = {
      title: 'Attach image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {

      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        const type = mime.lookup(response.uri) || 'application/octet-stream';
        const ext = mime.extension(type);
        const name = response.fileName
          || `Photo ${moment().format('MMMM Do YYYY, h:mm:ss a')}.${ext}`;
        const file = {
          name,
          uri: response.uri,
          type,
        };

        showLoading('Uploading');

        createFile([file]).then((fileRes) => {
          if (fileRes.ok) {
            const link = this.getSwipesLinkObj('file', fileRes.file.id, fileRes.file.title);

            createLink(link).then((res) => {
              showLoading();
              if (res.ok) {
                const att = fromJS({ link: res.link, title: fileRes.file.title });
                const { attachments } = this.state;
                this.handleAttach(att);

                this.setState({
                  attachments: attachments.push(att)
                })
              } else {
              }
            })
          } else {
            showLoading();
          }
        });
      }
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

const mapStateToProps = (state) => ({
  myId: state.getIn(['me', 'id']),
});

export default connect(mapStateToProps, {
  showLoading: a.main.loading,
  createFile: ca.files.create,
  createLink: ca.links.create,
  preview: a.links.preview,
})(HOCAttachmentView);
