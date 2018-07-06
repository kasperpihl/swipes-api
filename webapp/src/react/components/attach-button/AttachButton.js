import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import * as menuActions from 'src/redux/menu/menuActions';
import * as mainActions from 'src/redux/main/mainActions';
import * as ca from 'swipes-core-js/actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
import { setupDelegate } from 'react-delegate';
import Button from 'src/react/components/button/Button';
import { fromJS } from 'immutable';
import { EditorState, convertToRaw } from 'draft-js';
import SW from './AttachButton.swiss';
import navWrapper from 'src/react/app/view-controller/NavWrapper';

@navWrapper
@connect(state => ({
  myId: state.getIn(['me', 'id']),
}), {
  inputMenu: menuActions.input,
  chooseAttachmentType: menuActions.chooseAttachmentType,
  createLink: ca.links.create,
  createNote: ca.notes.create,
  createFile: ca.files.create,
  subscribeToDrop: mainActions.subscribeToDrop,
  unsubscribeFromDrop: mainActions.unsubscribeFromDrop,
})

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileVal: '',
    };

    setupDelegate(this, 'onAddedAttachment', 'onAttachButtonCloseOverlay');
    setupLoading(this);
  }

  componentDidMount() {
    const { subscribeToDrop, target, dropTitle } = this.props;
    subscribeToDrop(target, this.onDropFiles, dropTitle);
  }

  componentWillUnmount() {
    const { unsubscribeFromDrop, target } = this.props;
    unsubscribeFromDrop(target, this.onDropFiles);
  }

  onChangeFiles = (e) => {
    this.setState({ fileVal: e.target.value });
    this.onUploadFiles(e.target.files);
  }
  onUploadFiles(files) {
    const { createFile } = this.props;
    this.setLoading('attach');
    createFile(files).then((res) => {
      if (res.ok) {
        this.createLinkFromTypeIdTitle('file', res.file.id, res.file.original_title);
        this.setState({ fileVal: '' });
      } else {
        this.clearLoading('attach', '!Something went wrong');
      }
    });
  }
  onChooseAttachment = (e) => {
    const { chooseAttachmentType, inputMenu, createNote } = this.props;
    const options = this.getOptionsForE(e);
    options.onClose = this.onAttachButtonCloseOverlay;
    chooseAttachmentType(options).then((item) => {
      if (item.id === 'upload') {
        this.hiddenInput.click();
        return;
      }
      options.buttonLabel = 'Add';
      if (item.id === 'note') {
        options.placeholder = 'Title of the note';
      } else if (item.id === 'url') {
        options.placeholder = 'http://';
      }
      inputMenu(options, (title) => {
        if (title && title.length) {
          this.setLoading('attach');
          if (item.id === 'url') {
            this.createLinkFromTypeIdTitle(item.id, title, title);
          } else {
            createNote(convertToRaw(EditorState.createEmpty().getCurrentContent())).then((res) => {
              if (res && res.ok) {
                this.createLinkFromTypeIdTitle(item.id, res.note.id, title);
              } else {
                this.clearLoading('attach');
              }
            });
          }
        }
      });
    })
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
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'center',
    }
  }
  createLinkFromTypeIdTitle(type, id, title) {
    const link = this.getSwipesLinkObj(type, id, title);
    const { createLink } = this.props;
    createLink(link).then((res) => {
      let clear = undefined;
      if (res.ok) {
        const att = fromJS({ link: res.link, title });
        clear = this.onAddedAttachment(att, this.clearLoading.bind(null, 'attach'));
      }
      if(clear === undefined){
        this.clearLoading('attach');
      }
    });
  }

  onDropFiles = (files) => {
    this.onUploadFiles(files);
    console.log('Attached files', files);
  }

  render() {
    const { fileVal } = this.state;
    const {
      buttonProps
    } = this.props;

    return (
      <Fragment>
        <Button
          onClick={this.onChooseAttachment}
          {...this.getLoading('attach')}
          icon="Attach"
          {...buttonProps}
        />
        <SW.HiddenInput
          value={fileVal}
          innerRef={c => this.hiddenInput = c}
          type="file"
          onChange={this.onChangeFiles}
        />
      </Fragment>
    );
  }
}
