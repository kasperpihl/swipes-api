import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import * as menuActions from 'src/redux/menu/menuActions';
import * as mainActions from 'src/redux/main/mainActions';
import * as fileActions from 'swipes-core-js/redux/file/fileActions';
import * as noteActions from 'swipes-core-js/redux/note/noteActions';
import { setupLoading } from 'swipes-core-js/classes/utils';
import request from 'swipes-core-js/utils/request';
import { setupDelegate } from 'react-delegate';
import Button from 'src/react/_components/Button/Button';
import FormModal from 'src/react/_components/FormModal/FormModal';
import { fromJS } from 'immutable';
import { EditorState, convertToRaw } from 'draft-js';
import SW from './AttachButton.swiss';
import navWrapper from 'src/react/_Layout/view-controller/NavWrapper';

@navWrapper
@connect(
  state => ({
    myId: state.me.get('id')
  }),
  {
    chooseAttachmentType: menuActions.chooseAttachmentType,
    // createLink: linkActions.create,
    createNote: noteActions.create,
    createFile: fileActions.create,
    subscribeToDrop: mainActions.subscribeToDrop,
    unsubscribeFromDrop: mainActions.unsubscribeFromDrop
  }
)
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileVal: ''
    };

    setupDelegate(this, 'onAddedAttachment', 'onAttachButtonCloseOverlay');
    setupLoading(this);
  }

  onChangeFiles = e => {
    this.setState({ fileVal: e.target.value });
    this.onUploadFiles(e.target.files);
  };
  onUploadFiles(files) {
    const { createFile } = this.props;
    this.setLoading('attach');
    createFile(files).then(res => {
      if (res.ok) {
        this.createLinkFromTypeIdTitle(
          'file',
          res.file.id,
          res.file.original_title
        );
        this.setState({ fileVal: '' });
      } else {
        this.clearLoading('attach', '!Something went wrong');
      }
    });
  }
  onChooseAttachment = e => {
    const { chooseAttachmentType, openModal, createNote } = this.props;
    const options = this.getOptionsForE(e);
    options.onClose = this.onAttachButtonCloseOverlay;
    chooseAttachmentType(options).then(item => {
      if (item.id === 'upload') {
        this.hiddenInput.click();
        return;
      }
      const confirmLabel = 'Add';
      let placeholder = 'Title of the note';
      if (item.id === 'url') {
        placeholder = 'http://';
      }

      openModal(FormModal, {
        inputs: [{ type: 'text', placeholder }],
        confirmLabel,
        onConfirm: ([title]) => {
          if (title && title.length) {
            this.setLoading('attach');
            if (item.id === 'url') {
              this.createLinkFromTypeIdTitle(item.id, title, title);
            } else {
              createNote(
                convertToRaw(EditorState.createEmpty().getCurrentContent())
              ).then(res => {
                if (res && res.ok) {
                  this.createLinkFromTypeIdTitle(item.id, res.note.id, title);
                } else {
                  this.clearLoading('attach');
                }
              });
            }
          }
        }
      });
    });
  };
  getSwipesLinkObj(type, id, title) {
    const { myId } = this.props;
    return {
      service: {
        name: 'swipes',
        type,
        id
      },
      permission: {
        account_id: myId
      },
      meta: {
        title
      }
    };
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'center'
    };
  }
  createLinkFromTypeIdTitle(type, id, title) {
    const link = this.getSwipesLinkObj(type, id, title);
    request('links.create', { link }).then(res => {
      let clear = undefined;
      if (res.ok) {
        const att = fromJS({ link: res.link, title });
        clear = this.onAddedAttachment(
          att,
          this.clearLoading.bind(null, 'attach')
        );
      }
      if (clear === undefined) {
        this.clearLoading('attach');
      }
    });
  }

  onDropFiles = files => {
    this.onUploadFiles(files);
  };

  render() {
    const { fileVal } = this.state;

    return (
      <Fragment>
        <Button.Standard
          onClick={this.onChooseAttachment}
          status={this.getLoading('attach')}
          icon="Attach"
        />
        <SW.HiddenInput
          value={fileVal}
          innerRef={c => (this.hiddenInput = c)}
          type="file"
          onChange={this.onChangeFiles}
        />
      </Fragment>
    );
  }
}
