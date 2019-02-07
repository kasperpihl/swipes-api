import React, { PureComponent, Fragment } from 'react';
import fileUpload from 'swipes-core-js/utils/fileUpload';
import request from 'swipes-core-js/utils/request';
import withLoader from 'src/react/_hocs/withLoader';
import contextMenu from 'src/utils/contextMenu';
import Button from 'src/react/_components/Button/Button';
import FormModal from 'src/react/_components/FormModal/FormModal';
import ListMenu from 'src/react/_components/ListMenu/ListMenu';
import SW from './AttachButton.swiss';
import withNav from 'src/react/_hocs/Nav/withNav';

const kFile = 0;
const kUrl = 1;
const kNote = 2;

@withLoader
@withNav
export default class extends PureComponent {
  state = {
    fileVal: ''
  };

  onChangeFiles = e => {
    this.setState({ fileVal: e.target.value });
    this.onUploadFiles(e.target.files);
  };
  async onUploadFiles(files) {
    const { loader, ownedBy } = this.props;
    loader.set('attach');
    const res = await fileUpload(files, ownedBy);
    if (res.ok) {
      loader.clear('attach');
      this.addAttachment('file', res.file.file_id, res.file.file_name);
      this.setState({ fileVal: '' });
    } else {
      loader.error('attach', 'Something went wrong');
    }
  }
  addAttachment(type, id, title) {
    const { onAttach } = this.props;
    onAttach &&
      onAttach({
        type,
        id,
        title
      });
  }
  createNote(title) {
    const { loader, ownedBy } = this.props;
    loader.set('attach');
    request('note.add', {
      title,
      owned_by: ownedBy
    }).then(res => {
      if (res.ok) {
        loader.clear('attach');
        this.addAttachment('note', res.note.note_id, title);
      } else {
        loader.error('attach', res.error, 3000);
      }
    });
  }
  callbackChoseAttachmentType = (i, chosen) => {
    const { nav } = this.props;
    switch (i) {
      case kFile: {
        this.hiddenInput.click();
        return;
      }
      default: {
        const confirmLabel = 'Add';
        let placeholder = 'Title of the note';
        if (i === kUrl) {
          placeholder = 'http://';
        }
        nav.openModal(FormModal, {
          inputs: [{ type: 'text', placeholder, autoFocus: true }],
          confirmLabel,
          onConfirm: ([title]) => {
            if (title && title.length) {
              if (i === kUrl) {
                let id = title;
                if (title.indexOf('://') > -1) {
                  title = title.substr(title.indexOf('://') + 3);
                } else {
                  id = `https://${title}`;
                }

                this.addAttachment('url', id, title);
              } else {
                this.createNote(title);
              }
            }
          }
        });
      }
    }
  };
  handleChooseType = e => {
    contextMenu(ListMenu, e, {
      onClick: this.callbackChoseAttachmentType,
      buttons: [
        { title: 'Upload a file', icon: 'File' },
        { title: 'Add URL', icon: 'Hyperlink' },
        { title: 'New note', icon: 'Note' }
      ]
    });
  };

  render() {
    const { loader } = this.props;
    const { fileVal } = this.state;

    return (
      <Fragment>
        <Button.Standard
          onClick={this.handleChooseType}
          status={loader.get('attach')}
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
